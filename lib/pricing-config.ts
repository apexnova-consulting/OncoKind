/**
 * Single source of truth for OncoKind public pricing, feature copy, and entitlements.
 * Amounts follow the production pricing brief: Free $0, Caregiver Pro $39/mo,
 * Caregiver Plus $49/mo, Professional $999/mo. Yearly billing is 10x monthly.
 * Concierge list price lives in lib/concierge/config.ts and is referenced here.
 */

import {
  CONCIERGE_CAREGIVER_GRANT_DAYS,
  CONCIERGE_DEFAULT_PRICE_CENTS,
  formatUsdFromCents,
} from '@/lib/concierge/config';
import {
  FAMILY_GUIDELINE_SHEET_NAME,
  FAMILY_PLUS_PLAN_NAME,
  isFamilyTierMerged,
  isIndividualAdvocatePlanPublic,
  INDIVIDUAL_ADVOCATE_PLAN,
} from '@/lib/board-run2';

export const SITE_ORIGIN = 'https://www.oncokind.com';
export const CONCIERGE_LIST_PRICE_LABEL = formatUsdFromCents(CONCIERGE_DEFAULT_PRICE_CENTS);
export const YEARLY_MONTHS_INCLUDED = 10;
export const ANNUAL_SAVINGS_PERCENT = Math.round((1 - YEARLY_MONTHS_INCLUDED / 12) * 100);

export type PlanId = 'free' | 'caregiver' | 'advocate' | 'professional' | 'enterprise';
export type BillingInterval = 'monthly' | 'yearly';
export type CheckoutPlanKey = 'pro' | 'caregiver' | 'advocate' | 'plus' | 'professional';
export type FeatureMinPlan = PlanId | 'paid';

export type EntitlementCell = string;

export type CatalogFeature = {
  id: string;
  name: string;
  homepage?: {
    href: string;
    desc: string;
    tag: string;
    consumerGrid?: boolean;
    spotlight?: boolean;
  };
  cells: Record<'free' | 'caregiver' | 'advocate' | 'professional', EntitlementCell>;
};

export const PLANS = {
  free: {
    id: 'free' as const,
    checkoutKey: null,
    name: 'Free',
    monthlyCents: 0,
    yearlyCents: 0,
    monthlyLabel: '$0',
    yearlyLabel: '$0',
    cadenceMonthly: 'forever',
    cadenceYearly: 'forever',
    cta: 'Get Started Free',
    signupHref: '/signup',
    badge: null as string | null,
  },
  caregiver: {
    id: 'caregiver' as const,
    checkoutKey: 'pro' as const,
    name: 'Caregiver Pro',
    monthlyCents: 3900,
    yearlyCents: 39000,
    monthlyLabel: '$39',
    yearlyLabel: '$390',
    cadenceMonthly: '/month',
    cadenceYearly: '/year',
    cta: 'Start Caregiver Pro',
    signupHref: '/signup?plan=pro',
    badge: 'Most popular for families',
  },
  advocate: {
    id: 'advocate' as const,
    checkoutKey: 'advocate' as const,
    name: FAMILY_PLUS_PLAN_NAME,
    monthlyCents: 4900,
    yearlyCents: 49000,
    monthlyLabel: '$49',
    yearlyLabel: '$490',
    cadenceMonthly: '/month',
    cadenceYearly: '/year',
    cta: 'Start Caregiver Plus',
    signupHref: '/signup?plan=plus',
    badge: 'Travel and lodging help',
  },
  professional: {
    id: 'professional' as const,
    checkoutKey: 'professional' as const,
    name: 'Professional',
    monthlyCents: 99900,
    yearlyCents: 999000,
    monthlyLabel: '$999',
    yearlyLabel: '$9,990',
    cadenceMonthly: '/month',
    cadenceYearly: '/year',
    cta: 'Book a Demo',
    signupHref: 'https://calendly.com/oncokind-support',
    badge: 'Advocate workspace for independent advocates',
  },
  enterprise: {
    id: 'enterprise' as const,
    checkoutKey: null,
    name: 'Enterprise',
    monthlyCents: null,
    yearlyCents: null,
    monthlyLabel: 'Custom',
    yearlyLabel: 'Custom',
    cadenceMonthly: '',
    cadenceYearly: '',
    cta: 'Talk to sales',
    signupHref: 'https://calendly.com/oncokind-support',
    badge: null as string | null,
  },
} as const;

export const CAREGIVER_FEATURES = [
  'Everything in Free',
  'Unlimited reports',
  'Doctor Prep Sheet PDF export',
  'Second Opinion Mode',
  'Appointment Check-In',
  'Full trial matching (up to 50 miles)',
  'Goals of Care Prep Sheet',
  'Care Timeline (full)',
  'First 72 Hours reminders and PDF',
  'Genetic Counseling Prep Sheet PDF',
  'Insurance Denial Defense appeal packet',
];

export const ADVOCATE_FEATURES = [
  'Everything in Caregiver Pro',
  'Travel and lodging tracker',
  'Access Agent full tracker and reminders',
  FAMILY_GUIDELINE_SHEET_NAME,
  'Priority email support',
];

export const PROFESSIONAL_FEATURES = [
  'Everything in Caregiver Plus',
  'Advocate workspace with multi-patient views',
  'Branded PDFs and case tracking',
  'Batch document processing',
  'Partner path for sponsored Concierge cases',
  'KindAuth for post-acute teams',
];

export function caregiverFeatureList(): string[] {
  if (!isFamilyTierMerged()) return CAREGIVER_FEATURES;
  return [...CAREGIVER_FEATURES, 'Travel and lodging tracker', FAMILY_GUIDELINE_SHEET_NAME];
}

export function advocateFeatureList(): string[] {
  return ADVOCATE_FEATURES;
}

export function professionalFeatureList(): string[] {
  if (isFamilyTierMerged()) {
    return ['Everything in Caregiver Pro', ...PROFESSIONAL_FEATURES.slice(1)];
  }
  return PROFESSIONAL_FEATURES;
}

export const FREE_FEATURES = [
  'Up to 3 reports in the first 30 days',
  'Basic care map and Care Timeline',
  'Empathy Filter on every output',
  'First 72 Hours core checklist',
  'Family tree and invites',
  'Trial matching preview (top 3)',
  'Decode insurance denial letters',
  'Read-only community access',
];

export const CATALOG_FEATURES: CatalogFeature[] = [
  {
    id: 'report_processing',
    name: 'Report processing',
    cells: {
      free: '3 reports in 30 days',
      caregiver: 'Unlimited',
      advocate: 'Unlimited',
      professional: 'Batch intake',
    },
  },
  {
    id: 'cancer_profile',
    name: 'AI Cancer Profile & Care Map',
    homepage: {
      href: '/#sample-demo',
      desc: 'Plain-language translation of the pathology report, with Empathy Filter applied.',
      tag: 'Free',
      consumerGrid: true,
      spotlight: true,
    },
    cells: {
      free: 'Basic',
      caregiver: 'Full',
      advocate: 'Full',
      professional: 'Advanced',
    },
  },
  {
    id: 'doctor_prep',
    name: 'Doctor Prep Sheet PDF',
    homepage: {
      href: '/features/doctor-prep-sheet',
      desc: 'Personalized questions based on diagnosis, stage, and biomarkers. PDF export on Caregiver Pro.',
      tag: 'Caregiver Pro',
      consumerGrid: true,
      spotlight: true,
    },
    cells: {
      free: 'In-app preview',
      caregiver: 'PDF export',
      advocate: 'PDF export',
      professional: 'Co-branded PDF',
    },
  },
  {
    id: 'second_opinion',
    name: 'Second Opinion Mode',
    homepage: {
      href: '/journey/second-opinion',
      desc: 'A complete intake packet for a new oncologist: summary, history, and questions.',
      tag: 'Caregiver Pro',
      consumerGrid: true,
    },
    cells: {
      free: 'Not included',
      caregiver: 'Included',
      advocate: 'Included',
      professional: 'Included',
    },
  },
  {
    id: 'check_in',
    name: 'Appointment Check-In',
    homepage: {
      href: '/journey/check-in',
      desc: 'After-visit check-ins that capture what changed and what to ask next.',
      tag: 'Caregiver Pro',
      consumerGrid: true,
    },
    cells: {
      free: 'Not included',
      caregiver: 'Included',
      advocate: 'Included',
      professional: 'Included',
    },
  },
  {
    id: 'timeline',
    name: 'Care Timeline',
    homepage: {
      href: '/journey/timeline',
      desc: 'A living record of diagnoses, appointments, and milestones. Basic on Free, full on Caregiver Pro.',
      tag: 'Basic on Free',
      consumerGrid: true,
    },
    cells: {
      free: 'Basic',
      caregiver: 'Full',
      advocate: 'Full',
      professional: 'Full',
    },
  },
  {
    id: 'trials',
    name: 'Clinical Trial Matching',
    homepage: {
      href: '/features/clinical-trial-matching',
      desc: 'Free shows a preview of the top 3 matches. Caregiver Pro unlocks full details within 50 miles.',
      tag: 'Limited on Free',
      consumerGrid: true,
      spotlight: true,
    },
    cells: {
      free: 'Top 3 preview',
      caregiver: 'Full, 50 miles',
      advocate: 'Full, 50 miles',
      professional: 'Custom',
    },
  },
  {
    id: 'goals_of_care',
    name: 'Goals of Care Prep Sheet',
    homepage: {
      href: '/journey/goals-of-care',
      desc: 'Questions that help you talk with the care team about what matters most.',
      tag: 'Caregiver Pro',
      consumerGrid: true,
    },
    cells: {
      free: 'Not included',
      caregiver: 'Included',
      advocate: 'Included',
      professional: 'Included',
    },
  },
  {
    id: 'insurance',
    name: 'Insurance Denial Defense',
    homepage: {
      href: '/features/insurance-denial-defense',
      desc: 'Decode denial letters free. Caregiver Pro unlocks the appeal packet.',
      tag: 'Caregiver Pro',
      consumerGrid: true,
      spotlight: true,
    },
    cells: {
      free: 'Decode letter',
      caregiver: 'Included',
      advocate: 'Included',
      professional: 'Included',
    },
  },
  {
    id: 'financial_aid',
    name: 'Travel and lodging tracker',
    homepage: {
      href: '/journey/financial-help',
      desc: 'Track trial and treatment travel, lodging, and caregiver cost help. For copay and cost help, see Access Agent.',
      tag: FAMILY_PLUS_PLAN_NAME,
      consumerGrid: true,
    },
    cells: {
      free: 'Not included',
      caregiver: 'Not included',
      advocate: 'Included',
      professional: 'Included',
    },
  },
  {
    id: 'community',
    name: 'Community',
    homepage: {
      href: '/community',
      desc: 'Read-only while posting is paused until a moderator is in place.',
      tag: 'Read-only',
      consumerGrid: true,
    },
    cells: {
      free: 'Read-only',
      caregiver: 'Read-only',
      advocate: 'Read-only',
      professional: 'Read-only',
    },
  },
  {
    id: 'empathy_filter',
    name: 'Empathy Filter',
    homepage: {
      href: '/features/empathy-filter',
      desc: 'Keeps the facts. Never volunteers survival statistics. Routes prognosis questions to your care team.',
      tag: 'All plans',
      consumerGrid: true,
      spotlight: true,
    },
    cells: {
      free: 'Included',
      caregiver: 'Included',
      advocate: 'Included',
      professional: 'Included',
    },
  },
  {
    id: 'complete_the_picture',
    name: 'Complete the Picture',
    homepage: {
      href: '/features/complete-the-picture',
      desc: 'Complete the Picture. See what your report says, what it does not mention, and the questions worth asking next.',
      tag: 'Free summary',
      consumerGrid: true,
      spotlight: true,
    },
    cells: {
      free: 'Summary plus top 2 questions',
      caregiver: 'All questions, tracker, PDF, letters',
      advocate: 'All questions, tracker, PDF, letters',
      professional: 'Multi-patient view, branded PDFs',
    },
  },
  {
    id: 'access_agent',
    name: 'Access Agent',
    homepage: {
      href: '/features/access-agent',
      desc: 'Find out what getting to a trial or specialist may really cost, and where to look for help.',
      tag: 'Free estimate',
      consumerGrid: true,
      spotlight: true,
    },
    cells: {
      free: 'Estimate plus top 3 programs',
      caregiver: 'All matches, packet PDFs, basic tracker',
      advocate: 'Full tracker and reminders',
      professional: 'Full tracker, multi-patient',
    },
  },
  {
    id: 'first_72',
    name: 'First 72 Hours checklist',
    homepage: {
      href: '/features/first-72-hours',
      desc: 'A calm, sequenced plan for the first days after a diagnosis. Core checklist on every plan.',
      tag: 'Free',
      consumerGrid: true,
      spotlight: true,
    },
    cells: {
      free: 'Core checklist',
      caregiver: 'Sync, reminders, PDF',
      advocate: 'Sync, reminders, PDF',
      professional: 'Sync, reminders, PDF',
    },
  },
  {
    id: 'family',
    name: 'OncoKind Family tree',
    homepage: {
      href: '/features/oncokind-family',
      desc: 'Invite relatives, map family history, and prepare for genetic counseling together.',
      tag: 'Free',
      consumerGrid: true,
    },
    cells: {
      free: 'Tree and invites',
      caregiver: 'Plus genetic counseling PDF',
      advocate: 'Plus genetic counseling PDF',
      professional: 'Plus genetic counseling PDF',
    },
  },
  {
    id: 'concierge',
    name: 'OncoKind Concierge',
    homepage: {
      href: '/concierge',
      desc: `We collect records, submit the intake packet to the center you choose, and track it until you are Case Ready. ${CONCIERGE_LIST_PRICE_LABEL} per case, includes ${CONCIERGE_CAREGIVER_GRANT_DAYS} days of Caregiver Pro.`,
      tag: `${CONCIERGE_LIST_PRICE_LABEL} per case`,
      consumerGrid: true,
    },
    cells: {
      free: `${CONCIERGE_LIST_PRICE_LABEL} per case`,
      caregiver: `${CONCIERGE_LIST_PRICE_LABEL} per case, includes ${CONCIERGE_CAREGIVER_GRANT_DAYS} days of Caregiver Pro`,
      advocate: `${CONCIERGE_LIST_PRICE_LABEL} per case`,
      professional: 'Sponsored cases for partners',
    },
  },
  {
    id: 'prior_auth',
    name: 'KindAuth',
    cells: {
      free: 'Not included',
      caregiver: 'Not included',
      advocate: 'Not included',
      professional: 'Included for post-acute teams',
    },
  },
  {
    id: 'care_plan_sheets',
    name: FAMILY_GUIDELINE_SHEET_NAME,
    homepage: {
      href: '/features/doctor-prep-sheet',
      desc: 'Questions that help a family prepare for care-plan conversations. Not a substitute for licensed guidelines.',
      tag: FAMILY_PLUS_PLAN_NAME,
      consumerGrid: true,
    },
    cells: {
      free: 'Not included',
      caregiver: 'Not included',
      advocate: 'Included',
      professional: 'Included',
    },
  },
  {
    id: 'genetic_counseling',
    name: 'Genetic Counseling Prep Sheet',
    homepage: {
      href: '/features/oncokind-family',
      desc: 'Questions to bring to a genetic counseling visit, with PDF export on Caregiver Pro.',
      tag: 'Caregiver Pro',
      consumerGrid: true,
    },
    cells: {
      free: 'Not included',
      caregiver: 'PDF export',
      advocate: 'PDF export',
      professional: 'PDF export',
    },
  },
  {
    id: 'hipaa_baa',
    name: 'HIPAA BAA',
    cells: {
      free: 'Not included',
      caregiver: 'Not included',
      advocate: 'Not included',
      professional: 'Not offered yet',
    },
  },
  {
    id: 'support',
    name: 'Support',
    cells: {
      free: 'Community',
      caregiver: 'Priority email',
      advocate: 'Priority email',
      professional: 'Dedicated',
    },
  },
];

export const CONSUMER_HOMEPAGE_FEATURES = CATALOG_FEATURES.filter(
  (feature) => feature.homepage?.consumerGrid
);

export const FEATURE_HUB_FEATURES = CATALOG_FEATURES.filter((feature) => feature.homepage);

export const HOMEPAGE_SPOTLIGHT_IDS = FEATURE_HUB_FEATURES.map((feature) => feature.id);

export const HOMEPAGE_SPOTLIGHT_FEATURES = FEATURE_HUB_FEATURES;

export const HOMEPAGE_TOOL_COUNT = FEATURE_HUB_FEATURES.length;

export const HOMEPAGE_HERO = {
  title: 'You should not have to understand oncology to advocate for someone you love.',
  subtitle:
    'Understand and prepare on your own with our tools, or let our team handle the records, forms, and follow-up.',
  cta: 'Upload your first report. It is free.',
  paidUnlock:
    `Free includes up to 3 reports in the first 30 days. Caregiver Pro ($39/mo) unlocks PDF exports, Second Opinion Mode, Appointment Check-In, full trial matching, and Insurance Denial Defense. ${FAMILY_PLUS_PLAN_NAME} ($49/mo) adds the travel and lodging tracker. Concierge is ${CONCIERGE_LIST_PRICE_LABEL} per case and includes ${CONCIERGE_CAREGIVER_GRANT_DAYS} days of Caregiver Pro.`,
};

export const PRICING_PAGE = {
  title: 'Simple, transparent pricing for the hardest journey.',
  description:
    `Tools: Free, Caregiver Pro at $39/month or $390/year, ${FAMILY_PLUS_PLAN_NAME} at $49/month or $490/year. Professional is demo and invoice. Concierge is ${CONCIERGE_LIST_PRICE_LABEL} per case. No credit card required to start Tools.`,
};

export function yearlyAmountCents(monthlyCents: number): number {
  return monthlyCents * YEARLY_MONTHS_INCLUDED;
}

export function numberToToolHeadline(count: number): string {
  const words = [
    'Zero',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
  ];
  const word = words[count] ?? String(count);
  return `${word} tools. One mission: prepare you for what is next.`;
}

export type SubscriptionTier = string | null | undefined;

export function normalizeTier(tier: SubscriptionTier): string {
  return (tier ?? 'free').toLowerCase();
}

export function planIdFromTier(tier: SubscriptionTier): PlanId {
  const value = normalizeTier(tier);
  if (value === 'professional') return 'professional';
  if (value === 'enterprise') return 'enterprise';
  if (value === 'advocate') return 'advocate';
  if (value === 'pro' || value === 'caregiver') return 'caregiver';
  return 'free';
}

const PLAN_RANK: Record<PlanId, number> = {
  free: 0,
  caregiver: 1,
  advocate: 2,
  professional: 3,
  enterprise: 4,
};

export function hasMinPlan(tier: SubscriptionTier, min: PlanId): boolean {
  return PLAN_RANK[planIdFromTier(tier)] >= PLAN_RANK[min];
}

/** Caregiver Pro and every higher paid tier. Legacy `pro` maps here. */
export function hasCaregiverAccess(tier: SubscriptionTier): boolean {
  return hasMinPlan(tier, 'caregiver');
}

/** Travel and lodging tracker. Merge mode folds this into Caregiver Pro. */
export function hasAdvocateAccess(tier: SubscriptionTier): boolean {
  if (isFamilyTierMerged()) return hasCaregiverAccess(tier);
  return hasMinPlan(tier, 'advocate') || hasMinPlan(tier, 'professional');
}

export function publicCatalogFeatures() {
  const features = CATALOG_FEATURES.filter((feature) => feature.id !== 'hipaa_baa');
  if (!isFamilyTierMerged()) return features;
  return features.map((feature) => {
    if (feature.id !== 'financial_aid') return feature;
    return {
      ...feature,
      homepage: feature.homepage ? { ...feature.homepage, tag: 'Caregiver Pro' } : undefined,
      cells: { ...feature.cells, caregiver: 'Included' },
    };
  });
}

export function publicPricingHeaders(): string[] {
  if (isFamilyTierMerged()) {
    return [PLANS.free.name, PLANS.caregiver.name, PLANS.professional.name];
  }
  return [PLANS.free.name, PLANS.caregiver.name, PLANS.advocate.name, PLANS.professional.name];
}

export function showFamilyPlusPlan(): boolean {
  return !isFamilyTierMerged();
}

export function showIndividualAdvocatePlan(): boolean {
  return isIndividualAdvocatePlanPublic();
}

export { INDIVIDUAL_ADVOCATE_PLAN };

export function hasPaidAccess(tier: SubscriptionTier): boolean {
  return hasCaregiverAccess(tier);
}

export function hasKindAuthAccess(tier: SubscriptionTier): boolean {
  return hasMinPlan(tier, 'professional');
}

export function hasMultiPatientAccess(tier: SubscriptionTier): boolean {
  return hasKindAuthAccess(tier);
}

export function displayPlanName(tier: SubscriptionTier): string {
  return PLANS[planIdFromTier(tier)].name;
}

export function isCheckoutPlanKey(value: string | null): value is CheckoutPlanKey {
  return value === 'pro' || value === 'caregiver' || value === 'advocate' || value === 'plus' || value === 'professional';
}

export function isBillingInterval(value: string | null): value is BillingInterval {
  return value === 'monthly' || value === 'yearly';
}

export function canonicalCheckoutPlan(plan: CheckoutPlanKey): 'pro' | 'advocate' | 'professional' {
  if (plan === 'caregiver' || plan === 'pro') return 'pro';
  if ((plan === 'advocate' || plan === 'plus') && isFamilyTierMerged()) return 'pro';
  if (plan === 'plus' || plan === 'advocate') return 'advocate';
  return plan;
}
