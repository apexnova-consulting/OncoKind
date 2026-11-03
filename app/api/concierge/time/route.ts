import { NextRequest, NextResponse } from 'next/server';
import { getProfile } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase-server';

const STEPS = new Set([
  'intake_review',
  'authorization',
  'records_request',
  'follow_up_call',
  'follow_up_email',
  'packet_assembly',
  'submission',
  'status_documentation',
  'estimate_assistance',
  'family_communication',
  'other',
]);

export async function GET(request: NextRequest) {
  const { isAdmin, user } = await getProfile();
  if (!user || !isAdmin) return NextResponse.json({ error: 'Staff only.' }, { status: 403 });
  const orderId = request.nextUrl.searchParams.get('conciergeOrderId');
  const supabase = await createServerSupabaseClient();
  let query = supabase
    .from('case_time_entries')
    .select('id, concierge_order_id, step, minutes, started_at, ended_at, created_at')
    .order('created_at', { ascending: true });
  if (orderId) query = query.eq('concierge_order_id', orderId);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: 'Could not export time yet.' }, { status: 500 });
  const header = 'id,concierge_order_id,step,minutes,started_at,ended_at,created_at';
  const rows = (data ?? []).map((row) =>
    [row.id, row.concierge_order_id, row.step, row.minutes, row.started_at, row.ended_at, row.created_at].join(',')
  );
  return new NextResponse([header, ...rows].join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="case-time.csv"',
    },
  });
}

export async function POST(request: NextRequest) {
  const { isAdmin, user } = await getProfile();
  if (!user || !isAdmin) return NextResponse.json({ error: 'Staff only.' }, { status: 403 });
  const body = (await request.json()) as { conciergeOrderId?: string; step?: string; minutes?: number };
  if (!body.step || !STEPS.has(body.step) || !body.minutes || body.minutes < 1) {
    return NextResponse.json({ error: 'Step and minutes are required.' }, { status: 400 });
  }
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from('case_time_entries').insert({
    concierge_order_id: body.conciergeOrderId ?? null,
    staff_id: user.id,
    step: body.step,
    minutes: body.minutes,
    started_at: new Date().toISOString(),
    ended_at: new Date().toISOString(),
  });
  if (error) return NextResponse.json({ error: 'Could not save time yet.' }, { status: 500 });
  return NextResponse.json({ message: 'Time logged.' });
}
