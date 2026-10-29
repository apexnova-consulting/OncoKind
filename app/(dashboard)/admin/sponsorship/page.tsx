import { redirect } from 'next/navigation';
import { getProfile } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { isAfter90FlagOn } from '@/lib/after-90/config';

export default async function SponsorshipAdminPage() {
  if (!isAfter90FlagOn('orgSponsorship')) redirect('/dashboard');
  const { isAdmin, profile } = await getProfile();
  const supabase = await createServerSupabaseClient();
  const orgId = (profile as { organization_id?: string } | null)?.organization_id;
  if (!isAdmin && !orgId) redirect('/dashboard');
  const { data: counts } = orgId
    ? await supabase.from('org_dashboard_counts').select('*').eq('organization_id', orgId).maybeSingle()
    : { data: null };

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold">Organization dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">Counts only. Never names, diagnoses, or documents.</p>
      <ul className="mt-6 space-y-2 text-sm">
        <li>Seats used: {counts?.seats_used ?? 0}</li>
        <li>Seats purchased: {counts?.seats_purchased ?? 0}</li>
        <li>Active families: {counts?.active_families ?? 0}</li>
        <li>Case Ready families: {counts?.case_ready_families ?? 0}</li>
      </ul>
    </main>
  );
}
