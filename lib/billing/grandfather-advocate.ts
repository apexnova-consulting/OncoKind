export function grandfatherAdvocateEntitlements(tier: string | null | undefined): {
  keepStripePrice: boolean;
  entitlements: 'caregiver_plus_or_better';
} {
  const value = (tier ?? '').toLowerCase();
  if (value === 'advocate') {
    return { keepStripePrice: true, entitlements: 'caregiver_plus_or_better' };
  }
  return { keepStripePrice: value === 'advocate', entitlements: 'caregiver_plus_or_better' };
}

export const GRANDFATHER_EMAIL_COPY =
  'Your billing stays the same. You keep every feature you already have, and Caregiver Pro now includes Insurance Denial Defense.';
