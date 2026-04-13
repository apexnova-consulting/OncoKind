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

export const hasAdvocatePrice = !!stripePrices.advocateMonthly;
