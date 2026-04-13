import type {
  DiagnosisMatcher,
  DiagnosisProfile,
  FinancialAidFundRecord,
  MatchResult,
} from '@/lib/advocacy/financial-aid/types';

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function toTokens(value: string) {
  return normalize(value).split(' ').filter(Boolean);
}

function overlapScore(diagnosis: string, fund: FinancialAidFundRecord) {
  const diagnosisText = normalize(diagnosis);
  const diagnosisTokens = new Set(toTokens(diagnosis));
  const focusMatches = fund.diagnosisFocus.filter((term) => diagnosisText.includes(normalize(term))).length;
  const eligibilityTokens = toTokens(fund.eligibilityCriteria);
  const tokenMatches = eligibilityTokens.filter((token) => diagnosisTokens.has(token)).length;
  const tokenScore = Math.min(0.6, tokenMatches / 12);
  const focusScore = Math.min(0.4, focusMatches * 0.2);
  return Number((focusScore + tokenScore).toFixed(4));
}

export const keywordFallbackMatcher: DiagnosisMatcher = {
  name: 'keyword-fallback',
  async matchDiagnosisToFund(
    diagnosis: DiagnosisProfile,
    fund: FinancialAidFundRecord
  ): Promise<MatchResult | null> {
    const score = overlapScore(diagnosis.diagnosisText, fund);
    if (score < 0.18) return null;
    return {
      score,
      provider: this.name,
      diagnosisCode: diagnosis.diagnosisCode,
      diagnosisText: diagnosis.diagnosisText,
    };
  },
};
