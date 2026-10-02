export const SIGNUP_PLANS = {
  pro: {
    name: 'Care & Advocacy Pro',
    priceLabel: '$29/month or $199/year',
  },
  advocate: {
    name: 'Care & Advocacy Pro',
    priceLabel: '$29/month or $199/year',
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
