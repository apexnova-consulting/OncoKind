/**
 * Stripe price IDs.
 * Preferred v2 env vars (Care & Advocacy Pro / Professional) fall back to
 * legacy Advocate / Pro / Enterprise IDs so checkout keeps working until the
 * new products are created in Stripe and wired in Vercel.
 */

export const stripePrices = {
  careProMonthly:
    process.env.STRIPE_PRICE_ID_CARE_PRO_MONTHLY ??
    process.env.STRIPE_PRICE_ID_ADVOCATE_MONTHLY ??
    process.env.STRIPE_PRICE_ID_PRO_MONTHLY ??
    process.env.STRIPE_PRICE_ID ??
    '',
  careProAnnual:
    process.env.STRIPE_PRICE_ID_CARE_PRO_ANNUAL ??
    process.env.STRIPE_PRICE_ID_ADVOCATE_YEARLY ??
    process.env.STRIPE_PRICE_ID_PRO_YEARLY ??
    '',
  professionalMonthly:
    process.env.STRIPE_PRICE_ID_PROFESSIONAL_MONTHLY ??
    process.env.STRIPE_PRICE_ID_ENTERPRISE_UNLIMITED ??
    '',
  /** @deprecated Use careProMonthly */
  proMonthly:
    process.env.STRIPE_PRICE_ID_PRO_MONTHLY ?? process.env.STRIPE_PRICE_ID ?? '',
  proYearly: process.env.STRIPE_PRICE_ID_PRO_YEARLY ?? '',
  advocateMonthly: process.env.STRIPE_PRICE_ID_ADVOCATE_MONTHLY ?? '',
  advocateYearly: process.env.STRIPE_PRICE_ID_ADVOCATE_YEARLY ?? '',
  enterpriseUnlimited: process.env.STRIPE_PRICE_ID_ENTERPRISE_UNLIMITED ?? '',
  enterprisePerSeat: process.env.STRIPE_PRICE_ID_ENTERPRISE_PER_SEAT ?? '',
} as const;

export const hasProPrices = !!(stripePrices.careProMonthly || stripePrices.proMonthly);
export const hasEnterprisePrices = !!(
  stripePrices.enterpriseUnlimited || stripePrices.enterprisePerSeat
);
export const hasAdvocatePrices = !!(
  stripePrices.careProMonthly || stripePrices.advocateMonthly
);
export const hasProfessionalPrice = !!stripePrices.professionalMonthly;

export type BillingInterval = 'monthly' | 'yearly';
export type CheckoutPlanKey = 'pro' | 'advocate' | 'care' | 'professional';

export function isBillingInterval(value: string | null): value is BillingInterval {
  return value === 'monthly' || value === 'yearly';
}

export function isCheckoutPlanKey(value: string | null): value is CheckoutPlanKey {
  return value === 'pro' || value === 'advocate' || value === 'care' || value === 'professional';
}

export function resolveCheckoutPriceId(plan: CheckoutPlanKey, interval: BillingInterval): string {
  if (plan === 'professional') {
    return stripePrices.professionalMonthly;
  }
  return interval === 'yearly' ? stripePrices.careProAnnual : stripePrices.careProMonthly;
}

export function isKnownStripePriceId(priceId: string | null): boolean {
  if (!priceId) return false;
  return Object.values(stripePrices).includes(priceId);
}

export function tierFromPriceId(priceId: string | undefined): 'advocate' | 'professional' | 'enterprise' | 'pro' {
  if (!priceId) return 'advocate';
  if (
    priceId === stripePrices.professionalMonthly ||
    priceId === process.env.STRIPE_PRICE_ID_PROFESSIONAL_MONTHLY
  ) {
    return 'professional';
  }
  if (
    priceId === stripePrices.enterpriseUnlimited ||
    priceId === stripePrices.enterprisePerSeat
  ) {
    if (priceId === stripePrices.professionalMonthly) return 'professional';
    return 'enterprise';
  }
  return 'advocate';
}

export const CARE_PRO_MONTHLY_AMOUNT = 29;
export const CARE_PRO_ANNUAL_AMOUNT = 199;
export const PROFESSIONAL_MONTHLY_AMOUNT = 999;
export const ANNUAL_SAVINGS_PERCENT = Math.round(
  (1 - CARE_PRO_ANNUAL_AMOUNT / (CARE_PRO_MONTHLY_AMOUNT * 12)) * 100
);
