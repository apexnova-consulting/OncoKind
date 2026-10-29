import { isBaaReady } from '@/lib/feature-flags';

export const MEDICAL_DISCLAIMER_TEXT =
  'For educational support only. Not medical advice. Always consult your oncology team before making any treatment decisions.';

export const GLOBAL_SITE_DISCLAIMER_TEXT =
  'OncoKind is an educational support tool. Nothing on this site constitutes medical advice. Always consult your oncologist or care team before making any treatment decisions. OncoKind is not a substitute for professional medical guidance.';

export const PATH_B_PRIVACY_LANGUAGE =
  'Family plans are an educational tool. OncoKind is not a covered entity. Tools: raw report text is deleted after processing.';

export const PROFESSIONAL_SECURITY_REVIEW_TEXT = 'Enterprise security review available upon request';

export const PROFESSIONAL_HIPAA_NOTE_WHEN_READY =
  'A Business Associate Agreement can be requested for qualified organizations after a security review.';

export const PROFESSIONAL_HIPAA_NOTE =
  'A Business Associate Agreement is not offered on self-serve plans yet. Organizations can request a demo and a security review.';

export function professionalHipaaNote(): string {
  return isBaaReady() ? PROFESSIONAL_HIPAA_NOTE_WHEN_READY : PROFESSIONAL_HIPAA_NOTE;
}

export const APPOINTMENT_EXPLANATION_NOTE =
  'Explanation based on established oncology literature. Verify specifics with your care team.';

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

export function getCancerProfileSources(_cancerType?: string) {
  return [
    'National Cancer Institute (cancer.gov)',
    `Accessed: ${formatMonthYear(new Date())}`,
    APPOINTMENT_EXPLANATION_NOTE,
  ];
}

export function getClinicalTrialSources() {
  return [
    'Trial data sourced from ClinicalTrials.gov',
    `Last verified: ${formatLongDate(DEFAULT_TRIALS_VERIFIED_AT)}`,
    'Trial status may change. Confirm eligibility directly with the trial site.',
  ];
}

export function getInsuranceAppealSources() {
  return [
    'Appeals guidance based on standard internal appeal processes.',
    'State-specific rules may vary. OncoKind does not provide legal advice.',
  ];
}
