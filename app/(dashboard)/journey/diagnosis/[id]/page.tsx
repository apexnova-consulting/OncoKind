import { redirect, notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getPatientReport } from '@/lib/patient-reports';
import { DiagnosisCards } from '@/components/care/DiagnosisCards';

export default async function DiagnosisPage({
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

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-heading text-2xl font-semibold text-accent">
          Understanding Your Diagnosis
        </h1>
        <p className="mt-2 text-slate-600">
          Key information from your report, explained clearly.
        </p>
        <DiagnosisCards report={report} />
      </div>
    </div>
  );
}
