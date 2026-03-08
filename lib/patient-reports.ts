import { createServerSupabaseClient } from '@/lib/supabase-server';
import { decryptJson } from '@/lib/encryption';

export interface BiomarkersData {
  names?: string[];
  statuses?: string[];
  tnm_stage?: string | null;
  histology?: string | null;
  cancer_type_inferred?: string | null;
}

export interface PatientReportData {
  id: string;
  biomarkers: BiomarkersData;
  matchedTrials: { matched_trials: unknown[] };
  confidenceScore: number;
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
    const biomarkers = data.biomarkers_json_encrypted
      ? decryptJson<BiomarkersData>(data.biomarkers_json_encrypted as string)
      : { names: [], statuses: [] };
    const matchedTrials = data.matched_trials_json_encrypted
      ? decryptJson<{ matched_trials: unknown[] }>(data.matched_trials_json_encrypted as string)
      : { matched_trials: [] };
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
