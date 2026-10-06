export type CancerTypeKey =
  | 'nsclc'
  | 'breast'
  | 'colorectal'
  | 'prostate'
  | 'endometrial'
  | 'other';

export type RuleStatus = 'draft' | 'in_review' | 'approved' | 'retired';

export type CtpRule = {
  rule_id: string;
  version: string;
  status: RuleStatus;
  cancer_type: CancerTypeKey;
  item: string;
  aliases: string[];
  ask_whether_recommended: string;
  why_it_can_matter: string;
  bring_or_request?: string;
  citation: {
    title: string;
    source: string;
    version: string;
    date: string;
  };
  clinical_reviewer: string;
  reviewed_on: string;
  effective_from: string;
  effective_to: string | null;
  next_review_due: string;
  author: string;
  approver: string;
};

export const CTP_RULES_META = {
  corpus_id: 'ctp-rules',
  version: '1.0.0',
  intended_use:
    'Educational question preparation for adult caregivers. Not clinical decision support and not a device that recommends tests or treatments.',
  language: 'guideline-informed pending written licensing confirmation',
} as const;

const REVIEW = {
  clinical_reviewer: 'Pending named clinical reviewer',
  reviewed_on: '2026-10-06',
  effective_from: '2026-10-06',
  effective_to: null as string | null,
  next_review_due: '2027-01-06',
  author: 'content_ops_import',
  approver: 'pending_second_person',
  status: 'in_review' as RuleStatus,
  citation: {
    title: 'Guideline-informed biomarker conversation prompts',
    source: 'Internal educational corpus. Not a licensed guideline excerpt.',
    version: '1.0.0',
    date: '2026-10-06',
  },
};

function rule(
  cancer_type: CancerTypeKey,
  item: string,
  aliases: string[],
  ask: string,
  why: string,
  bring?: string
): CtpRule {
  return {
    rule_id: `${cancer_type}.${item.toLowerCase().replace(/[^a-z0-9]+/g, '_')}.v1`,
    version: '1.0.0',
    ...REVIEW,
    cancer_type,
    item,
    aliases,
    ask_whether_recommended: ask,
    why_it_can_matter: why,
    bring_or_request: bring,
  };
}

export const CTP_RULES: CtpRule[] = [
  rule(
    'nsclc',
    'EGFR',
    ['egfr'],
    'You may want to ask your care team whether EGFR testing is recommended for this situation, and whether results are already on file.',
    'EGFR results are commonly discussed in non-small cell lung cancer conversations because they can change which options the team reviews.',
    'Ask whether a molecular or NGS report exists and request a patient copy if it does.'
  ),
  rule(
    'nsclc',
    'ALK',
    ['alk'],
    'You may want to ask your care team whether ALK testing is recommended for this situation.',
    'ALK is a commonly referenced biomarker in non-small cell lung cancer planning conversations.',
    'Ask whether tissue from the biopsy is still available if more testing is discussed.'
  ),
  rule(
    'nsclc',
    'ROS1',
    ['ros1'],
    'You may want to ask your care team whether ROS1 testing is recommended for this situation.',
    'ROS1 is another commonly referenced marker in lung cancer molecular panels.'
  ),
  rule(
    'nsclc',
    'KRAS',
    ['kras'],
    'You may want to ask your care team whether KRAS testing is recommended for this situation.',
    'KRAS results are often part of a broader molecular conversation in lung cancer.'
  ),
  rule(
    'nsclc',
    'PD-L1',
    ['pd-l1', 'pdl1', 'pd l1'],
    'You may want to ask your care team whether PD-L1 testing is recommended for this situation, and how the result would be used in planning.',
    'PD-L1 is commonly referenced when teams discuss immunotherapy options. It is not a stage and it is not a promise.'
  ),
  rule(
    'nsclc',
    'Broad molecular panel',
    ['ngs', 'next generation sequencing', 'comprehensive genomic', 'molecular profiling'],
    'You may want to ask your care team whether a broader molecular or genomic panel is recommended for this type of cancer, and how results could affect options, including clinical trials.',
    'A panel can collect several markers in one report. Asking whether it was ordered prevents families from assuming a single line on pathology is the full picture.',
    'Ask for a copy of any molecular report and whether leftover tissue can be used.'
  ),
  rule(
    'breast',
    'ER',
    ['estrogen receptor', 'er-positive', 'er positive', 'er+'],
    'You may want to ask your care team whether estrogen receptor (ER) testing is recommended and whether the result is already in the report.',
    'Hormone receptor results are commonly used to shape breast cancer treatment conversations.'
  ),
  rule(
    'breast',
    'PR',
    ['progesterone receptor', 'pr-positive', 'pr positive', 'pr+'],
    'You may want to ask your care team whether progesterone receptor (PR) testing is recommended for this situation.',
    'PR is commonly reported alongside ER in breast cancer pathology.'
  ),
  rule(
    'breast',
    'HER2',
    ['her2', 'erbb2'],
    'You may want to ask your care team whether HER2 testing is recommended and how the result would be used.',
    'HER2 status is a commonly referenced part of breast cancer planning.'
  ),
  rule(
    'breast',
    'BRCA or hereditary counseling',
    ['brca', 'brca1', 'brca2'],
    'You may want to ask your care team whether genetic counseling is appropriate, and whether hereditary testing is recommended for this situation.',
    'Hereditary questions belong with the care team and, when appropriate, genetic counseling. OncoKind does not calculate hereditary likelihood.',
    'If counseling is recommended, OncoKind Family can help you gather relatives for that conversation.'
  ),
  rule(
    'colorectal',
    'KRAS',
    ['kras'],
    'You may want to ask your care team whether KRAS testing is recommended for this situation.',
    'KRAS is commonly referenced in colorectal cancer planning conversations.'
  ),
  rule(
    'colorectal',
    'NRAS',
    ['nras'],
    'You may want to ask your care team whether NRAS testing is recommended for this situation.',
    'NRAS is often reviewed with other RAS markers in colorectal cancer.'
  ),
  rule(
    'colorectal',
    'BRAF',
    ['braf'],
    'You may want to ask your care team whether BRAF testing is recommended for this situation.',
    'BRAF is a commonly referenced marker in colorectal cancer molecular discussions.'
  ),
  rule(
    'colorectal',
    'MSI or MMR',
    ['msi', 'mmr', 'mismatch repair', 'microsatellite'],
    'You may want to ask your care team whether MSI or mismatch repair testing is recommended for this situation.',
    'MSI and MMR results are commonly discussed because they can change which options the team reviews, including trials.'
  ),
  rule(
    'prostate',
    'Gleason grade',
    ['gleason'],
    'You may want to ask your care team to walk through the Gleason or grade group in plain language, and whether any other pathology details are still pending.',
    'Grade group language is commonly used in prostate cancer visits and is easy to miss in a dense report.'
  ),
  rule(
    'prostate',
    'BRCA or HRR',
    ['brca', 'hrr', 'homologous recombination'],
    'You may want to ask your care team whether BRCA or homologous recombination testing is recommended for this situation, and whether genetic counseling is appropriate.',
    'These markers are commonly referenced in advanced prostate cancer conversations. OncoKind does not calculate hereditary likelihood.',
  ),
  rule(
    'endometrial',
    'MMR or MSI',
    ['mmr', 'msi', 'mismatch repair', 'microsatellite'],
    'You may want to ask your care team whether mismatch repair or MSI testing is recommended for this situation.',
    'MMR and MSI are commonly referenced in endometrial cancer molecular conversations.'
  ),
  rule(
    'endometrial',
    'p53',
    ['p53', 'tp53'],
    'You may want to ask your care team whether p53 testing is recommended for this situation.',
    'p53 is often part of endometrial pathology discussions and may already be in the report under a different label.'
  ),
];

export const CTP_FALLBACK_QUESTION =
  'Ask your care team whether biomarker or genomic testing is recommended for your type of cancer, and how results could affect options, including clinical trials.';

export const CTP_NOTHING_FLAGGED =
  'Nothing flagged in the rules we can apply to this cancer type from the reports uploaded so far. You can still bring your questions.';

export function collectCtpCopy(): string {
  return [
    CTP_RULES_META.intended_use,
    CTP_FALLBACK_QUESTION,
    CTP_NOTHING_FLAGGED,
    ...CTP_RULES.flatMap((rule) => [
      rule.ask_whether_recommended,
      rule.why_it_can_matter,
      rule.bring_or_request ?? '',
    ]),
  ].join('\n');
}
