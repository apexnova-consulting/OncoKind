import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function getPendingCheckInPrompt(userId: string) {
  const supabase = await createServerSupabaseClient();
  const now = new Date().toISOString();

  const { data: appointments } = await supabase
    .from('prep_sheet_appointments')
    .select('id, appointment_at, report_title, check_in_due_at')
    .eq('user_id', userId)
    .lte('check_in_due_at', now)
    .order('appointment_at', { ascending: false })
    .limit(5);

  if (!appointments?.length) return null;

  const appointmentIds = appointments.map((appointment) => appointment.id);
  const { data: checkIns } = await supabase
    .from('appointment_check_ins')
    .select('appointment_id')
    .in('appointment_id', appointmentIds);

  const completedIds = new Set((checkIns ?? []).map((entry) => entry.appointment_id));
  return appointments.find((appointment) => !completedIds.has(appointment.id)) ?? null;
}

export function preparednessLabel(score: number) {
  switch (score) {
    case 1:
      return 'Not prepared';
    case 2:
      return 'Somewhat prepared';
    case 3:
      return 'Prepared';
    case 4:
      return 'Very prepared';
    default:
      return 'Prepared';
  }
}
