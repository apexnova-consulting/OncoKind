import { BANNED_PLACEHOLDER_STRINGS } from '@/lib/legal/placeholders';
import { PLANS, showKeepPlan } from '@/lib/pricing-config';
import { CONCIERGE_LIST_PRICE_LABEL } from '@/lib/pricing-config';
import { KEEP_MONTHLY_LABEL, KEEP_PLAN_NAME, KEEP_YEARLY_LABEL } from '@/lib/after-90/config';
import { FROZEN_TOOL_ROUTES, isToolFreezeOn } from '@/lib/board-run2';

export function findBannedPlaceholders(text: string): string[] {
  const lower = text.toLowerCase();
  return BANNED_PLACEHOLDER_STRINGS.filter((item) => lower.includes(item));
}

export function expectedPublicPrices() {
  return {
    caregiverMonthly: PLANS.caregiver.monthlyLabel,
    caregiverYearly: PLANS.caregiver.yearlyLabel,
    plusMonthly: PLANS.advocate.monthlyLabel,
    professionalMonthly: PLANS.professional.monthlyLabel,
    concierge: CONCIERGE_LIST_PRICE_LABEL,
    ...(showKeepPlan()
      ? { keepMonthly: KEEP_MONTHLY_LABEL, keepYearly: KEEP_YEARLY_LABEL, keepName: KEEP_PLAN_NAME }
      : {}),
  };
}

export function unexpectedToolRoutes(existingFeaturePages: string[]): string[] {
  if (!isToolFreezeOn()) return [];
  return existingFeaturePages.filter((route) => !FROZEN_TOOL_ROUTES.includes(route as (typeof FROZEN_TOOL_ROUTES)[number]));
}
