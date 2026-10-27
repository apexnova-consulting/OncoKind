import { isFamilyTierMerged } from '@/lib/board-run2';
import { FAMILY_PLUS_PLAN_NAME } from '@/lib/board-run2';

export const SIGNUP_PLANS = {
  pro: {
    name: 'Caregiver Pro',
    priceLabel: '$39/month or $390/year',
  },
  advocate: {
    name: FAMILY_PLUS_PLAN_NAME,
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
  if (value === 'advocate') return isFamilyTierMerged() ? 'pro' : 'advocate';
  if (value === 'professional') return value;
  return null;
}
