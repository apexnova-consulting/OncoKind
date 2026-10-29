-- Forward: v3.4 family two-door public product. B2B sales routes parked.
-- Rollback: supabase/rollbacks/20261029000000_v34_family_two_door.sql

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS sponsor_code text;

ALTER TABLE public.concierge_cases
  ADD COLUMN IF NOT EXISTS sponsor_code text;

COMMENT ON COLUMN public.profiles.subscription_tier IS
  'FREE_EXPLORER maps to free. CAREGIVER_PRO maps to pro/caregiver. CONCIERGE_CASE is a per-case purchase, not a subscription_tier.';

INSERT INTO public.concierge_sponsored_codes (code, partner_id, remaining, active)
VALUES ('STAAR-2026', 'staar_foundation', 0, false)
ON CONFLICT (code) DO NOTHING;
