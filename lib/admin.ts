import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const getAdminContext = cache(async () => {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user ?? null;

  if (!user) {
    return { user: null, isAdmin: false };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, email, subscription_tier')
    .eq('id', user.id)
    .maybeSingle();

  // ADMIN_EMAILS: comma-separated list of admin emails for production.
  // QA_ADMIN_EMAILS: additional test accounts granted admin access (e.g. qa-admin@oncokind.com).
  const adminEmailsRaw = [
    process.env.ADMIN_EMAILS ?? '',
    process.env.QA_ADMIN_EMAILS ?? '',
  ].join(',');
  const allowedEmails = adminEmailsRaw
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  const email = (profile?.email ?? user.email ?? '').toLowerCase();
  const isAdmin =
    Boolean(profile?.is_admin) ||
    profile?.subscription_tier === 'enterprise' ||
    (email ? allowedEmails.includes(email) : false);

  return { user, isAdmin };
});

export async function requireAdmin() {
  const context = await getAdminContext();
  if (!context.user) {
    redirect('/login');
  }
  if (!context.isAdmin) {
    redirect('/dashboard');
  }
  return context;
}
