import { NextRequest, NextResponse } from 'next/server';
import { getProfile } from '@/lib/auth';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { encryptJson, toSupabaseBytea } from '@/lib/encryption';
import { containsCrisisLanguage } from '@/lib/agents/safety';
import { weeklyCohortPriceCents, conciergeCapacityCap } from '@/lib/concierge/config';

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled('concierge_public_pages')) {
    return NextResponse.json({ error: 'Concierge is not available.' }, { status: 404 });
  }
  const { user } = await getProfile();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });

  const body = (await request.json()) as Record<string, string>;
  const blob = JSON.stringify(body);
  if (containsCrisisLanguage(blob)) {
    return NextResponse.json({
      error: 'If you are in crisis, call or text 988. Cancer Support Community: 1-888-793-9355.',
    }, { status: 400 });
  }
  if (/\b(under 18|age 17|pediatric|child patient)\b/i.test(blob)) {
    return NextResponse.json({
      error: 'OncoKind Concierge is for adult patients. Pediatric resources: https://www.cancer.gov/types/childhood-cancers',
    }, { status: 400 });
  }

  const priceShown = weeklyCohortPriceCents();
  if (isFeatureEnabled('concierge_purchase')) {
    try {
      const supabase = await createServerSupabaseClient();
      const { count } = await supabase
        .from('concierge_cases')
        .select('id', { count: 'exact', head: true })
        .in('state', ['purchased', 'intake_incomplete', 'authorization_pending', 'authorized', 'in_progress']);
      if ((count ?? 0) >= conciergeCapacityCap()) {
        return NextResponse.json({
          message: 'We are at capacity. You are on the waitlist and we will email when a slot opens.',
          waitlist: true,
          priceShown,
        });
      }
      await supabase.from('concierge_cases').insert({
        user_id: user.id,
        state: 'intake_incomplete',
        price_shown_cents: priceShown,
        intake_encrypted: toSupabaseBytea(encryptJson(body)),
      });
    } catch {
      // Tables may not be applied yet.
    }
  }

  return NextResponse.json({
    ok: true,
    priceShown,
    purchaseEnabled: isFeatureEnabled('concierge_purchase'),
    message: isFeatureEnabled('concierge_purchase')
      ? 'Intake saved. Continue to authorization when you are ready.'
      : 'Intake request saved. Purchase stays off until counsel, security, and staffing gates pass. We will contact you when a case can start.',
  });
}
