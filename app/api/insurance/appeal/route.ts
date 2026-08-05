import { NextRequest, NextResponse } from 'next/server';
import { decryptJson } from '@/lib/encryption';
import { getPatientReport } from '@/lib/patient-reports';
import {
  draftAppealFromDecodedCase,
  decodeInsuranceDenialText,
  type DecodedInsurancePayload,
} from '@/lib/insurance/appeals';
import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user ?? null;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('subscription_tier, subscription_status')
      .eq('id', user.id)
      .single();

    const hasAdvocateAccess =
      profile?.subscription_tier === 'advocate' ||
      profile?.subscription_tier === 'professional' ||
      profile?.subscription_tier === 'enterprise';

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
    const denialText = typeof body.denialText === 'string' ? body.denialText : '';

    const { data: reports } = await supabase
      .from('patient_reports')
      .select('id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);
    const latestReportId = reports?.[0]?.id;
    const report = latestReportId ? await getPatientReport(latestReportId, user.id) : null;

    let decoded: DecodedInsurancePayload;

    if (caseId) {
      const { data: insuranceCase, error: caseError } = await supabase
        .from('insurance_navigation_cases')
        .select('id, user_id, denial_summary_encrypted')
        .eq('id', caseId)
        .eq('user_id', user.id)
        .single();

      if (caseError || !insuranceCase?.denial_summary_encrypted) {
        return NextResponse.json({ error: 'Insurance case not found' }, { status: 404 });
      }
      decoded = decryptJson<DecodedInsurancePayload>(insuranceCase.denial_summary_encrypted as string);
    } else if (denialText) {
      const result = await decodeInsuranceDenialText(denialText, report);
      decoded = result.payload;
    } else {
      // Generate a generic appeal packet with placeholder content
      decoded = {
        denialReasonCode: 'Not Medically Necessary',
        insuranceName: 'Insurance Plan',
        memberServicesPhone: 'N/A',
        appealDeadlineText: 'Contact your insurer for deadline',
        plainEnglishBullets: [],
      };
    }

    const drafted = await draftAppealFromDecodedCase({
      decoded,
      report,
    });

    if (caseId) {
      await supabase
        .from('insurance_navigation_cases')
        .update({
          appeal_letter_encrypted: drafted.appealLetterEncrypted,
          checklist_encrypted: drafted.checklistEncrypted,
          model_id: drafted.modelId,
          status: 'appeal_ready',
        })
        .eq('id', caseId)
        .eq('user_id', user.id);
    }

    const serviceRole = createServiceRoleSupabaseClient();
    await serviceRole.from('ai_audit_log').insert({
      user_id: user.id,
      event_type: 'appeal_letter_generated',
      model_id: drafted.modelId,
      entity_type: 'insurance_navigation_case',
      entity_id: caseId || null,
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
