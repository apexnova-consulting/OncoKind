import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getProfile } from '@/lib/auth';
import { getBrandTheme } from '@/lib/branding';
import { DoctorPrepSheet } from '@/components/reports/DoctorPrepSheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPatientReport } from '@/lib/patient-reports';

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const report = await getPatientReport(id, user.id);
  if (!report) notFound();

  const [{ isPro }, brandTheme] = await Promise.all([getProfile(), getBrandTheme()]);
  const summary =
    report.matchedTrials.analysis_results?.summary ??
    [
      report.biomarkers.cancer_type_inferred ? `**Cancer type:** ${report.biomarkers.cancer_type_inferred}` : null,
      report.biomarkers.tnm_stage ? `**Stage:** ${report.biomarkers.tnm_stage}` : null,
      report.biomarkers.histology ? `**Histology:** ${report.biomarkers.histology}` : null,
    ]
      .filter(Boolean)
      .join('\n');
  const keyFindings =
    report.matchedTrials.analysis_results?.keyFindings ??
    (report.biomarkers.names ?? []).map((name, index) => {
      const status = report.biomarkers.statuses?.[index];
      return status ? `**${name}:** ${status}` : `**${name}**`;
    });
  const suggestedQuestions =
    report.matchedTrials.analysis_results?.suggestedQuestions ?? [
      'What should we compare against my previous scan or pathology report?',
      'Do these findings suggest progression or any new metastatic sites?',
      'How do these biomarkers affect the next treatment decision?',
    ];
  const reportTitle = report.biomarkers.cancer_type_inferred
    ? `${report.biomarkers.cancer_type_inferred} report`
    : 'Cancer report';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/reports">← Reports</Link>
        </Button>
      </div>
      <h1 className="text-2xl font-bold text-slate-900">
        {reportTitle}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-700 whitespace-pre-wrap">{summary || 'No summary stored.'}</p>
          {keyFindings.length > 0 && (
            <div className="mt-4">
              <p className="font-medium text-slate-800">Key findings</p>
              <ul className="list-disc list-inside text-slate-700 mt-1">
                {keyFindings.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}
          {suggestedQuestions.length > 0 && (
            <div className="mt-4">
              <p className="font-medium text-slate-800">Questions for your doctor</p>
              <ul className="list-disc list-inside text-slate-700 mt-1">
                {suggestedQuestions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
      <DoctorPrepSheet
        isPro={isPro}
        reportId={id}
        reportTitle={reportTitle}
        reportSummary={summary}
        reportQuestions={suggestedQuestions}
        reportFindings={keyFindings}
        brandDisplayName={brandTheme.displayName}
        brandLogoUrl={brandTheme.logoUrl}
        brandFooterDisclaimer={brandTheme.footerDisclaimer}
      />
    </div>
  );
}
