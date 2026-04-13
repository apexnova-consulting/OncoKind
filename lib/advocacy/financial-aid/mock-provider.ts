import type { FinancialAidFundRecord, FinancialAidProvider } from '@/lib/advocacy/financial-aid/types';

export const MOCK_FUNDS: FinancialAidFundRecord[] = [
  {
    sourceSlug: 'paf',
    externalKey: 'paf-lung-copay-relief',
    fundName: 'PAF Lung Cancer Co-Pay Relief Fund',
    currentStatus: 'open',
    eligibilityCriteria:
      'Supports people with lung cancer, non-small cell lung cancer, metastatic lung cancer, and stage IV lung cancer who need co-pay assistance.',
    deepLink: 'https://www.patientadvocate.org/connect-with-services/copay-relief/',
    diagnosisFocus: ['lung cancer', 'non-small cell lung cancer', 'nsclc', 'stage iv lung cancer'],
  },
  {
    sourceSlug: 'healthwell',
    externalKey: 'healthwell-lung-immunotherapy',
    fundName: 'HealthWell Advanced Lung Cancer Treatment Fund',
    currentStatus: 'waitlist',
    eligibilityCriteria:
      'For patients with advanced lung cancer, metastatic NSCLC, and biomarker-driven treatment needs requiring medication support.',
    deepLink: 'https://www.healthwellfoundation.org/fund/advanced-lung-cancer/',
    diagnosisFocus: ['advanced lung cancer', 'metastatic nsclc', 'stage iv lung cancer', 'lung cancer'],
  },
  {
    sourceSlug: 'cancercare',
    externalKey: 'cancercare-lung-transport',
    fundName: 'CancerCare Lung Cancer Transportation Assistance',
    currentStatus: 'open',
    eligibilityCriteria:
      'Transportation grants for people receiving treatment for lung cancer, small cell lung cancer, or non-small cell lung cancer.',
    deepLink: 'https://www.cancercare.org/financial',
    diagnosisFocus: ['lung cancer', 'non-small cell lung cancer', 'small cell lung cancer', 'nsclc'],
  },
];

export const mockFinancialAidProvider: FinancialAidProvider = {
  name: 'mock-seed-provider',
  async fetchFunds() {
    return MOCK_FUNDS;
  },
};
