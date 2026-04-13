-- OncoKind Wave 7: MFA support + immutable audit chain

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS mfa_factor_id TEXT,
  ADD COLUMN IF NOT EXISTS mfa_enrolled_at TIMESTAMPTZ;

COMMENT ON COLUMN public.profiles.mfa_enabled IS 'Whether the user has enrolled and enabled a TOTP MFA factor.';
COMMENT ON COLUMN public.profiles.mfa_factor_id IS 'Supabase Auth MFA factor id for the active TOTP enrollment.';
COMMENT ON COLUMN public.profiles.mfa_enrolled_at IS 'Timestamp when MFA was successfully verified and enabled.';

ALTER TABLE public.ai_audit_log
  ADD COLUMN IF NOT EXISTS previous_hash TEXT,
  ADD COLUMN IF NOT EXISTS entry_hash TEXT;

UPDATE public.ai_audit_log
SET entry_hash = encode(
  digest(
    coalesce(user_id::text, '') || '|' ||
    event_type || '|' ||
    coalesce(model_id, '') || '|' ||
    entity_type || '|' ||
    coalesce(entity_id, '') || '|' ||
    created_at::text || '|' ||
    details::text,
    'sha256'
  ),
  'hex'
)
WHERE entry_hash IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_ai_audit_log_entry_hash
  ON public.ai_audit_log(entry_hash)
  WHERE entry_hash IS NOT NULL;

ALTER TABLE public.ai_audit_log
  DROP CONSTRAINT IF EXISTS ai_audit_log_event_type_check;

ALTER TABLE public.ai_audit_log
  ADD CONSTRAINT ai_audit_log_event_type_check
  CHECK (
    event_type IN (
      'financial_aid_sync',
      'fund_match_refresh',
      'appeal_letter_generated',
      'lmn_generated',
      'insurance_denial_decoded',
      'mfa_enrolled',
      'mfa_disabled',
      'mfa_verified'
    )
  );

CREATE OR REPLACE FUNCTION public.set_ai_audit_hashes()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  latest_hash TEXT;
BEGIN
  SELECT entry_hash
  INTO latest_hash
  FROM public.ai_audit_log
  ORDER BY created_at DESC, id DESC
  LIMIT 1;

  NEW.previous_hash := latest_hash;
  NEW.entry_hash := encode(
    digest(
      coalesce(NEW.user_id::text, '') || '|' ||
      NEW.event_type || '|' ||
      coalesce(NEW.model_id, '') || '|' ||
      NEW.entity_type || '|' ||
      coalesce(NEW.entity_id, '') || '|' ||
      NEW.created_at::text || '|' ||
      NEW.details::text || '|' ||
      coalesce(latest_hash, ''),
      'sha256'
    ),
    'hex'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_ai_audit_hashes ON public.ai_audit_log;

CREATE TRIGGER set_ai_audit_hashes
  BEFORE INSERT ON public.ai_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION public.set_ai_audit_hashes();

CREATE OR REPLACE FUNCTION public.prevent_ai_audit_mutation()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'ai_audit_log is immutable and append-only';
END;
$$;

DROP TRIGGER IF EXISTS prevent_ai_audit_update ON public.ai_audit_log;
DROP TRIGGER IF EXISTS prevent_ai_audit_delete ON public.ai_audit_log;

CREATE TRIGGER prevent_ai_audit_update
  BEFORE UPDATE ON public.ai_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_ai_audit_mutation();

CREATE TRIGGER prevent_ai_audit_delete
  BEFORE DELETE ON public.ai_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_ai_audit_mutation();
