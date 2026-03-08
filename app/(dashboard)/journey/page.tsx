import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Button } from '@/components/ui/button';
import { JourneyUploadCard } from '@/components/care/JourneyUploadCard';
import { JourneyTimeline } from '@/components/care/JourneyTimeline';
import { CancerProfileSummaryCard } from '@/components/care/CancerProfileSummaryCard';
import { getPatientReport } from '@/lib/patient-reports';
import { ClipboardList, Activity, BarChart3, FileText } from 'lucide-react';

export default async function JourneyPage() {
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

  const stages = report
    ? [
        {
          id: 'diagnosis' as const,
          label: 'Diagnosis',
          icon: FileText,
          status: 'completed' as const,
          summary: report.biomarkers?.cancer_type_inferred
            ? `${report.biomarkers.cancer_type_inferred} — ${report.biomarkers.tnm_stage ?? ''}`
            : 'Stage identified',
          biomarkers: report.biomarkers?.names ?? [],
        },
        {
          id: 'treatment-planning' as const,
          label: 'Treatment Planning',
          icon: ClipboardList,
          status: 'current' as const,
          nextSteps: [
            'Schedule PET Scan',
            'Meet with Oncologist',
            'Review Clinical Trials',
          ],
        },
        {
          id: 'active-treatment' as const,
          label: 'Active Treatment',
          icon: Activity,
          status: 'upcoming' as const,
          summary: 'Upcoming treatments',
        },
        {
          id: 'monitoring' as const,
          label: 'Monitoring',
          icon: BarChart3,
          status: 'upcoming' as const,
        },
      ]
    : [
        {
          id: 'diagnosis' as const,
          label: 'Diagnosis',
          icon: FileText,
          status: 'upcoming' as const,
        },
        {
          id: 'treatment-planning' as const,
          label: 'Treatment Planning',
          icon: ClipboardList,
          status: 'upcoming' as const,
        },
        {
          id: 'active-treatment' as const,
          label: 'Active Treatment',
          icon: Activity,
          status: 'upcoming' as const,
        },
        {
          id: 'monitoring' as const,
          label: 'Monitoring',
          icon: BarChart3,
          status: 'upcoming' as const,
        },
      ];

  return (
    <div className="p-6">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-heading text-2xl font-semibold text-accent">
          Your Cancer Care Journey
        </h1>
        <p className="mt-2 text-slate-600">
          {report
            ? 'See where you are in your care journey. Expand cards for details and next steps.'
            : 'Upload a medical report to get started. We\'ll help you understand your diagnosis and navigate next steps.'}
        </p>
        {!report && (
          <div className="mt-8">
            <JourneyUploadCard />
          </div>
        )}
        {report && (
          <>
            <div className="mt-8 max-w-2xl">
              <CancerProfileSummaryCard
                type={
                  report.biomarkers?.cancer_type_inferred
                    ? `${report.biomarkers.cancer_type_inferred.charAt(0).toUpperCase() + report.biomarkers.cancer_type_inferred.slice(1)} Cancer`
                    : 'Cancer'
                }
                stage={report.biomarkers?.tnm_stage ? `Stage ${report.biomarkers.tnm_stage}` : undefined}
                biomarkers={
                  report.biomarkers?.names?.map((name, i) => {
                    const status = report.biomarkers?.statuses?.[i];
                    return status ? `${name}: ${status}` : name;
                  }) ?? []
                }
                recommendedNextSteps={[
                  'Meet with oncologist',
                  'Discuss treatment options',
                  'Review clinical trials',
                ]}
                showCta={false}
              />
            </div>
            <div className="mt-8">
              <h2 className="font-heading text-lg font-semibold text-accent">Care roadmap</h2>
              <p className="mt-1 text-sm text-slate-600">
                Expand each stage for details and next steps.
              </p>
              <div className="mt-4">
                <JourneyTimeline stages={stages} />
              </div>
            </div>
            <div className="pt-6 text-center">
              <Button asChild variant="outline">
                <Link href="/journey/documents">Upload Another Report</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
