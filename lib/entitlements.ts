export type SubscriptionTier =
  | 'free'
  | 'pro'
  | 'advocate'
  | 'professional'
  | 'enterprise'
  | string
  | null
  | undefined;

export {
  normalizeTier,
  hasCaregiverAccess,
  hasAdvocateAccess,
  hasPaidAccess,
  hasKindAuthAccess,
  hasMultiPatientAccess,
  displayPlanName,
} from '@/lib/pricing-config';

import {
  hasCaregiverAccess,
  hasAdvocateAccess as hasAdvocatePlanAccess,
  hasKindAuthAccess,
} from '@/lib/pricing-config';

/** @deprecated Use hasCaregiverAccess. Paid family navigation (not KindAuth). */
export function hasCareAdvocacyAccess(tier: SubscriptionTier): boolean {
  return hasCaregiverAccess(tier);
}

/** KindAuth is Professional only. */
export function hasKindAuthSelfServe(tier: SubscriptionTier): boolean {
  return hasKindAuthAccess(tier);
}

export function hasKindAuthPro(tier: SubscriptionTier): boolean {
  return hasKindAuthAccess(tier);
}

export function isPaidTier(tier: SubscriptionTier): boolean {
  return hasCaregiverAccess(tier);
}

export function hasInsuranceAdvocacyAccess(tier: SubscriptionTier): boolean {
  return hasAdvocatePlanAccess(tier);
}
