import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getProfile() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { user: null, profile: null, isPro: false, hasAdvocateAccess: false };
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, subscription_tier, stripe_customer_id')
    .eq('id', user.id)
    .single();
  const isPro =
    profile?.subscription_status === 'pro' ||
    profile?.subscription_tier === 'enterprise' ||
    profile?.subscription_tier === 'advocate';
  const hasAdvocateAccess =
    profile?.subscription_tier === 'advocate' ||
    profile?.subscription_tier === 'enterprise';
  return { user, profile, isPro, hasAdvocateAccess };
}
