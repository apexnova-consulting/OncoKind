import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { MfaSecurityPanel } from '@/components/security/MfaSecurityPanel';

export default async function SecurityPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('mfa_enabled')
    .eq('id', user.id)
    .maybeSingle();

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Security Center</h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Turn on multi-factor authentication to require an authenticator code after password sign-in.
        </p>
      </div>
      <MfaSecurityPanel initialEnabled={profile?.mfa_enabled ?? false} />
    </main>
  );
}
