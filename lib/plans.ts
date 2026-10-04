export const SIGNUP_PLANS = {
  pro: {
    name: 'Caregiver Pro',
    priceLabel: '$39/month or $390/year',
  },
  advocate: {
    name: 'Advocate Plan',
    priceLabel: '$49/month or $490/year',
  },
  professional: {
    name: 'Professional',
    priceLabel: '$999/month',
  },
} as const;

export type SignupPlanKey = keyof typeof SIGNUP_PLANS;

export function parseSignupPlan(value: string | null | undefined): SignupPlanKey | null {
  if (value === 'pro' || value === 'caregiver') return 'pro';
  if (value === 'advocate' || value === 'professional') return value;
  return null;
}
