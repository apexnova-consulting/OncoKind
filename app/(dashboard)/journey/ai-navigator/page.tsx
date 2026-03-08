import { Mail } from 'lucide-react';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getPatientReport } from '@/lib/patient-reports';
import { AICareNavigator } from '@/components/care/AICareNavigator';

export default async function AINavigatorPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: reports } = await supabase
    .from('patient_reports')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1);

  const latestReportId = reports?.[0]?.id;
  const report = latestReportId ? await getPatientReport(latestReportId, user.id) : null;

  const ct = report?.biomarkers?.cancer_type_inferred;
  const stage = report?.biomarkers?.tnm_stage;
  const diagnosis = ct
    ? stage
      ? `Stage ${stage} ${ct.charAt(0).toUpperCase() + ct.slice(1)} Cancer`
      : `${ct.charAt(0).toUpperCase() + ct.slice(1)} Cancer`
    : undefined;
  const biomarkers = report?.biomarkers?.names ?? [];
  const treatmentOptions: string[] = report
    ? ['Chemotherapy', 'Radiation Therapy', 'Immunotherapy']
    : [];

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col">
      <div className="flex items-center gap-2 bg-primary px-6 py-3 text-white">
        <Mail className="h-5 w-5 shrink-0" aria-hidden />
        <h1 className="font-heading text-lg font-semibold">
          Care Navigator
        </h1>
      </div>
      <div className="flex-1 min-h-0 overflow-auto p-6">
        <p className="mb-4 text-slate-600">
          Ask questions about your care journey. We&apos;ll help you prepare for appointments and understand next steps.
        </p>
        <AICareNavigator
          contextualInfo={
            (diagnosis || biomarkers.length > 0)
              ? { diagnosis, biomarkers, treatmentOptions }
              : null
          }
        />
      </div>
      <p
        className="sticky bottom-0 mt-4 shrink-0 border-t border-slate-200 pt-4 text-center text-xs text-slate-500"
        role="status"
      >
        OncoKind provides guidance only; not a substitute for medical advice.
      </p>
    </div>
  );
}
