/**
 * Single source of truth for OncoKind public pricing, feature copy, and entitlements.
 * Amounts follow the production pricing brief: Free $0, Caregiver Pro $39/mo,
 * Advocate Plan $49/mo, Professional $999/mo. Yearly billing is 10x monthly.
 */

export const SITE_ORIGIN = 'https://www.oncokind.com';
export const YEARLY_MONTHS_INCLUDED = 10;
export const ANNUAL_SAVINGS_PERCENT = Math.round((1 - YEARLY_MONTHS_INCLUDED / 12) * 100);

export type PlanId = 'free' | 'caregiver' | 'advocate' | 'professional' | 'enterprise';
export type BillingInterval = 'monthly' | 'yearly';
export type CheckoutPlanKey = 'pro' | 'caregiver' | 'advocate' | 'professional';
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
    badge: 'Most Popular for Families',
  },
  advocate: {
    id: 'advocate' as const,
    checkoutKey: 'advocate' as const,
    name: 'Advocate Plan',
    monthlyCents: 4900,
    yearlyCents: 49000,
    monthlyLabel: '$49',
    yearlyLabel: '$490',
    cadenceMonthly: '/month',
    cadenceYearly: '/year',
    cta: 'Start Advocate Plan',
    signupHref: '/signup?plan=advocate',
    badge: 'Insurance & financial navigation',
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
    cta: 'Start Professional',
    signupHref: '/signup?plan=professional',
    badge: 'KindAuth for care teams',
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
  'Unlimited patient scans',
  'Doctor Prep Sheet PDF export',
  'Second Opinion Mode',
  'Appointment Check-In',
  'Full trial matching (up to 50 miles)',
  'Goals of Care Prep Sheet',
  'Care Timeline (full)',
  'First 72 Hours calendar, reminders, and PDF export',
  'Genetic Counseling Prep Sheet PDF',
  'Full community posting',
];

export const ADVOCATE_FEATURES = [
  'Everything in Caregiver Pro',
  'Insurance Denial Defense',
  'Live Financial Aid Tracker',
  'Guideline-Informed Advocate Sheets',
];

export const PROFESSIONAL_FEATURES = [
  'Everything in Advocate Plan',
  'KindAuth prior authorization engine',
  'Multi-patient dashboard',
  'Batch document analysis',
  'HIPAA BAA available on request',
];

export const FREE_FEATURES = [
  '1 lifetime scan and Cancer Profile',
  'Basic care map and Care Timeline',
  'Empathy Filter on every output',
  'First 72 Hours core checklist',
  'OncoKind Family tree and invites',
  'Trial matching preview (top 3)',
  'Read-only community access',
];

export const CATALOG_FEATURES: CatalogFeature[] = [
  {
    id: 'report_processing',
    name: 'Report processing',
    cells: {
      free: '1 total scan',
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
      desc: 'Decode denial letters and generate a structured appeal packet.',
      tag: 'Advocate Plan',
      consumerGrid: true,
      spotlight: true,
    },
    cells: {
      free: 'Not included',
      caregiver: 'Not included',
      advocate: 'Included',
      professional: 'Included',
    },
  },
  {
    id: 'financial_aid',
    name: 'Live Financial Aid Tracker',
    homepage: {
      href: '/journey/financial-help',
      desc: 'Live matching to co-pay programs and foundation grants.',
      tag: 'Advocate Plan',
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
      desc: 'Read-only on Free, full access on paid plans.',
      tag: 'Read-only on Free',
      consumerGrid: true,
    },
    cells: {
      free: 'Read-only',
      caregiver: 'Full access',
      advocate: 'Full access',
      professional: 'Full access',
    },
  },
  {
    id: 'empathy_filter',
    name: 'Empathy Filter',
    homepage: {
      href: '/features/empathy-filter',
      desc: 'Removes survival statistics and fear-based language from every output.',
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
    id: 'kindauth',
    name: 'KindAuth',
    cells: {
      free: 'Not included',
      caregiver: 'Not included',
      advocate: 'Not included',
      professional: 'Included',
    },
  },
  {
    id: 'hipaa_baa',
    name: 'HIPAA BAA',
    cells: {
      free: 'Not included',
      caregiver: 'Not included',
      advocate: 'Not included',
      professional: 'Available on request',
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

export const HOMEPAGE_SPOTLIGHT_IDS = [
  'cancer_profile',
  'first_72',
  'doctor_prep',
  'empathy_filter',
  'trials',
  'insurance',
] as const;

export const HOMEPAGE_SPOTLIGHT_FEATURES = HOMEPAGE_SPOTLIGHT_IDS.map(
  (id) => CATALOG_FEATURES.find((feature) => feature.id === id)!
).filter((feature) => feature.homepage?.spotlight);

export const HOMEPAGE_TOOL_COUNT = HOMEPAGE_SPOTLIGHT_FEATURES.length;

export const HOMEPAGE_HERO = {
  title: 'You should not have to understand oncology to advocate for someone you love.',
  subtitle:
    'Upload your first report free and get your Cancer Profile in minutes. Paid plans unlock Doctor Prep Sheet PDFs, full trial matching, insurance appeals, and more.',
  cta: 'Upload your first report. It is free.',
  paidUnlock:
    'Caregiver Pro ($39/mo) unlocks PDF exports, Second Opinion Mode, Appointment Check-In, and full trial matching. Advocate Plan ($49/mo) adds Insurance Denial Defense and the Live Financial Aid Tracker. KindAuth is on Professional.',
};

export const PRICING_PAGE = {
  title: 'Simple, transparent pricing for the hardest journey.',
  description:
    'Free, Caregiver Pro at $39/month or $390/year, Advocate Plan at $49/month or $490/year, and Professional at $999/month. Yearly billing is 10 months. No credit card required to start.',
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

/** Advocate Plan and above. Insurance Denial Defense and Live Financial Aid Tracker. */
export function hasAdvocateAccess(tier: SubscriptionTier): boolean {
  return hasMinPlan(tier, 'advocate');
}

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
  return value === 'pro' || value === 'caregiver' || value === 'advocate' || value === 'professional';
}

export function isBillingInterval(value: string | null): value is BillingInterval {
  return value === 'monthly' || value === 'yearly';
}

export function canonicalCheckoutPlan(plan: CheckoutPlanKey): 'pro' | 'advocate' | 'professional' {
  if (plan === 'caregiver' || plan === 'pro') return 'pro';
  return plan;
}
