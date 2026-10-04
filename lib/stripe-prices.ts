import {
  canonicalCheckoutPlan,
  isCheckoutPlanKey as isCatalogCheckoutPlan,
  type BillingInterval,
  type CheckoutPlanKey,
} from '@/lib/pricing-config';

export type { BillingInterval, CheckoutPlanKey };

export const stripePrices = {
  caregiverMonthly:
    process.env.STRIPE_PRICE_ID_CAREGIVER_MONTHLY ??
    process.env.STRIPE_PRICE_ID_PRO_MONTHLY ??
    process.env.STRIPE_PRICE_ID ??
    '',
  caregiverYearly:
    process.env.STRIPE_PRICE_ID_CAREGIVER_YEARLY ?? process.env.STRIPE_PRICE_ID_PRO_YEARLY ?? '',
  advocateMonthly: process.env.STRIPE_PRICE_ID_ADVOCATE_MONTHLY ?? '',
  advocateYearly: process.env.STRIPE_PRICE_ID_ADVOCATE_YEARLY ?? '',
  professionalMonthly:
    process.env.STRIPE_PRICE_ID_PROFESSIONAL_MONTHLY ??
    process.env.STRIPE_PRICE_ID_ENTERPRISE_UNLIMITED ??
    '',
  /** @deprecated */
  proMonthly: process.env.STRIPE_PRICE_ID_PRO_MONTHLY ?? process.env.STRIPE_PRICE_ID ?? '',
  proYearly: process.env.STRIPE_PRICE_ID_PRO_YEARLY ?? '',
  careProMonthly:
    process.env.STRIPE_PRICE_ID_CAREGIVER_MONTHLY ??
    process.env.STRIPE_PRICE_ID_PRO_MONTHLY ??
    process.env.STRIPE_PRICE_ID ??
    '',
  careProAnnual:
    process.env.STRIPE_PRICE_ID_CAREGIVER_YEARLY ?? process.env.STRIPE_PRICE_ID_PRO_YEARLY ?? '',
  enterpriseUnlimited: process.env.STRIPE_PRICE_ID_ENTERPRISE_UNLIMITED ?? '',
  enterprisePerSeat: process.env.STRIPE_PRICE_ID_ENTERPRISE_PER_SEAT ?? '',
} as const;

export const hasProPrices = !!stripePrices.caregiverMonthly;
export const hasAdvocatePrices = !!stripePrices.advocateMonthly;
export const hasProfessionalPrice = !!stripePrices.professionalMonthly;
export const hasEnterprisePrices = !!(
  stripePrices.enterpriseUnlimited || stripePrices.enterprisePerSeat
);

export function isBillingInterval(value: string | null): value is BillingInterval {
  return value === 'monthly' || value === 'yearly';
}

export function isCheckoutPlanKey(value: string | null): value is CheckoutPlanKey {
  return isCatalogCheckoutPlan(value);
}

export function resolveCheckoutPriceId(plan: CheckoutPlanKey, interval: BillingInterval): string {
  const canonical = canonicalCheckoutPlan(plan);
  if (canonical === 'professional') return stripePrices.professionalMonthly;
  if (canonical === 'advocate') {
    return interval === 'yearly' ? stripePrices.advocateYearly : stripePrices.advocateMonthly;
  }
  return interval === 'yearly' ? stripePrices.caregiverYearly : stripePrices.caregiverMonthly;
}

export function isKnownStripePriceId(priceId: string | null): boolean {
  if (!priceId) return false;
  return Object.values(stripePrices).includes(priceId);
}

export function tierFromPriceId(
  priceId: string | undefined
): 'pro' | 'advocate' | 'professional' | 'enterprise' {
  if (!priceId) return 'pro';
  if (priceId === stripePrices.professionalMonthly) return 'professional';
  if (priceId === stripePrices.enterpriseUnlimited || priceId === stripePrices.enterprisePerSeat) {
    return 'enterprise';
  }
  if (priceId === stripePrices.advocateMonthly || priceId === stripePrices.advocateYearly) {
    return 'advocate';
  }
  return 'pro';
}

export const CAREGIVER_MONTHLY_AMOUNT = 39;
export const ADVOCATE_MONTHLY_AMOUNT = 49;
export const PROFESSIONAL_MONTHLY_AMOUNT = 999;
export const ANNUAL_SAVINGS_PERCENT = 17;
