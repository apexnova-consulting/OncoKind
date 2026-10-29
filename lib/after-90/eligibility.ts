import {
  KEEP_ACCOUNT_AGE_DAYS,
  isAfter90FlagOn,
} from '@/lib/after-90/config';

export type KeepEligibilityInput = {
  accountCreatedAt: string | Date | null;
  treatmentFinishedAt?: string | Date | null;
  conciergeCaseReadyAt?: string | Date | null;
  fromSaveFlow?: boolean;
  now?: Date;
};

export type KeepEligibilityReason =
  | 'account_age'
  | 'treatment_finished'
  | 'case_ready'
  | 'save_flow'
  | 'ineligible';

export function daysBetween(from: Date, to: Date): number {
  return Math.floor((to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000));
}

export function isKeepEligible(input: KeepEligibilityInput): {
  eligible: boolean;
  reason: KeepEligibilityReason;
} {
  if (!isAfter90FlagOn('keepPlan')) {
    return { eligible: false, reason: 'ineligible' };
  }
  if (isAfter90FlagOn('keepEligibility') === false) {
    return { eligible: false, reason: 'ineligible' };
  }
  if (input.fromSaveFlow) {
    return { eligible: true, reason: 'save_flow' };
  }
  const now = input.now ?? new Date();
  if (input.treatmentFinishedAt) {
    return { eligible: true, reason: 'treatment_finished' };
  }
  if (input.conciergeCaseReadyAt) {
    return { eligible: true, reason: 'case_ready' };
  }
  if (input.accountCreatedAt) {
    const created = new Date(input.accountCreatedAt);
    if (daysBetween(created, now) >= KEEP_ACCOUNT_AGE_DAYS) {
      return { eligible: true, reason: 'account_age' };
    }
  }
  return { eligible: false, reason: 'ineligible' };
}

export function shouldShowAfter90Phase(input: {
  accountCreatedAt: string | Date | null;
  treatmentFinishedAt?: string | Date | null;
  conciergeCaseReadyAt?: string | Date | null;
  now?: Date;
}): boolean {
  if (!isAfter90FlagOn('after90Phase')) return false;
  const now = input.now ?? new Date();
  if (input.treatmentFinishedAt) return true;
  if (input.conciergeCaseReadyAt) return true;
  if (input.accountCreatedAt && daysBetween(new Date(input.accountCreatedAt), now) >= KEEP_ACCOUNT_AGE_DAYS) {
    return true;
  }
  return false;
}
