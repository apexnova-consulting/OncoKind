import { decryptJson } from '@/lib/encryption';
import { createServiceRoleSupabaseClient } from '@/lib/supabase-server';
import type { BiomarkersData } from '@/lib/patient-reports';
import type {
  DiagnosisMatcher,
  DiagnosisProfile,
  FinancialAidFundRecord,
  FinancialAidProvider,
  FinancialAidSyncSummary,
} from '@/lib/advocacy/financial-aid/types';

function diagnosisProfileFromBiomarkers(row: {
  id: string;
  user_id: string;
  biomarkers_json_encrypted: string | null;
}): DiagnosisProfile | null {
  if (!row.biomarkers_json_encrypted) return null;

  const biomarkers = decryptJson<BiomarkersData>(row.biomarkers_json_encrypted);
  const cancerType = biomarkers.cancer_type_inferred?.trim() ?? '';
  const histology = biomarkers.histology?.trim() ?? '';
  const stage = biomarkers.tnm_stage?.trim() ?? '';
  const parts = [cancerType, histology, stage].filter(Boolean);
  if (parts.length === 0) return null;

  return {
    userId: row.user_id,
    reportId: row.id,
    diagnosisCode: [cancerType, stage].filter(Boolean).join(' | ') || 'unclassified-diagnosis',
    diagnosisText: parts.join(' '),
  };
}

export async function syncFinancialAidFunds({
  provider,
  matcher,
}: {
  provider: FinancialAidProvider;
  matcher: DiagnosisMatcher;
}): Promise<FinancialAidSyncSummary> {
  const supabase = createServiceRoleSupabaseClient();

  const { data: syncRun, error: syncRunError } = await supabase
    .from('financial_aid_sync_runs')
    .insert({
      provider_name: provider.name,
      status: 'running',
    })
    .select('id')
    .single();

  if (syncRunError || !syncRun) {
    throw new Error('Unable to start financial aid sync run');
  }

  try {
    const funds = await provider.fetchFunds();
    const nowIso = new Date().toISOString();

    const { data: existingFunds } = await supabase
      .from('financial_aid_funds')
      .select(
        'source_slug, external_key, fund_name, current_status, eligibility_criteria, deep_link, diagnosis_focus, last_changed_at'
      );

    const existingMap = new Map(
      (existingFunds ?? []).map((row) => [`${row.source_slug}:${row.external_key}`, row])
    );

    const fundsToUpsert = funds.map((fund) => {
      const existing = existingMap.get(`${fund.sourceSlug}:${fund.externalKey}`);
      const hasChanged =
        !existing ||
        existing.fund_name !== fund.fundName ||
        existing.current_status !== fund.currentStatus ||
        existing.eligibility_criteria !== fund.eligibilityCriteria ||
        existing.deep_link !== fund.deepLink ||
        JSON.stringify(existing.diagnosis_focus ?? []) !== JSON.stringify(fund.diagnosisFocus);

      return {
        source_slug: fund.sourceSlug,
        external_key: fund.externalKey,
        fund_name: fund.fundName,
        current_status: fund.currentStatus,
        eligibility_criteria: fund.eligibilityCriteria,
        deep_link: fund.deepLink,
        diagnosis_focus: fund.diagnosisFocus,
        last_scraped_at: nowIso,
        last_changed_at: hasChanged ? nowIso : existing?.last_changed_at ?? nowIso,
      };
    });

    const { data: upsertedFunds, error: fundError } = await supabase
      .from('financial_aid_funds')
      .upsert(fundsToUpsert, {
        onConflict: 'source_slug,external_key',
      })
      .select('id, source_slug, external_key, fund_name, current_status, eligibility_criteria, deep_link, diagnosis_focus');

    if (fundError) {
      throw fundError;
    }

    const fundMap = new Map(
      (upsertedFunds ?? []).map((row) => [
        `${row.source_slug}:${row.external_key}`,
        {
          id: row.id as string,
          sourceSlug: row.source_slug as FinancialAidFundRecord['sourceSlug'],
          externalKey: row.external_key as string,
          fundName: row.fund_name as string,
          currentStatus: row.current_status as FinancialAidFundRecord['currentStatus'],
          eligibilityCriteria: row.eligibility_criteria as string,
          deepLink: row.deep_link as string,
          diagnosisFocus: (row.diagnosis_focus as string[] | null) ?? [],
        },
      ])
    );

    const { data: reportRows, error: reportError } = await supabase
      .from('patient_reports')
      .select('id, user_id, biomarkers_json_encrypted, last_updated')
      .order('last_updated', { ascending: false });

    if (reportError) {
      throw reportError;
    }

    const latestByUser = new Map<string, DiagnosisProfile>();
    for (const row of reportRows ?? []) {
      if (latestByUser.has(row.user_id as string)) continue;
      const diagnosis = diagnosisProfileFromBiomarkers({
        id: row.id as string,
        user_id: row.user_id as string,
        biomarkers_json_encrypted: row.biomarkers_json_encrypted as string | null,
      });
      if (diagnosis) {
        latestByUser.set(diagnosis.userId, diagnosis);
      }
    }

    let matchesCreatedOrUpdated = 0;
    let pendingNotifications = 0;
    const auditEntries: Array<{
      user_id: string | null;
      event_type: 'financial_aid_sync' | 'fund_match_refresh';
      model_id: string | null;
      entity_type: string;
      entity_id: string;
      details: Record<string, unknown>;
    }> = [];

    for (const diagnosis of Array.from(latestByUser.values())) {
      for (const fund of funds) {
        const matched = await matcher.matchDiagnosisToFund(diagnosis, fund);
        if (!matched) continue;

        const persistedFund = fundMap.get(`${fund.sourceSlug}:${fund.externalKey}`);
        if (!persistedFund) continue;

        const notificationState = persistedFund.currentStatus === 'open' ? 'pending' : 'dismissed';
        const { error: matchError } = await supabase
          .from('user_financial_aid_matches')
          .upsert(
            {
              user_id: diagnosis.userId,
              fund_id: persistedFund.id,
              diagnosis_code: matched.diagnosisCode,
              diagnosis_text: matched.diagnosisText,
              match_score: matched.score,
              matcher_provider: matched.provider,
              notification_state: notificationState,
              matched_at: new Date().toISOString(),
            },
            {
              onConflict: 'user_id,fund_id',
            }
          );

        if (matchError) {
          throw matchError;
        }

        matchesCreatedOrUpdated += 1;
        if (notificationState === 'pending') {
          pendingNotifications += 1;
        }

        auditEntries.push({
          user_id: diagnosis.userId,
          event_type: 'fund_match_refresh',
          model_id: matched.provider,
          entity_type: 'financial_aid_fund',
          entity_id: persistedFund.id,
          details: {
            fundName: persistedFund.fundName,
            sourceSlug: persistedFund.sourceSlug,
            matchScore: matched.score,
            diagnosisCode: matched.diagnosisCode,
          },
        });
      }
    }

    auditEntries.push({
      user_id: null,
      event_type: 'financial_aid_sync',
      model_id: provider.name,
      entity_type: 'financial_aid_sync_run',
      entity_id: syncRun.id as string,
      details: {
        fundsSeen: funds.length,
        fundsUpserted: upsertedFunds?.length ?? 0,
        matchesCreatedOrUpdated,
        pendingNotifications,
      },
    });

    if (auditEntries.length > 0) {
      const { error: auditError } = await supabase.from('ai_audit_log').insert(auditEntries);
      if (auditError) {
        throw auditError;
      }
    }

    const { error: completeError } = await supabase
      .from('financial_aid_sync_runs')
      .update({
        status: 'completed',
        records_seen: funds.length,
        records_upserted: upsertedFunds?.length ?? 0,
        completed_at: new Date().toISOString(),
      })
      .eq('id', syncRun.id);

    if (completeError) {
      throw completeError;
    }

    return {
      providerName: provider.name,
      fundsSeen: funds.length,
      fundsUpserted: upsertedFunds?.length ?? 0,
      matchesCreatedOrUpdated,
      pendingNotifications,
      syncRunId: syncRun.id as string,
    };
  } catch (error) {
    await supabase
      .from('financial_aid_sync_runs')
      .update({
        status: 'failed',
        error_message: error instanceof Error ? error.message : 'Unknown sync error',
        completed_at: new Date().toISOString(),
      })
      .eq('id', syncRun.id);
    throw error;
  }
}
