import { createServerSupabaseClient } from '@/lib/supabase-server';
import {
  hasCareAdvocacyAccess,
  hasKindAuthSelfServe,
  hasMultiPatientAccess,
} from '@/lib/entitlements';

const GRACE_PERIOD_MS = 3 * 24 * 60 * 60 * 1000;

export async function getProfile() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  if (!user) return {
    user: null,
    profile: null,
    isPro: false,
    hasAdvocateAccess: false,
    hasKindAuthAccess: false,
    isProfessional: false,
    isAdmin: false,
  };
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_tier, stripe_customer_id, is_admin, email, updated_at')
    .eq('id', user.id)
    .single();

  const tier = profile?.subscription_tier ?? 'free';
  const pastDueExpired =
    profile?.subscription_status === 'past_due' &&
    typeof profile.updated_at === 'string' &&
    Date.now() - new Date(profile.updated_at).getTime() > GRACE_PERIOD_MS;
  const effectiveTier = pastDueExpired ? 'free' : tier;

  const allowedAdminEmails = [
    process.env.ADMIN_EMAILS ?? '',
    process.env.QA_ADMIN_EMAILS ?? '',
  ].join(',')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const profileEmail = (profile?.email ?? user.email ?? '').toLowerCase();
  const isAdmin =
    Boolean(profile?.is_admin) ||
    tier === 'enterprise' ||
    (profileEmail ? allowedAdminEmails.includes(profileEmail) : false);

  const isPro = isAdmin || hasCareAdvocacyAccess(effectiveTier);
  const hasAdvocateAccess = isAdmin || hasCareAdvocacyAccess(effectiveTier);
  const hasKindAuthAccess = isAdmin || hasKindAuthSelfServe(effectiveTier);
  const isProfessional = isAdmin || hasMultiPatientAccess(effectiveTier);

  return {
    user,
    profile,
    isPro,
    hasAdvocateAccess,
    hasKindAuthAccess,
    isProfessional,
    isAdmin,
  };
}
