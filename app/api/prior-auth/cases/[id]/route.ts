import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: caseData, error } = await supabase
    .from('prior_auth_cases')
    .select(`*, prior_auth_drug_trials(*)`)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !caseData) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json({ case: caseData });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const allowedFields = [
    'status',
    'outcome_notes',
    'outcome_date',
    'submitted_at',
    'patient_identifier',
    'facility_name',
    'payer_name',
    'plan_name',
    'medication_name',
    'diagnosis_code',
    'diagnosis_description',
    'prescribing_physician',
  ];

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const field of allowedFields) {
    if (body[field] !== undefined) updates[field] = body[field];
  }

  const { data, error } = await supabase
    .from('prior_auth_cases')
    .update(updates)
    .eq('id', params.id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ case: data });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Only draft cases may be deleted
  const { data: existing } = await supabase
    .from('prior_auth_cases')
    .select('status')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (existing?.status !== 'draft') {
    return NextResponse.json({ error: 'Only draft cases can be deleted' }, { status: 400 });
  }

  const { error } = await supabase
    .from('prior_auth_cases')
    .delete()
    .eq('id', params.id)
    .eq('user_id', user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
