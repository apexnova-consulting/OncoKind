import { NextResponse } from 'next/server';
import { getProfile } from '@/lib/auth';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { isAfter90FlagOn } from '@/lib/after-90/config';
import { assertSafeCompareSummary, compareSameKindReports } from '@/lib/after-90/compare-reports';

export async function POST() {
  if (!isAfter90FlagOn('after90Phase')) {
    return NextResponse.json({ error: 'Not available.' }, { status: 404 });
  }
  const { user } = await getProfile();
  if (!user) return NextResponse.json({ error: 'Sign in required.' }, { status: 401 });
  const supabase = await createServerSupabaseClient();
  const { data: reports } = await supabase
    .from('patient_reports')
    .select('id, created_at, summary, report_kind')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  const newest = reports?.[0];
  const previous = reports?.find(
    (report, index) => index > 0 && (!newest?.report_kind || report.report_kind === newest.report_kind)
  );
  if (!newest || !previous) {
    return NextResponse.json({ error: 'Need two reports of the same kind to compare.' }, { status: 400 });
  }
  const diff = compareSameKindReports(String(previous.summary ?? ''), String(newest.summary ?? ''));
  return NextResponse.json({
    summary: assertSafeCompareSummary(diff.summary),
    newerOnly: diff.newerOnly,
    olderOnly: diff.olderOnly,
    notStated: diff.notStated,
    crisis: diff.crisis,
  });
}
