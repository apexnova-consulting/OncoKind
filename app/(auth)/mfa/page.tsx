import { redirect } from 'next/navigation';
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

  return (
    <main className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <MfaSecurityPanel challengeOnly />
    </main>
  );
}
