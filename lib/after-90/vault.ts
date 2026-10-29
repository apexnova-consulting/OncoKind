import { VAULT_RETENTION_DAYS_AFTER_PLAN_END } from '@/lib/after-90/config';

export function vaultAllowed(input: {
  consentAt: string | Date | null | undefined;
  tier: string | null | undefined;
}): boolean {
  if (!input.consentAt) return false;
  const tier = (input.tier ?? '').toLowerCase();
  return tier === 'keep' || tier === 'pro' || tier === 'caregiver' || tier === 'advocate';
}

export function vaultDeleteOn(planEndedAt: Date): Date {
  const next = new Date(planEndedAt);
  next.setUTCDate(next.getUTCDate() + VAULT_RETENTION_DAYS_AFTER_PLAN_END);
  return next;
}

export function shouldPurgeVault(input: {
  consentAt: string | Date | null | undefined;
  tier: string | null | undefined;
  planEndedAt?: string | Date | null;
  now?: Date;
}): boolean {
  if (!input.consentAt) return true;
  if (vaultAllowed({ consentAt: input.consentAt, tier: input.tier })) return false;
  if (!input.planEndedAt) return false;
  const now = input.now ?? new Date();
  return now.getTime() >= vaultDeleteOn(new Date(input.planEndedAt)).getTime();
}

export const VAULT_CONSENT_TEXT =
  'I want OncoKind to keep uploaded reports and Concierge records in my Records vault while I have Caregiver Pro or Keep. I understand that without this, raw Tools report text is deleted after processing and Concierge records are deleted 90 days after Case Ready.';
