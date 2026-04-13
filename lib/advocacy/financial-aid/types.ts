export type FinancialAidStatus = 'open' | 'closed' | 'waitlist';
export type FinancialAidSource = 'paf' | 'healthwell' | 'cancercare';

export interface FinancialAidFundRecord {
  sourceSlug: FinancialAidSource;
  externalKey: string;
  fundName: string;
  currentStatus: FinancialAidStatus;
  eligibilityCriteria: string;
  deepLink: string;
  diagnosisFocus: string[];
}

export interface DiagnosisProfile {
  userId: string;
  reportId: string;
  diagnosisCode: string;
  diagnosisText: string;
}

export interface MatchResult {
  score: number;
  provider: string;
  diagnosisCode: string;
  diagnosisText: string;
}

export interface FinancialAidProvider {
  name: string;
  fetchFunds(): Promise<FinancialAidFundRecord[]>;
}

export interface DiagnosisMatcher {
  name: string;
  matchDiagnosisToFund(
    diagnosis: DiagnosisProfile,
    fund: FinancialAidFundRecord
  ): Promise<MatchResult | null>;
}

export interface FinancialAidSyncSummary {
  providerName: string;
  fundsSeen: number;
  fundsUpserted: number;
  matchesCreatedOrUpdated: number;
  pendingNotifications: number;
  syncRunId: string;
}
