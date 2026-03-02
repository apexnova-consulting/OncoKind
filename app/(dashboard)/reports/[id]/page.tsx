import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getProfile } from '@/lib/auth';
import { DoctorPrepSheet } from '@/components/reports/DoctorPrepSheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: report } = await supabase
    .from('medical_reports')
    .select('id, file_name, raw_extracted_text, metadata, created_at')
    .eq('id', id)
    .single();

  if (!report) notFound();

  const { isPro } = await getProfile();
  const meta = (report.metadata as { summary?: string; keyFindings?: string[]; suggestedQuestions?: string[] }) ?? {};
  const summary = meta.summary ?? report.raw_extracted_text?.slice(0, 500) ?? '';
  const keyFindings = meta.keyFindings ?? [];
  const suggestedQuestions = meta.suggestedQuestions ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/reports">← Reports</Link>
        </Button>
      </div>
      <h1 className="text-2xl font-bold text-slate-900">
        {report.file_name ?? 'Report'}
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
        reportSummary={summary}
        reportQuestions={suggestedQuestions}
        reportFindings={keyFindings}
      />
    </div>
  );
}
