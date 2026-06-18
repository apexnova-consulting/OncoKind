import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  if (profile?.subscription_tier !== 'professional') {
    return NextResponse.json({ error: 'Professional tier required' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const caseType = searchParams.get('case_type');

  let query = supabase
    .from('prior_auth_cases')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);
  if (caseType) query = query.eq('case_type', caseType);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cases: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, organization_id')
    .eq('id', user.id)
    .single();

  if (profile?.subscription_tier !== 'professional') {
    return NextResponse.json({ error: 'Professional tier required' }, { status: 403 });
  }

  const body = await request.json();
  const {
    case_type,
    patient_identifier,
    facility_name,
    facility_npi,
    facility_state,
    facility_type,
    payer_name,
    payer_id,
    plan_name,
    member_id_masked,
    existing_auth_number,
    medication_name,
    medication_nda_ndc,
    diagnosis_code,
    diagnosis_description,
    prescribing_physician,
    clinical_notes,
    functional_status,
    admission_date,
    is_urgent,
  } = body;

  if (!case_type || !['prior_auth', 'step_therapy', 'continued_stay'].includes(case_type)) {
    return NextResponse.json({ error: 'Valid case_type required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('prior_auth_cases')
    .insert({
      user_id: user.id,
      organization_id: profile?.organization_id ?? null,
      case_type,
      status: 'draft',
      patient_identifier,
      facility_name,
      facility_npi,
      facility_state,
      facility_type,
      payer_name,
      payer_id,
      plan_name,
      member_id_masked,
      existing_auth_number,
      medication_name,
      medication_nda_ndc,
      diagnosis_code,
      diagnosis_description,
      prescribing_physician,
      clinical_notes,
      functional_status,
      admission_date: admission_date || null,
      is_urgent: is_urgent ?? false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ case: data }, { status: 201 });
}
