import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ReportsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: reports } = await supabase
    .from('medical_reports')
    .select('id, file_name, created_at')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
      {!reports?.length ? (
        <Card>
          <CardContent className="py-8 text-center text-slate-600">
            No reports yet. Upload a pathology PDF from the dashboard to get started.
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-2">
          {reports.map((r) => (
            <li key={r.id}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between py-4">
                  <div>
                    <CardTitle className="text-base">
                      {r.file_name ?? 'Untitled report'}
                    </CardTitle>
                    <p className="text-sm text-slate-500">
                      {r.created_at ? new Date(r.created_at).toLocaleDateString() : ''}
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
