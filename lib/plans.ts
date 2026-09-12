export const SIGNUP_PLANS = {
  pro: {
    name: 'Caregiver Pro',
    priceLabel: '$39/month',
  },
  advocate: {
    name: 'Advocate Plan',
    priceLabel: '$49/month',
  },
  professional: {
    name: 'Professional',
    priceLabel: '$999/month',
  },
} as const;

export type SignupPlanKey = keyof typeof SIGNUP_PLANS;

export function parseSignupPlan(value: string | null | undefined): SignupPlanKey | null {
  if (value === 'pro' || value === 'advocate' || value === 'professional') {
    return value;
  }
  return null;
}
