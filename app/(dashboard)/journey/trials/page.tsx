import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getPatientReport } from '@/lib/patient-reports';
import { TrialsMatcher } from '@/components/care/TrialsMatcher';
import { getProfile } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function TrialsPage() {
  const { isPro } = await getProfile();
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
  const defaultCancerType = report?.biomarkers?.cancer_type_inferred ?? '';
  const defaultStage = report?.biomarkers?.tnm_stage ?? '';
  const defaultBiomarkers = report?.biomarkers?.names ?? [];

  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-semibold text-accent">
        Clinical Trial Matching
      </h1>
      <p className="mt-2 text-slate-600">
        Matched trials based on your diagnosis and biomarkers from ClinicalTrials.gov.
      </p>
      {!isPro && (
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-700">
            You are on the Free tier. Clinical trial matching is limited here — upgrade to Advocate Plan for expanded
            local trial visibility and richer trial details.
          </p>
          <Button asChild className="mt-3">
            <Link href="/pricing?plan=advocate">Upgrade to Advocate Plan</Link>
          </Button>
        </div>
      )}
      <div className="mt-6">
        <TrialsMatcher
          defaultCancerType={defaultCancerType}
          defaultStage={defaultStage}
          defaultBiomarkers={defaultBiomarkers}
        />
      </div>
    </div>
  );
}
