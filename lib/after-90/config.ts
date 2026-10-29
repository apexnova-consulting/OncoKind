import { CONCIERGE_CAREGIVER_GRANT_DAYS } from '@/lib/concierge/config';
import { isFeatureEnabled, type FeatureFlagName } from '@/lib/feature-flags';

export const AFTER_90_PHASE_NAME = 'After the first 90 days';
export const KEEP_PLAN_NAME = 'Keep';
export const KEEP_PLAN_LABEL = 'After active treatment';
export const RECORDS_VAULT_NAME = 'Records vault';
export const FOLLOW_UP_VISIT_PREP_NAME = 'Follow-up visit prep';
export const FAMILY_RISK_NAME = 'Family risk';

export const KEEP_MONTHLY_CENTS = 900;
export const KEEP_YEARLY_CENTS = 9900;
export const KEEP_MONTHLY_LABEL = '$9';
export const KEEP_YEARLY_LABEL = '$99';

export const KEEP_REPORTS_PER_MONTH = 3;
export const KEEP_ACCOUNT_AGE_DAYS = 90;
export const VAULT_RETENTION_DAYS_AFTER_PLAN_END = 90;
export const PAUSE_MONTH_OPTIONS = [1, 2, 3] as const;
export const ROLLOVER_REMINDER_DAYS = 7;
export const SPONSORSHIP_NOTICE_DAYS = 30;
export const ORG_RENEWAL_REMINDER_DAYS = [60, 30] as const;

export const ORG_SEAT_CAREGIVER_PRO_YEARLY_CENTS = 39000;
export const ORG_SEAT_KEEP_YEARLY_CENTS = KEEP_YEARLY_CENTS;
export const ORG_CONCIERGE_CASE_CENTS = 29900;

export const KEEP_FEATURES = [
  RECORDS_VAULT_NAME,
  FOLLOW_UP_VISIT_PREP_NAME,
  FAMILY_RISK_NAME,
  'Care Timeline (full)',
  'Doctor Prep Sheet PDF for follow-up visits',
  `${KEEP_REPORTS_PER_MONTH} report uploads per month`,
  'Empathy Filter',
] as const;

export const KEEP_EXCLUDED = [
  'Unlimited reports',
  'Full trial matching',
  'Second Opinion Mode',
  'Denial Defense appeal packets',
] as const;

export const KEEP_CARD_BODY = `${KEEP_PLAN_NAME}, ${KEEP_MONTHLY_LABEL}/month or ${KEEP_YEARLY_LABEL}/year. ${KEEP_PLAN_LABEL}: your ${RECORDS_VAULT_NAME.toLowerCase()}, ${FOLLOW_UP_VISIT_PREP_NAME.toLowerCase()}, and ${FAMILY_RISK_NAME.toLowerCase()} tools.`;

export const KEEP_PRICING_CTA_LOCKED = 'Available after your first 90 days';
export const KEEP_FAQ_QUESTION = 'What is Keep and when can I switch?';
export const KEEP_FAQ_ANSWER = `${KEEP_PLAN_NAME} is ${KEEP_MONTHLY_LABEL}/month or ${KEEP_YEARLY_LABEL}/year for families after active treatment. It includes the ${RECORDS_VAULT_NAME.toLowerCase()}, ${FOLLOW_UP_VISIT_PREP_NAME.toLowerCase()}, and ${FAMILY_RISK_NAME.toLowerCase()} tools. You can choose it after 90 days, after you mark active treatment finished, after a Concierge case is Case Ready, or from the cancel save flow. New families start on Explorer or Caregiver Pro.`;

export const AFTER_TREATMENT_FAQ_QUESTION = 'What happens after treatment?';
export const AFTER_TREATMENT_FAQ_ANSWER = KEEP_FAQ_ANSWER;

export const FEATURES_STAGE4_LINE = `${AFTER_90_PHASE_NAME}: ${RECORDS_VAULT_NAME.toLowerCase()}, ${FOLLOW_UP_VISIT_PREP_NAME.toLowerCase()}, and ${FAMILY_RISK_NAME.toLowerCase()}. Included in ${KEEP_PLAN_NAME} and Caregiver Pro.`;

export const CONCIERGE_KEEP_ROLLOVER_NOTE = `Optional: continue with ${KEEP_PLAN_NAME} after your ${CONCIERGE_CAREGIVER_GRANT_DAYS} days.`;

export function keepRolloverCheckboxLabel(): string {
  return `After my ${CONCIERGE_CAREGIVER_GRANT_DAYS} days of Caregiver Pro, continue with ${KEEP_PLAN_NAME} at ${KEEP_MONTHLY_LABEL}/month. I can cancel anytime before then.`;
}

export const CONCIERGE_VAULT_RETENTION_CLAIM = `Concierge records are deleted ${VAULT_RETENTION_DAYS_AFTER_PLAN_END} days after Case Ready, unless you choose to keep them in your ${RECORDS_VAULT_NAME} with Caregiver Pro or ${KEEP_PLAN_NAME}.`;

export const VAULT_TRUST_SUMMARY = `The ${RECORDS_VAULT_NAME} stores uploaded reports and Concierge records only after the account owner consents on a dedicated screen. Storage lasts while Caregiver Pro or ${KEEP_PLAN_NAME} is active. After the plan ends we keep the vault for ${VAULT_RETENTION_DAYS_AFTER_PLAN_END} days, email twice, then delete. Without consent, Tools still delete raw report text after processing, and Concierge records still delete ${VAULT_RETENTION_DAYS_AFTER_PLAN_END} days after Case Ready.`;

export const FAMILY_RISK_TRUST_SUMMARY = `In ${FAMILY_RISK_NAME}, each relative creates their own account and gives their own consent. A relative never sees the patient's records or reports unless the account owner shares a specific item. The patient's account never sees a relative's own data without that relative's consent.`;

export const ORG_DASHBOARD_TRUST_SUMMARY =
  'Organization dashboards show counts only: seats used, active families, Concierge cases by status, and families who reached Case Ready. They never show names, diagnoses, or documents.';

export const FAMILY_RISK_REMINDER =
  'Ask your doctor whether your family history changes when or how you should be screened.';

export const ASK_CARE_TEAM = 'Ask your care team what this means.';
export const FOLLOW_UP_SCHEDULE_PROMPT =
  'Enter the follow-up visit and scan dates your care team gave you. OncoKind never suggests a schedule.';

export const BEREAVEMENT_REASON = 'My loved one has passed away';
export const BEREAVEMENT_MESSAGE =
  'We are sorry for your loss. Your plan is canceled. You can download or delete the records on this screen. We will not send marketing email.';

export const KEEP_SWITCH_BUTTON = `Switch to ${KEEP_PLAN_NAME}, ${KEEP_MONTHLY_LABEL}/month`;

export type After90Flag =
  | 'saveFlow'
  | 'keepPlan'
  | 'keepEligibility'
  | 'recordsVault'
  | 'after90Phase'
  | 'orgSponsorship'
  | 'conciergeKeepRollover';

const FLAG_MAP: Record<After90Flag, FeatureFlagName> = {
  saveFlow: 'saveFlow',
  keepPlan: 'keepPlan',
  keepEligibility: 'keepEligibility',
  recordsVault: 'recordsVault',
  after90Phase: 'after90Phase',
  orgSponsorship: 'orgSponsorship',
  conciergeKeepRollover: 'conciergeKeepRollover',
};

export function isAfter90FlagOn(flag: After90Flag): boolean {
  return isFeatureEnabled(FLAG_MAP[flag]);
}

export const CANCEL_REASONS = [
  'Too expensive',
  'Treatment is over and I need less help',
  'I am using other tools',
  BEREAVEMENT_REASON,
  'Prefer not to say',
] as const;
