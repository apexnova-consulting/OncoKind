import { NextResponse } from 'next/server';
import { getProfile } from '@/lib/auth';
import { isAfter90FlagOn } from '@/lib/after-90/config';
import { vaultAllowed } from '@/lib/after-90/vault';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST() {
  if (!isAfter90FlagOn('after90Phase') || !isAfter90FlagOn('recordsVault')) {
    return NextResponse.json({ error: 'Not available.' }, { status: 404 });
  }
  const { user, profile } = await getProfile();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const supabase = await createServerSupabaseClient();
  const { data: row } = await supabase
    .from('profiles')
    .select('vault_consent_at, subscription_tier')
    .eq('id', user.id)
    .maybeSingle();
  if (!vaultAllowed({ consentAt: row?.vault_consent_at, tier: row?.subscription_tier ?? profile?.subscription_tier })) {
    return NextResponse.json({ error: 'Records vault consent is required.' }, { status: 403 });
  }
  return NextResponse.json({
    message: 'Ready packet uses your saved summary, timeline, and latest reports. Open Second Opinion Mode only if you have Caregiver Pro. Ask your care team what this packet means.',
  });
}
