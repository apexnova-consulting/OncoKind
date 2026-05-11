export const MEDICAL_DISCLAIMER_TEXT =
  'For educational support only. Not medical advice. Always consult your oncology team before making any treatment decisions.';

export const GLOBAL_SITE_DISCLAIMER_TEXT =
  'OncoKind is an educational support tool. Nothing on this platform constitutes medical advice. Always consult your oncologist or care team. OncoKind is not a substitute for professional medical guidance.';

export const PATH_B_PRIVACY_LANGUAGE =
  'Built with privacy at its core. No raw report data retained. Educational tool — not a covered entity.';

export const PROFESSIONAL_SECURITY_REVIEW_TEXT = 'Enterprise security review available upon request';

export const PROFESSIONAL_HIPAA_NOTE =
  "HIPAA BAA available — contact us to discuss your organization's compliance requirements.";

export const APPOINTMENT_EXPLANATION_NOTE =
  'Explanation based on established oncology literature. Verify specifics with your care team.';

const DEFAULT_NCCN_VERSION = process.env.NEXT_PUBLIC_NCCN_GUIDELINES_VERSION ?? 'current';
const DEFAULT_TRIALS_VERIFIED_AT =
  process.env.NEXT_PUBLIC_CLINICAL_TRIALS_LAST_VERIFIED_AT ?? new Date().toISOString();

export function formatMonthYear(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Current';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatLongDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Current';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function getCancerProfileSources(cancerType?: string) {
  const label = cancerType?.trim() || 'Relevant cancer type';

  return [
    `NCCN Clinical Practice Guidelines in Oncology — ${label}, Version ${DEFAULT_NCCN_VERSION}`,
    'National Cancer Institute (cancer.gov)',
    `Accessed: ${formatMonthYear(new Date())}`,
    APPOINTMENT_EXPLANATION_NOTE,
  ];
}

export function getClinicalTrialSources() {
  return [
    'Trial data sourced from ClinicalTrials.gov',
    `Last verified: ${formatLongDate(DEFAULT_TRIALS_VERIFIED_AT)}`,
    'Trial status may change — confirm eligibility directly with the trial site.',
  ];
}

export function getInsuranceAppealSources() {
  return [
    'Appeals guidance based on standard internal appeal processes.',
    'State-specific rules may vary. OncoKind does not provide legal advice.',
  ];
}
