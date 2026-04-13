import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { CareTimeline } from '@/components/care/CareTimeline';
import { getProfile } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export default async function TimelinePage() {
  const { isPro } = await getProfile();
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
      {!isPro && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-700">
            The full Care Timeline experience is included with Caregiver Pro. Upgrade to unlock advanced milestone tools
            and exports.
          </p>
          <Button asChild className="mt-3">
            <Link href="/dashboard/billing">Upgrade to Caregiver Pro</Link>
          </Button>
        </div>
      )}
      <div className="mt-6">
        <CareTimeline initialEntries={entries ?? []} />
      </div>
    </div>
  );
}
