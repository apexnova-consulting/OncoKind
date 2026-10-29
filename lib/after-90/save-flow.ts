import {
  BEREAVEMENT_REASON,
  CANCEL_REASONS,
  KEEP_MONTHLY_LABEL,
  KEEP_PLAN_NAME,
  PAUSE_MONTH_OPTIONS,
} from '@/lib/after-90/config';

export type SaveChoice = 'pause' | 'switch_keep' | 'cancel';

export type SaveScreen1 = {
  pauseMonths: typeof PAUSE_MONTH_OPTIONS;
  switchKeepLabel: string;
  showSwitchKeep: boolean;
  cancelLabel: 'Cancel my plan';
};

export function saveScreen1(input: { currentPlan: 'caregiver' | 'keep' | 'pro' | string }): SaveScreen1 {
  const isPro = input.currentPlan === 'caregiver' || input.currentPlan === 'pro';
  return {
    pauseMonths: PAUSE_MONTH_OPTIONS,
    switchKeepLabel: `Switch to ${KEEP_PLAN_NAME}, ${KEEP_MONTHLY_LABEL}/month`,
    showSwitchKeep: isPro,
    cancelLabel: 'Cancel my plan',
  };
}

export function isBereavementReason(reason: string | null | undefined): boolean {
  return reason === BEREAVEMENT_REASON;
}

export function cancelClicksRequired(): 2 {
  return 2;
}

export function allowedCancelReasons(): readonly string[] {
  return CANCEL_REASONS;
}

export function resumeAtFromMonths(months: number, now = new Date()): Date {
  const next = new Date(now);
  next.setUTCMonth(next.getUTCMonth() + months);
  return next;
}

export function unusedTimeRefundCents(input: {
  periodStart: Date;
  periodEnd: Date;
  amountPaidCents: number;
  now?: Date;
}): number {
  const now = input.now ?? new Date();
  const total = input.periodEnd.getTime() - input.periodStart.getTime();
  if (total <= 0) return 0;
  const remaining = Math.max(0, input.periodEnd.getTime() - now.getTime());
  return Math.round(input.amountPaidCents * (remaining / total));
}
