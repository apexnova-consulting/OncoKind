import { Suspense } from 'react';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { PriorAuthDashboard } from '@/components/prior-auth/PriorAuthDashboard';

export default async function PriorAuthPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: cases }, { data: profile }] = await Promise.all([
    supabase
      .from('prior_auth_cases')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(50),
    supabase.from('profiles').select('full_name, organization_id').eq('id', user!.id).single(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500">Loading your cases&hellip;</div>
      }
    >
      <PriorAuthDashboard initialCases={cases || []} userName={profile?.full_name || ''} />
    </Suspense>
  );
}
