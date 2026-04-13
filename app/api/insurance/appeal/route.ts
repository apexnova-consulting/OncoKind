import { NextRequest, NextResponse } from 'next/server';
import { decryptJson } from '@/lib/encryption';
import { getPatientReport } from '@/lib/patient-reports';
import { draftAppealFromDecodedCase, type DecodedInsurancePayload } from '@/lib/insurance/appeals';
import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase-server';

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

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status')
      .eq('id', user.id)
      .single();

    const hasAdvocateAccess =
      profile?.subscription_tier === 'advocate' || profile?.subscription_tier === 'enterprise';

    if (!hasAdvocateAccess) {
      return NextResponse.json(
        {
          error: 'Advocate Plan required',
          redirectTo: '/pricing?plan=advocate',
        },
        { status: 402 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const caseId = typeof body.caseId === 'string' ? body.caseId : '';
    if (!caseId) {
      return NextResponse.json({ error: 'Missing caseId' }, { status: 400 });
    }

    const { data: insuranceCase, error: caseError } = await supabase
      .from('insurance_navigation_cases')
      .select('id, user_id, denial_summary_encrypted')
      .eq('id', caseId)
      .eq('user_id', user.id)
      .single();

    if (caseError || !insuranceCase?.denial_summary_encrypted) {
      return NextResponse.json({ error: 'Insurance case not found' }, { status: 404 });
    }

    const decoded = decryptJson<DecodedInsurancePayload>(insuranceCase.denial_summary_encrypted as string);

    const { data: reports } = await supabase
      .from('patient_reports')
      .select('id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    const latestReportId = reports?.[0]?.id;
    const report = latestReportId ? await getPatientReport(latestReportId, user.id) : null;

    const drafted = await draftAppealFromDecodedCase({
      decoded,
      report,
    });

    const { error: updateError } = await supabase
      .from('insurance_navigation_cases')
      .update({
        appeal_letter_encrypted: drafted.appealLetterEncrypted,
        checklist_encrypted: drafted.checklistEncrypted,
        model_id: drafted.modelId,
        status: 'appeal_ready',
      })
      .eq('id', caseId)
      .eq('user_id', user.id);

    if (updateError) {
      return NextResponse.json({ error: 'Failed to save appeal draft' }, { status: 500 });
    }

    const serviceRole = createServiceRoleSupabaseClient();
    await serviceRole.from('ai_audit_log').insert({
      user_id: user.id,
      event_type: 'appeal_letter_generated',
      model_id: drafted.modelId,
      entity_type: 'insurance_navigation_case',
      entity_id: caseId,
      details: {
        denialReasonCode: decoded.denialReasonCode,
        insuranceName: decoded.insuranceName,
        reportId: latestReportId ?? null,
      },
    });

    return NextResponse.json({
      caseId,
      ...drafted.payload,
    });
  } catch (error) {
    console.error('[insurance-appeal]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate appeal letter' },
      { status: 500 }
    );
  }
}
