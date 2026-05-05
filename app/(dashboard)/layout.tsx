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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const [
    {
      data: { session },
    },
    { data: profile },
  ] = await Promise.all([
    supabase.auth.getSession(),
    supabase.from('profiles').select('mfa_enabled').eq('id', user.id).maybeSingle(),
  ]);

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
      />
      {children}
    </>
  );
}
