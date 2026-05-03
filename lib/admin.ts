import { cache } from 'react';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const getAdminContext = cache(async () => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { user: null, isAdmin: false };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin, email')
    .eq('id', user.id)
    .maybeSingle();

  const allowedEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);

  const email = (profile?.email ?? user.email ?? '').toLowerCase();
  const isAdmin = Boolean(profile?.is_admin) || (email ? allowedEmails.includes(email) : false);

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
