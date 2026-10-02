import { NextRequest, NextResponse } from 'next/server';
import { requireKindAuthUser } from '@/lib/kindauth-access';

export const runtime = 'nodejs';

function normalizePatientRef(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export async function GET(request: NextRequest) {
  const auth = await requireKindAuthUser();
  if ('error' in auth) return auth.error;

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const caseType = searchParams.get('case_type');

  let query = auth.supabase
    .from('prior_auth_cases')
    .select('*')
    .eq('user_id', auth.user.id)
    .order('created_at', { ascending: false });

  if (status) query = query.eq('status', status);
  if (caseType) query = query.eq('case_type', caseType);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cases: data, multiPatient: auth.isMultiPatient });
}

export async function POST(request: NextRequest) {
  const auth = await requireKindAuthUser();
  if ('error' in auth) return auth.error;

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

  if (!auth.isMultiPatient) {
    const incoming = normalizePatientRef(patient_identifier);
    const { data: existing } = await auth.supabase
      .from('prior_auth_cases')
      .select('patient_identifier')
      .eq('user_id', auth.user.id);
    const known = new Set(
      (existing ?? [])
        .map((row) => normalizePatientRef(row.patient_identifier))
        .filter(Boolean)
    );
    if (incoming && known.size > 0 && !known.has(incoming)) {
      return NextResponse.json(
        {
          error:
            'Care & Advocacy Pro is limited to a single patient. Upgrade to Professional for multi-patient KindAuth Pro.',
          redirectTo: '/pricing?reason=b2b_required',
        },
        { status: 403 }
      );
    }
  }

  const { data, error } = await auth.supabase
    .from('prior_auth_cases')
    .insert({
      user_id: auth.user.id,
      organization_id: auth.profile?.organization_id ?? null,
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
