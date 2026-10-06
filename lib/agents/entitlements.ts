import { hasAdvocateAccess, hasCaregiverAccess, hasMinPlan, type SubscriptionTier } from '@/lib/pricing-config';

export function ctpOpenQuestionsLimit(tier: SubscriptionTier): number | 'all' {
  if (hasCaregiverAccess(tier)) return 'all';
  return 2;
}

export function ctpHasTrackerAndLetters(tier: SubscriptionTier): boolean {
  return hasCaregiverAccess(tier);
}

export function ctpHasBrandedPdf(tier: SubscriptionTier): boolean {
  return hasMinPlan(tier, 'professional');
}

export function accessProgramLimit(tier: SubscriptionTier): number | 'all' {
  if (hasCaregiverAccess(tier)) return 'all';
  return 3;
}

export function accessHasPackets(tier: SubscriptionTier): boolean {
  return hasCaregiverAccess(tier);
}

export function accessTrackerLevel(tier: SubscriptionTier): 'none' | 'basic' | 'full' | 'multi_patient' {
  if (hasMinPlan(tier, 'professional')) return 'multi_patient';
  if (hasAdvocateAccess(tier)) return 'full';
  if (hasCaregiverAccess(tier)) return 'basic';
  return 'none';
}

export function voiceEntitled(tier: SubscriptionTier): boolean {
  return hasAdvocateAccess(tier);
}

export function isVoiceInviteAccount(userId: string | null | undefined): boolean {
  if (!userId) return false;
  const allow = (process.env.VOICE_BETA_ACCOUNT_IDS ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  return allow.includes(userId);
}
