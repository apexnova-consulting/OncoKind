import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { getPendingCheckInPrompt } from '@/lib/check-ins';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatReadableDate } from '@/lib/time';

export const metadata = {
  title: 'Appointment Check-In — OncoKind',
};

export default async function CheckInIndexPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const pendingCheckIn = await getPendingCheckInPrompt(user.id);

  if (pendingCheckIn) {
    redirect(`/journey/check-in/${pendingCheckIn.id}`);
  }

  const { data: recentCheckIns } = await supabase
    .from('appointment_checkins')
    .select('id, appointment_at, completed_at')
    .eq('user_id', user.id)
    .order('appointment_at', { ascending: false })
    .limit(10);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold text-slate-900">Appointment Check-In</h1>
      <p className="mt-2 text-sm text-slate-600">
        After each oncology appointment, take a 60-second check-in to log how it went and capture
        follow-up action items.
      </p>

      {recentCheckIns && recentCheckIns.length > 0 ? (
        <div className="mt-6 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Recent Check-ins
          </h2>
          {recentCheckIns.map((c) => (
            <Card key={c.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="text-sm font-medium text-slate-800">
                    Appointment: {formatReadableDate(c.appointment_at)}
                  </p>
                  {c.completed_at && (
                    <p className="text-xs text-slate-500">
                      Completed {formatReadableDate(c.completed_at)}
                    </p>
                  )}
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/journey/check-in/${c.id}`}>View</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>No check-ins yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Check-in prompts appear here after each scheduled appointment. You can also start one
              manually from the Reports page.
            </p>
            <Button asChild className="mt-4">
              <Link href="/reports">Go to Reports</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
