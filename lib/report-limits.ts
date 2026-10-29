import { hasCaregiverAccess, type SubscriptionTier } from '@/lib/pricing-config';

export const FREE_REPORTS_IN_WINDOW = 3;
export const FREE_REPORT_WINDOW_DAYS = 30;

export function freeReportWindowStart(now = new Date()): Date {
  return new Date(now.getTime() - FREE_REPORT_WINDOW_DAYS * 24 * 60 * 60 * 1000);
}

export function hasReachedFreeReportLimit(
  tier: SubscriptionTier,
  reportsInWindow: number
): boolean {
  if (hasCaregiverAccess(tier)) return false;
  return reportsInWindow >= FREE_REPORTS_IN_WINDOW;
}

export function freeReportLimitMessage() {
  return `Explorer includes up to ${FREE_REPORTS_IN_WINDOW} reports in the first ${FREE_REPORT_WINDOW_DAYS} days. Start a Caregiver Pro trial for unlimited report analyses.`;
}
