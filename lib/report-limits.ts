import { hasCaregiverAccess, hasKeepAccess, type SubscriptionTier } from '@/lib/pricing-config';
import { KEEP_REPORTS_PER_MONTH } from '@/lib/after-90/config';

export const FREE_REPORTS_IN_WINDOW = 3;
export const FREE_REPORT_WINDOW_DAYS = 30;

export function freeReportWindowStart(now = new Date()): Date {
  return new Date(now.getTime() - FREE_REPORT_WINDOW_DAYS * 24 * 60 * 60 * 1000);
}

export function keepReportWindowStart(now = new Date()): Date {
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export function reportWindowStart(tier: SubscriptionTier, now = new Date()): Date {
  if (hasKeepAccess(tier)) return keepReportWindowStart(now);
  return freeReportWindowStart(now);
}

export function hasReachedFreeReportLimit(
  tier: SubscriptionTier,
  reportsInWindow: number
): boolean {
  if (hasCaregiverAccess(tier)) return false;
  if (hasKeepAccess(tier)) return reportsInWindow >= KEEP_REPORTS_PER_MONTH;
  return reportsInWindow >= FREE_REPORTS_IN_WINDOW;
}

export function freeReportLimitMessage(tier?: SubscriptionTier) {
  if (hasKeepAccess(tier)) {
    return `Keep includes up to ${KEEP_REPORTS_PER_MONTH} report uploads per month. Upgrade to Caregiver Pro for unlimited report analyses.`;
  }
  return `Explorer includes up to ${FREE_REPORTS_IN_WINDOW} reports in the first ${FREE_REPORT_WINDOW_DAYS} days. Start a Caregiver Pro trial for unlimited report analyses.`;
}
