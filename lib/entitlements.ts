export type SubscriptionTier =
  | 'free'
  | 'pro'
  | 'advocate'
  | 'professional'
  | 'enterprise'
  | string
  | null
  | undefined;

export function normalizeTier(tier: SubscriptionTier): string {
  return (tier ?? 'free').toLowerCase();
}

/** Care & Advocacy Pro and every higher paid tier. Legacy `pro` maps here. */
export function hasCareAdvocacyAccess(tier: SubscriptionTier): boolean {
  const value = normalizeTier(tier);
  return value === 'pro' || value === 'advocate' || value === 'professional' || value === 'enterprise';
}

export function hasKindAuthSelfServe(tier: SubscriptionTier): boolean {
  return hasCareAdvocacyAccess(tier);
}

export function hasKindAuthPro(tier: SubscriptionTier): boolean {
  const value = normalizeTier(tier);
  return value === 'professional' || value === 'enterprise';
}

export function hasMultiPatientAccess(tier: SubscriptionTier): boolean {
  return hasKindAuthPro(tier);
}

export function isPaidTier(tier: SubscriptionTier): boolean {
  return hasCareAdvocacyAccess(tier);
}

export function displayPlanName(tier: SubscriptionTier): string {
  const value = normalizeTier(tier);
  if (value === 'professional') return 'Professional';
  if (value === 'enterprise') return 'Enterprise';
  if (hasCareAdvocacyAccess(tier)) return 'Care & Advocacy Pro';
  return 'Free';
}
