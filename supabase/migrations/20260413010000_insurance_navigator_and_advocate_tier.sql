-- OncoKind Wave 6: insurance navigator, appeals engine, and advocate tier

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_subscription_tier_check
  CHECK (subscription_tier IN ('free', 'pro', 'advocate', 'enterprise'));

CREATE TABLE IF NOT EXISTS public.insurance_navigation_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  source_file_name TEXT,
  denial_reason_code TEXT,
  insurance_name TEXT,
  member_services_phone TEXT,
  appeal_deadline_text TEXT,
  denial_summary_encrypted BYTEA,
  appeal_letter_encrypted BYTEA,
  checklist_encrypted BYTEA,
  model_id TEXT,
  status TEXT NOT NULL DEFAULT 'decoded'
    CHECK (status IN ('decoded', 'appeal_ready')),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_insurance_navigation_cases_user
  ON public.insurance_navigation_cases(user_id, last_updated DESC);

ALTER TABLE public.insurance_navigation_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own insurance cases"
  ON public.insurance_navigation_cases FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own insurance cases"
  ON public.insurance_navigation_cases FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own insurance cases"
  ON public.insurance_navigation_cases FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role manages insurance cases"
  ON public.insurance_navigation_cases FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.set_insurance_navigation_cases_last_updated()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_insurance_navigation_cases_last_updated
  ON public.insurance_navigation_cases;

CREATE TRIGGER set_insurance_navigation_cases_last_updated
  BEFORE UPDATE ON public.insurance_navigation_cases
  FOR EACH ROW
  EXECUTE FUNCTION public.set_insurance_navigation_cases_last_updated();

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
      'insurance_denial_decoded'
    )
  );
