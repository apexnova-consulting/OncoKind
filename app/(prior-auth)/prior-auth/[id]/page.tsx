import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { CaseWorkspace } from '@/components/prior-auth/CaseWorkspace';

export default async function CasePage({ params }: { params: { id: string } }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: caseData } = await supabase
    .from('prior_auth_cases')
    .select(`*, prior_auth_drug_trials(*)`)
    .eq('id', params.id)
    .eq('user_id', user!.id)
    .single();

  if (!caseData) return notFound();

  return <CaseWorkspace caseData={caseData} />;
}
