import { PathologyTranslationCard } from '@/components/dashboard/PathologyTranslationCard';
import { TrialMatchesCard } from '@/components/dashboard/TrialMatchesCard';
import { AppointmentQuestionGenerator } from '@/components/dashboard/AppointmentQuestionGenerator';
import { CaregiverWellbeingCheckin } from '@/components/dashboard/CaregiverWellbeingCheckin';
import { LiveFundingFeedCard } from '@/components/dashboard/LiveFundingFeedCard';
import { GoalsOfCareCard } from '@/components/dashboard/GoalsOfCareCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, ExternalLink } from 'lucide-react';
import { getProfile } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getPatientReport } from '@/lib/patient-reports';

const GOC_ENABLED = process.env.NEXT_PUBLIC_GOALS_OF_CARE_ENABLED === 'true';

async function checkGoalsOfCareTrigger(userId: string): Promise<boolean> {
  if (!GOC_ENABLED) return false;
  try {
    const supabase = await createServerSupabaseClient();

    // Trigger 1: Stage IV / metastatic in latest report
    const { data: reports } = await supabase
      .from('patient_reports')
      .select('id')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1);

    if (reports?.[0]?.id) {
      const report = await getPatientReport(reports[0].id, userId);
      const stage = report?.biomarkers?.tnm_stage?.toLowerCase() ?? '';
      const cancerType = report?.biomarkers?.cancer_type_inferred?.toLowerCase() ?? '';
      if (
        stage.includes('iv') ||
        stage.includes('4') ||
        cancerType.includes('metastatic') ||
        cancerType.includes('stage 4')
      ) {
        return true;
      }
    }

    // Trigger 2: 2nd or later line of treatment in Care Timeline
    const { data: txEntries } = await supabase
      .from('care_timeline_entries')
      .select('id')
      .eq('user_id', userId)
      .eq('milestone_type', 'treatment_start')
      .limit(3);

    if ((txEntries?.length ?? 0) >= 2) return true;

    return false;
  } catch {
    return false;
  }
}

export default async function DashboardPage() {
  const { isPro, isProfessional, user } = await getProfile();
  const gocTriggered = user ? await checkGoalsOfCareTrigger(user.id) : false;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>

        {/* Prior Auth Engine — Professional tier feature card */}
        {isProfessional && (
          <a
            href="/prior-auth"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-start gap-4 rounded-xl bg-[#1C2B2D] p-5 text-white transition-colors hover:bg-[#2d4042]"
          >
            <div className="rounded-lg bg-white/10 p-2.5">
              <FileText className="h-5 w-5 text-[#E8C37A]" />
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="font-semibold text-sm">Prior Auth Engine</span>
                <span className="rounded-full bg-[#6B8F71] px-2 py-0.5 text-xs text-white">New</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-300">
                Generate prior auth requests, step therapy exceptions, and continued stay letters — opens in a dedicated workspace
              </p>
            </div>
            <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-slate-400 transition-colors group-hover:text-white" />
          </a>
        )}

        {!isPro && (
          <Card className="border-amber-300 bg-amber-50/40">
            <CardHeader>
              <CardTitle>Upgrade to Advocate Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-700">
                Unlock Second Opinion packet export, expanded trial matching, and advanced prep tools.
              </p>
              <Button asChild className="mt-4">
                <Link href="/pricing?plan=advocate">Upgrade to Advocate Plan</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {GOC_ENABLED && <GoalsOfCareCard triggered={gocTriggered} />}
        <CaregiverWellbeingCheckin />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <PathologyTranslationCard />
          <TrialMatchesCard />
          <AppointmentQuestionGenerator />
        </div>
        <LiveFundingFeedCard />
        <Card>
          <CardHeader>
            <CardTitle>Prepare for Second Opinion</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Build a structured packet from your reports, timeline, and trial matches for a new oncology consultation.
            </p>
            <Button asChild className="mt-4">
              <Link href="/journey/second-opinion">Open Second Opinion Mode</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
