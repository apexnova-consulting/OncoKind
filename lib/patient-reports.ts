import { createServerSupabaseClient } from '@/lib/supabase-server';
import { decryptJson } from '@/lib/encryption';

export interface BiomarkersData {
  names?: string[];
  statuses?: string[];
  tnm_stage?: string | null;
  histology?: string | null;
  cancer_type_inferred?: string | null;
}

export interface AnalysisResultsData {
  summary?: string;
  keyFindings?: string[];
  suggestedQuestions?: string[];
  comparisonHighlight?: string | null;
}

export interface PatientReportData {
  id: string;
  biomarkers: BiomarkersData;
  matchedTrials: { matched_trials: unknown[]; analysis_results?: AnalysisResultsData };
  confidenceScore: number;
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'string' ? item : typeof item === 'number' ? String(item) : ''))
    .filter(Boolean);
}

function normalizeNullableString(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value : null;
}

export async function getPatientReport(
  reportId: string,
  userId: string
): Promise<PatientReportData | null> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from('patient_reports')
    .select('id, biomarkers_json_encrypted, matched_trials_json_encrypted, confidence_score')
    .eq('id', reportId)
    .eq('user_id', userId)
    .single();

  if (error || !data) return null;

  try {
    const rawBiomarkers = data.biomarkers_json_encrypted
      ? decryptJson<BiomarkersData>(data.biomarkers_json_encrypted as string)
      : { names: [], statuses: [] };
    const biomarkers: BiomarkersData = {
      names: normalizeStringArray(rawBiomarkers.names),
      statuses: normalizeStringArray(rawBiomarkers.statuses),
      tnm_stage: normalizeNullableString(rawBiomarkers.tnm_stage),
      histology: normalizeNullableString(rawBiomarkers.histology),
      cancer_type_inferred: normalizeNullableString(rawBiomarkers.cancer_type_inferred),
    };

    const rawMatchedTrials = data.matched_trials_json_encrypted
      ? decryptJson<{ matched_trials?: unknown[]; analysis_results?: AnalysisResultsData }>(
          data.matched_trials_json_encrypted as string
        )
      : { matched_trials: [] };
    const matchedTrials = {
      matched_trials: Array.isArray(rawMatchedTrials.matched_trials)
        ? rawMatchedTrials.matched_trials
        : [],
      analysis_results: rawMatchedTrials.analysis_results
        ? {
            summary: normalizeNullableString(rawMatchedTrials.analysis_results.summary) ?? undefined,
            keyFindings: normalizeStringArray(rawMatchedTrials.analysis_results.keyFindings),
            suggestedQuestions: normalizeStringArray(
              rawMatchedTrials.analysis_results.suggestedQuestions
            ),
            comparisonHighlight: normalizeNullableString(
              rawMatchedTrials.analysis_results.comparisonHighlight
            ),
          }
        : undefined,
    };

    return {
      id: data.id,
      biomarkers,
      matchedTrials,
      confidenceScore: Number(data.confidence_score) ?? 0,
    };
  } catch {
    return null;
  }
}
