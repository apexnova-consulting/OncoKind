import { redirect } from 'next/navigation';
import { readAalFromAccessToken } from '@/lib/auth-security';
import { getAdminContext } from '@/lib/admin';
import { getBrandTheme } from '@/lib/branding';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { DashboardNav } from '@/components/layout/DashboardNav';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();

  // Prefer getSession() first (local JWT validation, no network round-trip).
  // This avoids false-negative auth failures when Supabase rotates refresh
  // tokens due to concurrent logins (e.g., in parallel test workers).
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect('/login');
  }

  const user = session.user;

  const { data: profile } = await supabase
    .from('profiles')
    .select('mfa_enabled, subscription_tier')
    .eq('id', user.id)
    .maybeSingle();

  const aal = readAalFromAccessToken(session?.access_token);
  if (profile?.mfa_enabled && aal !== 'aal2') {
    redirect('/mfa');
  }

  const [brandTheme, adminContext] = await Promise.all([getBrandTheme(), getAdminContext()]);

  return (
    <>
      <DashboardNav
        brand={{
          displayName: brandTheme.displayName,
          logoUrl: brandTheme.logoUrl,
        }}
        isAdmin={adminContext.isAdmin}
        isProfessional={
          profile?.subscription_tier === 'professional' ||
          profile?.subscription_tier === 'enterprise'
        }
      />
      {children}
    </>
  );
}
