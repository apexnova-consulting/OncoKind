import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getProfile() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return {
    user: null,
    profile: null,
    isPro: false,
    hasAdvocateAccess: false,
    isProfessional: false,
    isAdmin: false,
  };
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_tier, stripe_customer_id, is_admin, email')
    .eq('id', user.id)
    .single();

  const tier = profile?.subscription_tier ?? 'free';

  const allowedAdminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const profileEmail = (profile?.email ?? user.email ?? '').toLowerCase();
  const isAdmin =
    Boolean(profile?.is_admin) ||
    tier === 'enterprise' ||
    (profileEmail ? allowedAdminEmails.includes(profileEmail) : false);

  // isPro: any paid tier (pro, advocate, professional, enterprise) or admin
  const isPro =
    isAdmin ||
    tier === 'pro' ||
    tier === 'advocate' ||
    tier === 'professional' ||
    tier === 'enterprise';

  const hasAdvocateAccess =
    isAdmin ||
    tier === 'advocate' ||
    tier === 'professional' ||
    tier === 'enterprise';

  const isProfessional =
    isAdmin ||
    tier === 'professional' ||
    tier === 'enterprise';

  return { user, profile, isPro, hasAdvocateAccess, isProfessional, isAdmin };
}
