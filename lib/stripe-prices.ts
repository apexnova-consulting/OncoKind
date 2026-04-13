/**
 * Stripe price IDs from environment.
 * Set all 4 in Vercel for full pricing options.
 */

export const stripePrices = {
  /** Pro monthly (default; STRIPE_PRICE_ID or STRIPE_PRICE_ID_PRO_MONTHLY) */
  proMonthly:
    process.env.STRIPE_PRICE_ID_PRO_MONTHLY ?? process.env.STRIPE_PRICE_ID ?? '',
  /** Pro yearly */
  proYearly: process.env.STRIPE_PRICE_ID_PRO_YEARLY ?? '',
  /** Advocate monthly */
  advocateMonthly: process.env.STRIPE_PRICE_ID_ADVOCATE_MONTHLY ?? '',
  /** Advocate yearly */
  advocateYearly: process.env.STRIPE_PRICE_ID_ADVOCATE_YEARLY ?? '',
  /** Enterprise: unlimited users */
  enterpriseUnlimited: process.env.STRIPE_PRICE_ID_ENTERPRISE_UNLIMITED ?? '',
  /** Enterprise: per seat */
  enterprisePerSeat: process.env.STRIPE_PRICE_ID_ENTERPRISE_PER_SEAT ?? '',
} as const;

export const hasProPrices = !!(
  stripePrices.proMonthly || stripePrices.proYearly
);
export const hasEnterprisePrices = !!(
  stripePrices.enterpriseUnlimited || stripePrices.enterprisePerSeat
);

export const hasAdvocatePrices = !!(
  stripePrices.advocateMonthly || stripePrices.advocateYearly
);

export type BillingInterval = 'monthly' | 'yearly';
export type CheckoutPlanKey = 'pro' | 'advocate';

export function isBillingInterval(value: string | null): value is BillingInterval {
  return value === 'monthly' || value === 'yearly';
}

export function isCheckoutPlanKey(value: string | null): value is CheckoutPlanKey {
  return value === 'pro' || value === 'advocate';
}

export function resolveCheckoutPriceId(plan: CheckoutPlanKey, interval: BillingInterval): string {
  if (plan === 'pro') {
    return interval === 'yearly' ? stripePrices.proYearly : stripePrices.proMonthly;
  }

  return interval === 'yearly'
    ? stripePrices.advocateYearly
    : stripePrices.advocateMonthly;
}

export function isKnownStripePriceId(priceId: string | null): boolean {
  if (!priceId) return false;

  return Object.values(stripePrices).includes(priceId);
}
