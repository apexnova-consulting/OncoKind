import { isFeatureEnabled } from '@/lib/feature-flags';
import {
  CONCIERGE_PRICE_VARIANTS_CENTS as CONFIG_CONCIERGE_PRICE_VARIANTS,
  conciergeListPriceCents as configConciergeListPriceCents,
} from '@/lib/concierge/config';

export type FamilyTierMode = 'merge' | 'distinct';

export const FAMILY_GUIDELINE_SHEET_NAME = 'Advocate Sheets';
export const FAMILY_PLUS_PLAN_NAME = 'Caregiver Plus';

export const HOMEPAGE_PITCH =
  'OncoKind tells your family what to do next after a cancer diagnosis, and does the paperwork when you want it done.';

export const CONCIERGE_PRICE_VARIANTS_CENTS = CONFIG_CONCIERGE_PRICE_VARIANTS;

export const INDIVIDUAL_ADVOCATE_PLAN = {
  id: 'individual_advocate' as const,
  name: 'Individual advocate',
  monthlyCents: 69900,
  monthlyLabel: '$699',
  cadenceMonthly: '/month',
};

export const FROZEN_TOOL_ROUTES = [
  '/features/access-agent',
  '/features/clinical-trial-matching',
  '/features/complete-the-picture',
  '/features/doctor-prep-sheet',
  '/features/empathy-filter',
  '/features/first-72-hours',
  '/features/insurance-denial-defense',
  '/features/oncokind-family',
] as const;

export const PUBLIC_RESULTS_MIN_N = 30;

export function familyTierMode(): FamilyTierMode {
  return isFeatureEnabled('family_tier_merge') ? 'merge' : 'distinct';
}

export function isFamilyTierMerged(): boolean {
  return true;
}

export function conciergeListPriceCents(): number {
  return configConciergeListPriceCents();
}

export function isIndividualAdvocatePlanPublic(): boolean {
  return isFeatureEnabled('individual_advocate_plan');
}

export function isToolFreezeOn(): boolean {
  return isFeatureEnabled('tool_freeze');
}
