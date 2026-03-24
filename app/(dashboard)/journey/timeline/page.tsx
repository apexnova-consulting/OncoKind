import { createServerSupabaseClient } from '@/lib/supabase-server';
import { CareTimeline } from '@/components/care/CareTimeline';

export default async function TimelinePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: entries } = await supabase
    .from('care_timeline_entries')
    .select('id, milestone_type, title, notes, report_summary, prep_sheet_link, occurred_at, created_at')
    .eq('user_id', user.id)
    .order('occurred_at', { ascending: false });

  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-semibold text-accent">
        Care Timeline
      </h1>
      <p className="mt-2 text-slate-600">
        A living record of your care journey. Add milestones and export for second opinions.
      </p>
      <div className="mt-6">
        <CareTimeline initialEntries={entries ?? []} />
      </div>
    </div>
  );
}
