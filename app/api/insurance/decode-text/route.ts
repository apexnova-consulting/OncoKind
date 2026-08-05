import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase-server';
import { decodeInsuranceDenialText } from '@/lib/insurance/appeals';
import { getPatientReport } from '@/lib/patient-reports';

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

    const body = await request.json().catch(() => ({}));
    const { text } = body as { text?: string };

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json({ error: 'Missing denial text' }, { status: 400 });
    }

    const { data: reports } = await supabase
      .from('patient_reports')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);
    const latestReportId = reports?.[0]?.id;
    const report = latestReportId ? await getPatientReport(latestReportId, user.id) : null;

    const decoded = await decodeInsuranceDenialText(text, report);

    // Persist the decoded result — failures are non-fatal; the analysis is
    // still returned to the client so the user gets a result even if the DB
    // insert has an RLS issue.
    let caseId: string | null = null;
    try {
      const { data: inserted } = await supabase
        .from('insurance_navigation_cases')
        .insert({
          user_id: user.id,
          source_file_name: 'pasted-denial-text',
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
      caseId = inserted?.id ?? null;

      if (caseId) {
        const serviceRole = createServiceRoleSupabaseClient();
        await serviceRole.from('ai_audit_log').insert({
          user_id: user.id,
          event_type: 'insurance_denial_decoded',
          model_id: decoded.modelId,
          entity_type: 'insurance_navigation_case',
          entity_id: caseId,
          details: {
            denialReasonCode: decoded.payload.denialReasonCode,
            insuranceName: decoded.payload.insuranceName,
            reportId: latestReportId ?? null,
          },
        });
      }
    } catch {
      // Non-fatal — analysis is still returned below.
    }

    return NextResponse.json({
      caseId,
      ...decoded.payload,
    });
  } catch (error) {
    console.error('[insurance-decode-text]', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to decode denial letter' },
      { status: 500 }
    );
  }
}
