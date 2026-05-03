import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const reportId = typeof body?.reportId === 'string' ? body.reportId : null;
  const reportTitle = typeof body?.reportTitle === 'string' ? body.reportTitle : null;
  const appointmentAt = typeof body?.appointmentAt === 'string' ? body.appointmentAt : null;
  const notes = typeof body?.notes === 'string' ? body.notes.trim() : null;

  if (!appointmentAt) {
    return NextResponse.json({ error: 'Add an appointment date and time first.' }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('organization_id')
    .eq('id', user.id)
    .maybeSingle();

  const { data, error } = await supabase
    .from('prep_sheet_appointments')
    .insert({
      user_id: user.id,
      report_id: reportId,
      report_title: reportTitle,
      organization_id: profile?.organization_id ?? null,
      appointment_at: appointmentAt,
      notes,
    })
    .select('id')
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Unable to save your appointment right now.' }, { status: 500 });
  }

  return NextResponse.json({ appointment: data });
}
