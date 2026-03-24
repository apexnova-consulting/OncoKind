import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

type MilestoneType =
  | 'diagnosis'
  | 'lab_result'
  | 'treatment_start'
  | 'clinical_trial_enrollment'
  | 'follow_up_appointment'
  | 'new_report_uploaded'
  | 'custom';

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: manualEntries, error: manualErr } = await supabase
      .from('care_timeline_entries')
      .select('id, milestone_type, title, notes, report_summary, prep_sheet_link, occurred_at, created_at')
      .eq('user_id', user.id)
      .order('occurred_at', { ascending: false });

    if (manualErr) return NextResponse.json({ error: 'Failed to fetch timeline entries' }, { status: 500 });

    const { data: reportEntries } = await supabase
      .from('patient_reports')
      .select('id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    const reportMilestones = (reportEntries ?? []).map((r) => ({
      id: `report-${r.id}`,
      milestone_type: 'new_report_uploaded' as MilestoneType,
      title: 'New Report Uploaded',
      notes: 'A new pathology report was processed and added to your care journey.',
      report_summary: null,
      prep_sheet_link: '/reports',
      occurred_at: r.created_at,
      created_at: r.created_at,
      auto: true,
    }));

    const combined = [...(manualEntries ?? []), ...reportMilestones]
      .sort((a, b) => new Date(b.occurred_at).getTime() - new Date(a.occurred_at).getTime());

    return NextResponse.json({ entries: combined });
  } catch (err) {
    console.error('[care-timeline:get]', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      milestoneType,
      title,
      notes,
      reportSummary,
      prepSheetLink,
      occurredAt,
    }: {
      milestoneType: MilestoneType;
      title: string;
      notes?: string;
      reportSummary?: string;
      prepSheetLink?: string;
      occurredAt: string;
    } = body;

    if (!milestoneType || !title || !occurredAt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('care_timeline_entries')
      .insert({
        user_id: user.id,
        milestone_type: milestoneType,
        title,
        notes: notes ?? null,
        report_summary: reportSummary ?? null,
        prep_sheet_link: prepSheetLink ?? null,
        occurred_at: occurredAt,
      })
      .select('id, milestone_type, title, notes, report_summary, prep_sheet_link, occurred_at, created_at')
      .single();

    if (error) return NextResponse.json({ error: 'Failed to create timeline entry' }, { status: 500 });
    return NextResponse.json({ entry: data });
  } catch (err) {
    console.error('[care-timeline:post]', err);
    return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 });
  }
}
