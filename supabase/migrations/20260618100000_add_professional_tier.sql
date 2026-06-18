-- Add 'professional' to the subscription_tier CHECK constraint
-- Required for the KindAuth Prior Auth Engine (Professional tier gate)

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_subscription_tier_check
    CHECK (subscription_tier IN ('free', 'pro', 'advocate', 'professional', 'enterprise'));

COMMENT ON COLUMN public.profiles.subscription_tier IS
  'Free | Pro (Caregiver Pro) | Advocate | Professional | Enterprise; synced from Stripe webhooks';
