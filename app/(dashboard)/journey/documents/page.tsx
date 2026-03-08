import Link from 'next/link';
import { FileText, FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export default async function DocumentsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: reports } = await supabase
    .from('patient_reports')
    .select('id, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="p-6">
      <h1 className="font-heading text-2xl font-semibold text-accent">
        Documents
      </h1>
      <p className="mt-2 text-slate-600">
        Reports you&apos;ve uploaded and analyzed.
      </p>
      <div className="mt-8">
        {!reports?.length ? (
          <div className="rounded-xl border-2 border-dashed border-slate-200 bg-white p-12 text-center">
            <FileText className="mx-auto h-12 w-12 text-slate-300" />
            <p className="mt-4 text-slate-600">No reports yet</p>
            <Button asChild className="mt-4">
              <Link href="/journey">
                <FileUp className="mr-2 h-4 w-4" />
                Upload Report
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-2">
            {reports.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/journey/diagnosis/${r.id}`}
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3 transition-colors hover:bg-slate-50"
                >
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="font-medium">Report</span>
                  <span className="ml-auto text-sm text-slate-500">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
