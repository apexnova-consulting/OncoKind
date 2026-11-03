/**
 * OK-01 single source of truth for plan names, prices, included days,
 * refunds, eligibility, and Case Ready variants. UI must read from here.
 */

export const PLANS = {
  explorer: { displayName: 'Explorer', monthly: 0, yearly: 0, monthlyCents: 0, yearlyCents: 0 },
  caregiver_pro: {
    displayName: 'Caregiver Pro',
    monthly: 39,
    yearly: 390,
    monthlyCents: 3900,
    yearlyCents: 39000,
  },
  keep: {
    displayName: 'Keep',
    monthly: 9,
    yearly: 99,
    monthlyCents: 900,
    yearlyCents: 9900,
    enabled: false,
  },
} as const;

export const CONCIERGE = {
  case_ready: {
    displayName: 'Case Ready',
    price_variants: {
      A: { amountUsd: 499, amountCents: 49900, stripePriceIdEnv: 'STRIPE_PRICE_ID_CASE_READY_A' },
      B: { amountUsd: 649, amountCents: 64900, stripePriceIdEnv: 'STRIPE_PRICE_ID_CASE_READY_B' },
    },
    variant_switch_rule: 'manual' as const,
  },
  concierge_included_pro_days: 60,
};

export const REFUNDS = {
  full_refund_before_first_records_request: true,
  business_days_rule: 10,
};

export const ELIGIBILITY = {
  adult_only: true,
  us_facilities_only: true,
  any_cancer: true,
};

export const ECONOMICS = {
  min_net_rev_per_hour: 100,
  checkpoint_cases: 10,
  checkpoint_days: 60,
};

export const CALENDLY_URL =
  process.env.NEXT_PUBLIC_CALENDLY_URL || 'https://calendly.com/oncokind-support';

export const STAGE_LABELS = {
  understand: 'Understand',
  prepare: 'Prepare',
  fight: 'Fight',
  plan: 'Plan Ahead',
} as const;

export const STAGE_DESCRIPTIONS = {
  understand: 'See what the report says, what it does not say, and the first 72 hours.',
  prepare: 'Questions before the visit, a check-in after, and a living timeline.',
  fight: 'Decode a denial, estimate travel, and find assistance programs.',
  plan: 'Trials, family history, second opinions, or Concierge when you want it handled.',
} as const;

export const ACCESS_AGENT_UNVERIFIED_LABEL =
  'Program details change. Confirm with the program before applying.';

export const DIAGNOSIS_SOURCES_LINE = (date: string) =>
  `Sources: National Cancer Institute (cancer.gov) and ClinicalTrials.gov. Last updated ${date} by OncoKind. OncoKind is not a medical provider.`;

export const TRIAL_DISCLAIMER =
  'Ask the care team. Listing a trial does not confirm eligibility.';

export const GTD_EMPTY_STATE =
  'Few trials are recruiting for this diagnosis right now. Most GTD is treated with standard care. You can ask a GTD center whether they have studies that are not listed yet.';

export const PREP_LIBRARY_CARE_PLAN_NOTE =
  'Not clinical guidelines. Your care team decides the plan.';

export const PARTNERS_INTRO =
  'Foundations and employers can sponsor Concierge cases for families. You see case counts and status only, never medical details.';

export type CaseReadyVariant = 'A' | 'B';

export function activeCaseReadyVariant(): CaseReadyVariant {
  return process.env.CONCIERGE_ACTIVE_VARIANT === 'B' ? 'B' : 'A';
}

export function caseReadyVariantConfig(variant: CaseReadyVariant = activeCaseReadyVariant()) {
  return CONCIERGE.case_ready.price_variants[variant];
}

export function caseReadyPriceCents(): number {
  const locked = process.env.CONCIERGE_PRICE_LOCK_CENTS;
  if (locked) {
    const value = Number(locked);
    if (Number.isFinite(value) && value > 0) return value;
  }
  return caseReadyVariantConfig().amountCents;
}

export function caseReadyPriceUsd(): number {
  return Math.round(caseReadyPriceCents() / 100);
}

export function caseReadyPriceLabel(): string {
  return `$${caseReadyPriceUsd()}`;
}

export function caseReadyStripePriceId(): string {
  const envKey = caseReadyVariantConfig().stripePriceIdEnv;
  return process.env[envKey] || process.env.STRIPE_PRICE_ID_CONCIERGE || '';
}

export function includedProDays(): number {
  return CONCIERGE.concierge_included_pro_days;
}

export function explorerName(): string {
  return PLANS.explorer.displayName;
}

export function caregiverProName(): string {
  return PLANS.caregiver_pro.displayName;
}

export function caseReadyName(): string {
  return CONCIERGE.case_ready.displayName;
}

export function haveUsDoThisLabel(): string {
  return `Have us do this, ${caseReadyPriceLabel()}`;
}
