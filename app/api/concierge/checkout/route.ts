import { NextRequest, NextResponse } from 'next/server';
import { getProfile } from '@/lib/auth';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { createOneTimeCheckoutSession } from '@/lib/stripe';
import { weeklyCohortPriceCents } from '@/lib/concierge/config';
import { createServiceRoleSupabaseClient } from '@/lib/supabase-server';
import { conciergeWaitlistMessage, isConciergeAtWeeklyCap, weekStartUtc } from '@/lib/concierge/capacity';
import { canCoverConciergeFee, normalizeSponsorCode, type SponsoredCode } from '@/lib/concierge/sponsored';

export async function POST(request: NextRequest) {
  if (!isFeatureEnabled('concierge_purchase')) {
    return NextResponse.json({ error: 'Concierge purchase is not enabled.' }, { status: 404 });
  }
  const { user } = await getProfile();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as { refundAccepted?: boolean; sponsorCode?: string };
  if (!body.refundAccepted) {
    return NextResponse.json({ error: 'Please accept the refund terms before payment.' }, { status: 400 });
  }
  const admin = createServiceRoleSupabaseClient();
  const { count } = await admin
    .from('concierge_cases')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', weekStartUtc().toISOString())
    .not('state', 'in', '(cancelled,refunded)');
  if (isConciergeAtWeeklyCap(count ?? 0)) {
    return NextResponse.json({ error: conciergeWaitlistMessage(), waitlist: true }, { status: 409 });
  }
  const sponsorCode = normalizeSponsorCode(body.sponsorCode);
  if (sponsorCode) {
    const { data } = await admin
      .from('concierge_sponsored_codes')
      .select('code, partner_id, remaining, active')
      .eq('code', sponsorCode)
      .maybeSingle();
    const sponsored: SponsoredCode | null = data
      ? {
          code: data.code,
          partnerId: data.partner_id,
          remaining: data.remaining,
          active: data.active,
        }
      : null;
    if (canCoverConciergeFee(sponsored)) {
      await admin
        .from('concierge_sponsored_codes')
        .update({ remaining: Math.max(0, (sponsored?.remaining ?? 1) - 1) })
        .eq('code', sponsorCode);
      return NextResponse.json({
        url: '/journey/concierge?checkout=sponsored',
        covered: true,
        priceShown: '0',
      });
    }
  }
  const priceId = process.env.STRIPE_PRICE_ID_CONCIERGE ?? '';
  if (!priceId) return NextResponse.json({ error: 'Concierge price is not configured.' }, { status: 503 });
  const base = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
  const shown = String(weeklyCohortPriceCents());
  const session = await createOneTimeCheckoutSession({
    customerEmail: user.email ?? undefined,
    successUrl: `${base}/journey/concierge?checkout=success`,
    cancelUrl: `${base}/concierge`,
    priceId,
    userId: user.id,
    metadata: { price_shown_cents: shown, sponsor_code: sponsorCode },
  });
  if (session.url) return NextResponse.json({ url: session.url, priceShown: shown });
  return NextResponse.json({ error: 'Unable to start checkout.' }, { status: 500 });
}
