import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ReportsUploadPanel } from '@/components/reports/ReportsUploadPanel';
import { getPatientReport } from '@/lib/patient-reports';

export default async function ReportsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: reports } = await supabase
    .from('patient_reports')
    .select('id, created_at, user_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const reportCards = await Promise.all(
    (reports ?? []).map(async (report) => ({
      id: report.id,
      createdAt: report.created_at,
      details: await getPatientReport(report.id, user.id),
    }))
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
      <ReportsUploadPanel />
      {!reportCards.length ? (
        <Card>
          <CardContent className="py-8 text-center text-slate-600">
            No reports yet. Upload a pathology PDF from the dashboard to get started.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-2">
          {reportCards.map((r) => (
            <li key={r.id}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div>
                    <CardTitle className="text-base">
                      {r.details?.biomarkers?.cancer_type_inferred
                        ? `${r.details.biomarkers.cancer_type_inferred} report`
                        : 'Cancer report'}
                    </CardTitle>
                    <p className="mt-1 text-sm text-slate-600">
                      {r.details?.matchedTrials.analysis_results?.comparisonHighlight ??
                        r.details?.matchedTrials.analysis_results?.summary ??
                        'Structured pathology analysis ready to review.'}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <Button asChild variant="secondary" size="sm">
                    <Link href={`/reports/${r.id}`}>View</Link>
                  </Button>
                </CardHeader>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
