/**
 * Concierge pricing, capacity, and labor inputs live here with the rest of
 * entitlements. No hardcoded dollar amounts in UI.
 */

export const CONCIERGE_BRAND = {
  name: 'OncoKind Concierge',
  tagline: 'Get Me There',
  headline: 'We handle the records, forms, and phone calls, so your family can focus on what matters.',
  subhead:
    'OncoKind Concierge collects your records, prepares and submits your intake packet to the center you choose, and tracks it until you are Case Ready.',
  boundary:
    'We do not give medical advice or interpret results. We handle the paperwork and logistics. Your care team answers your medical questions.',
  caseReady:
    'Case Ready means your records are collected or accounted for, your packet is submitted, your appointment status is documented, and your cost estimate and assistance applications are prepared.',
  disclaimer: 'Educational support, not medical advice.',
  delayHonesty:
    'Hospitals set their own timelines. We follow up on your behalf and show you exactly where each request stands.',
} as const;

export const CONCIERGE_PRICE_TEST_CENTS = [14900, 29900, 49900] as const;
export const CONCIERGE_DEFAULT_PRICE_CENTS = 29900;
export const CONCIERGE_CAPACITY_CAP = 15;
export const CONCIERGE_CAREGIVER_GRANT_DAYS = 60;
export const CONCIERGE_LOADED_HOURLY_CENTS = 3400;
export const CONCIERGE_QA_SAMPLE_RATE = 0.2;
export const CONCIERGE_FEE_APPROVAL_THRESHOLD_CENTS = 7500;
export const CONCIERGE_FIRST_ACTION_BUSINESS_DAYS = 1;
export const CONCIERGE_SUBMISSION_READY_TARGET_BUSINESS_DAYS = 10;
export const CONCIERGE_FAMILY_CONFIRMATION_BUSINESS_DAYS = 3;
export const CONCIERGE_FOLLOWUP_DAYS = [3, 7, 10] as const;
export const FUNDFINDER_URL = 'https://www.cancer.gov/about-cancer/treatment/cam/hp/financial-resources-pdq';

export function conciergePriceLockCents(): number | null {
  const raw = process.env.CONCIERGE_PRICE_LOCK_CENTS;
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : null;
}

export function weeklyCohortPriceCents(now = new Date()): number {
  const locked = conciergePriceLockCents();
  if (locked) return locked;
  const utc = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const week = Math.floor(utc / (7 * 24 * 60 * 60 * 1000));
  return CONCIERGE_PRICE_TEST_CENTS[week % CONCIERGE_PRICE_TEST_CENTS.length];
}

export function formatUsdFromCents(cents: number): string {
  return `$${Math.round(cents / 100)}`;
}

export function conciergeCapacityCap(): number {
  const raw = process.env.CONCIERGE_CAPACITY_CAP;
  const value = raw ? Number(raw) : CONCIERGE_CAPACITY_CAP;
  return Number.isFinite(value) && value > 0 ? value : CONCIERGE_CAPACITY_CAP;
}

export function loadedCoordinatorHourlyCents(): number {
  const raw = process.env.CONCIERGE_LOADED_HOURLY_CENTS;
  const value = raw ? Number(raw) : CONCIERGE_LOADED_HOURLY_CENTS;
  return Number.isFinite(value) && value > 0 ? value : CONCIERGE_LOADED_HOURLY_CENTS;
}
