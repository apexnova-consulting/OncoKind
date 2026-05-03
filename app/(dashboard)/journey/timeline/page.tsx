import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { CareTimeline } from '@/components/care/CareTimeline';
import { getProfile } from '@/lib/auth';
import { getPendingCheckInPrompt } from '@/lib/check-ins';
import { Button } from '@/components/ui/button';
import { formatReadableDate } from '@/lib/time';

export default async function TimelinePage() {
  const { isPro } = await getProfile();
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const pendingCheckIn = await getPendingCheckInPrompt(user.id);

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
      {pendingCheckIn ? (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm text-amber-900">
            How did your {formatReadableDate(pendingCheckIn.appointment_at)} appointment go?{' '}
            <Link href={`/journey/check-in/${pendingCheckIn.id}`} className="font-semibold underline underline-offset-2">
              Take 60-second check-in →
            </Link>
          </p>
        </div>
      ) : null}
      {!isPro && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-700">
            The full Care Timeline experience is included with Advocate Plan. Upgrade to unlock advanced milestone tools
            and exports.
          </p>
          <Button asChild className="mt-3">
            <Link href="/pricing?plan=advocate">Upgrade to Advocate Plan</Link>
          </Button>
        </div>
      )}
      <div className="mt-6">
        <CareTimeline initialEntries={entries ?? []} />
      </div>
      <p className="text-sm text-slate-500">
        Need a moment?{' '}
        <Link href="/quiet-room" className="font-semibold text-primary hover:underline">
          → The Quiet Room
        </Link>
      </p>
    </div>
  );
}
