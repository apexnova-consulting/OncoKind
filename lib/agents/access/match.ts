import { ASSISTANCE_PROGRAMS, type AssistanceProgram } from '@/content/agents/programs/v1';
import type { AccessIntake } from '@/lib/agents/access/estimate';

export type MatchBand = 'likely_eligible' | 'may_be_eligible' | 'not_eligible';

export type ProgramMatch = {
  program: AssistanceProgram;
  band: MatchBand;
  reasons: string[];
};

function verifiedOnly(includeUnverified: boolean): AssistanceProgram[] {
  if (includeUnverified) return ASSISTANCE_PROGRAMS;
  const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
  return ASSISTANCE_PROGRAMS.filter((program) => {
    if (program.status !== 'active') return false;
    return new Date(program.last_verified_on).getTime() >= cutoff;
  });
}

export function matchPrograms(intake: AccessIntake, options?: { includeUnverified?: boolean }): ProgramMatch[] {
  const cancer = (intake.cancerType ?? 'any').toLowerCase();
  return verifiedOnly(Boolean(options?.includeUnverified)).map((program) => {
    const reasons: string[] = [];
    const types = program.eligibility.cancer_types.map((item) => item.toLowerCase());
    const cancerOk = types.includes('any') || types.some((item) => cancer.includes(item) || item.includes(cancer));
    if (!cancerOk) {
      reasons.push('Cancer type in the intake is outside this program focus.');
      return { program, band: 'not_eligible' as const, reasons };
    }
    reasons.push('Cancer type is within the program focus, or the program is open to any cancer type.');
    if (program.eligibility.requires_trial_enrollment) {
      reasons.push('This program usually expects trial enrollment. Confirm with the organization.');
    }
    if (program.eligibility.requires_physician_referral) {
      reasons.push('A physician referral or social work referral may be required.');
    }
    if (program.eligibility.income_rule && (intake.incomeBand === 'not_sure' || !intake.incomeBand)) {
      reasons.push('Income documentation may be requested. You can skip this field.');
    }
    if (program.status !== 'active') {
      reasons.push('This record is awaiting content-team verification. Last verified date is shown.');
    }
    const band: MatchBand = program.status !== 'active' ? 'may_be_eligible' : program.eligibility.requires_trial_enrollment
      ? 'may_be_eligible'
      : 'likely_eligible';
    return { program, band, reasons };
  });
}

export function isUsPhoneAllowlisted(phone: string, program: AssistanceProgram): boolean {
  const digits = phone.replace(/\D/g, '');
  if (digits.length !== 10 && !(digits.length === 11 && digits.startsWith('1'))) return false;
  if (/^(900|976|911|112)/.test(digits.slice(-10))) return false;
  const programDigits = (program.contact.phone ?? '').replace(/\D/g, '').slice(-10);
  return programDigits.length === 10 && digits.slice(-10) === programDigits;
}

export const APPLICATION_STATUSES = [
  'Not started',
  'Gathering documents',
  'Submitted',
  'Awaiting reply',
  'Approved',
  'Declined',
  'Closed',
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];
