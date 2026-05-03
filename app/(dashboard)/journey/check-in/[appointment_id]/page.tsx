import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { AppointmentCheckInForm } from '@/components/check-ins/AppointmentCheckInForm';
import { preparednessLabel } from '@/lib/check-ins';
import { Button } from '@/components/ui/button';
import { formatReadableDate } from '@/lib/time';

export const metadata = {
  title: 'Appointment Check-In',
  description: 'Share how your appointment went and add it to your care timeline.',
};

export default async function AppointmentCheckInPage({
  params,
}: {
  params: Promise<{ appointment_id: string }>;
}) {
  const { appointment_id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [{ data: appointment }, { data: existingCheckIn }] = await Promise.all([
    supabase
      .from('prep_sheet_appointments')
      .select('id, appointment_at, report_title')
      .eq('id', appointment_id)
      .eq('user_id', user.id)
      .maybeSingle(),
    supabase
      .from('appointment_check_ins')
      .select(
        'preparedness_score, prep_sheet_helped, follow_up_question, follow_up_explanation, discussed_trials, created_at'
      )
      .eq('appointment_id', appointment_id)
      .eq('user_id', user.id)
      .maybeSingle(),
  ]);

  if (!appointment) {
    notFound();
  }

  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-3xl space-y-6">
        <Button asChild variant="outline">
          <Link href="/journey/timeline">← Back to Timeline</Link>
        </Button>
        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)]">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            Post-appointment check-in
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-[var(--color-primary-900)]">
            How did your appointment go?
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-text-secondary)]">
            We&apos;d love to know how your prep helped. This takes less than a minute.
          </p>
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            Appointment: {formatReadableDate(appointment.appointment_at)}
            {appointment.report_title ? ` · ${appointment.report_title}` : ''}
          </p>
        </section>

        {existingCheckIn ? (
          <section className="rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-sm)]">
            <p className="text-sm font-semibold text-[var(--color-primary-900)]">
              You already completed this check-in.
            </p>
            <div className="mt-4 space-y-2 text-sm text-[var(--color-text-secondary)]">
              <p>Preparedness: {preparednessLabel(existingCheckIn.preparedness_score)} ✓</p>
              <p>
                Prep sheet helped:{' '}
                {existingCheckIn.prep_sheet_helped === 'yes'
                  ? 'Yes, definitely'
                  : existingCheckIn.prep_sheet_helped === 'somewhat'
                    ? 'Somewhat'
                    : existingCheckIn.prep_sheet_helped === 'no'
                      ? 'Not really'
                      : "I didn't use it"}
              </p>
              {existingCheckIn.follow_up_explanation ? (
                <p>{existingCheckIn.follow_up_explanation}</p>
              ) : null}
            </div>
          </section>
        ) : (
          <AppointmentCheckInForm appointmentId={appointment.id} />
        )}
      </div>
    </main>
  );
}
