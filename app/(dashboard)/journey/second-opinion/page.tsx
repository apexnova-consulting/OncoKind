import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getPatientReport } from '@/lib/patient-reports';
import { Button } from '@/components/ui/button';
import { SecondOpinionPacket } from '@/components/care/SecondOpinionPacket';

type TimelineItem = {
  title: string;
  type: string;
  occurredAt: string;
  notes?: string | null;
};

export default async function SecondOpinionPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: reports } = await supabase
    .from('patient_reports')
    .select('id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1);

  const latestReportId = reports?.[0]?.id;
  const report = latestReportId ? await getPatientReport(latestReportId, user.id) : null;

  const { data: timelineRows } = await supabase
    .from('care_timeline_entries')
    .select('title, milestone_type, occurred_at, notes')
    .eq('user_id', user.id)
    .order('occurred_at', { ascending: false })
    .limit(100);

  const timeline: TimelineItem[] = (timelineRows ?? []).map((row) => ({
    title: row.title,
    type: row.milestone_type,
    occurredAt: row.occurred_at,
    notes: row.notes,
  }));

  const trialTitles = (report?.matchedTrials?.matched_trials ?? [])
    .map((t) => {
      if (typeof t === 'string') return t;
      if (typeof t === 'object' && t && 'title' in t && typeof (t as { title?: unknown }).title === 'string') {
        return (t as { title: string }).title;
      }
      return '';
    })
    .filter(Boolean);

  const summary =
    report?.biomarkers?.cancer_type_inferred && report?.biomarkers?.tnm_stage
      ? `${report.biomarkers.cancer_type_inferred} (${report.biomarkers.tnm_stage}) with key biomarkers identified for treatment planning.`
      : 'Report summary not yet available.';

  const biomarkers = (report?.biomarkers?.names ?? []).map((name, i) => {
    const status = report?.biomarkers?.statuses?.[i];
    return status ? `${name}: ${status}` : name;
  });

  return (
    <div className="p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-accent">Prepare for Second Opinion</h1>
            <p className="mt-2 text-slate-600">
              Build a structured packet from your existing care data and bring it to your next appointment.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/journey/timeline">Open Care Timeline</Link>
          </Button>
        </div>

        <SecondOpinionPacket
          reportSummary={summary}
          biomarkers={biomarkers}
          trialTitles={trialTitles}
          timeline={timeline}
        />
      </div>
    </div>
  );
}
