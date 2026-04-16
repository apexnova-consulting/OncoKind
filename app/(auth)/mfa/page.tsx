import { redirect } from 'next/navigation';
import { readAalFromAccessToken } from '@/lib/auth-security';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { MfaSecurityPanel } from '@/components/security/MfaSecurityPanel';

export default async function MfaPage() {
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
  if (!profile?.mfa_enabled || aal === 'aal2') {
    redirect('/journey');
  }

  return (
    <main className="min-h-screen bg-[var(--color-bg-page)] px-4 py-10 sm:py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8">
        <div className="max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            OncoKind Security
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-[var(--color-primary-900)] sm:text-4xl">
            Finish sign-in with your authenticator app
          </h1>
          <p className="mt-3 text-[var(--color-text-secondary)]">
            We use branded, caregiver-friendly security flows so account protection feels clear and trustworthy.
          </p>
        </div>
        <MfaSecurityPanel challengeOnly />
      </div>
    </main>
  );
}
