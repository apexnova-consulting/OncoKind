import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase-server';
import { decodeInsuranceDenial } from '@/lib/insurance/appeals';
import { getPatientReport } from '@/lib/patient-reports';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('pdf');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing PDF file' }, { status: 400 });
    }

    const { data: reports } = await supabase
      .from('patient_reports')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);
    const latestReportId = reports?.[0]?.id;
    const report = latestReportId ? await getPatientReport(latestReportId, user.id) : null;

    const decoded = await decodeInsuranceDenial(file, report);

    const { data: inserted, error: insertError } = await supabase
      .from('insurance_navigation_cases')
      .insert({
        user_id: user.id,
        source_file_name: file.name,
        denial_reason_code: decoded.payload.denialReasonCode,
        insurance_name: decoded.payload.insuranceName,
        member_services_phone: decoded.payload.memberServicesPhone,
        appeal_deadline_text: decoded.payload.appealDeadlineText,
        denial_summary_encrypted: decoded.denialSummaryEncrypted,
        model_id: decoded.modelId,
        status: 'decoded',
      })
      .select('id')
      .single();

    if (insertError || !inserted) {
      return NextResponse.json({ error: 'Failed to save denial decode' }, { status: 500 });
    }

    const serviceRole = createServiceRoleSupabaseClient();
    await serviceRole.from('ai_audit_log').insert({
      user_id: user.id,
      event_type: 'insurance_denial_decoded',
      model_id: decoded.modelId,
      entity_type: 'insurance_navigation_case',
      entity_id: inserted.id,
      details: {
        denialReasonCode: decoded.payload.denialReasonCode,
        insuranceName: decoded.payload.insuranceName,
        reportId: latestReportId ?? null,
      },
    });

    return NextResponse.json({
      caseId: inserted.id,
      ...decoded.payload,
    });
  } catch (error) {
    console.error('[insurance-decode]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to decode denial letter' },
      { status: 500 }
    );
  }
}
