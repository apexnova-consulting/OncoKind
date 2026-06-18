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
  };
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_tier, stripe_customer_id')
    .eq('id', user.id)
    .single();

  const tier = profile?.subscription_tier ?? 'free';

  // isPro: any paid tier (pro, advocate, professional, enterprise)
  const isPro =
    tier === 'pro' ||
    tier === 'advocate' ||
    tier === 'professional' ||
    tier === 'enterprise';

  const hasAdvocateAccess =
    tier === 'advocate' ||
    tier === 'professional' ||
    tier === 'enterprise';

  const isProfessional =
    tier === 'professional' ||
    tier === 'enterprise';

  return { user, profile, isPro, hasAdvocateAccess, isProfessional };
}
