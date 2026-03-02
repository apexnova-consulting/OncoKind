-- OncoKind v1.0 — Production Schema
-- HIPAA-conscious: encrypted JSON fields via pgcrypto AES-256
-- RLS enforced on ALL tables; Enterprise advocate-patient access

-- Extensions (pgcrypto already in 20250227000000)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- 1. PROFILES — Add subscription_tier, encrypted settings
-- =============================================================================
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'free'
    CHECK (subscription_tier IN ('free', 'pro', 'enterprise'));

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS settings_encrypted BYTEA;

COMMENT ON COLUMN public.profiles.subscription_tier IS 'Free | Pro | Enterprise; synced from Stripe webhooks';
COMMENT ON COLUMN public.profiles.settings_encrypted IS 'AES-256 encrypted JSON preferences; decrypt with ENCRYPTION_KEY';

-- Backfill subscription_tier from subscription_status for existing rows
UPDATE public.profiles
SET subscription_tier = CASE
  WHEN subscription_status = 'pro' THEN 'pro'
  WHEN subscription_status IN ('cancelled', 'past_due') THEN 'free'
  ELSE COALESCE(subscription_tier, 'free')
END;

-- =============================================================================
-- 2. PATIENT_REPORTS — Zero PHI retention; encrypted structured JSON only
-- =============================================================================
CREATE TABLE public.patient_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  -- Encrypted via app-layer AES-256-GCM; key from ENCRYPTION_KEY env
  biomarkers_json_encrypted BYTEA,
  matched_trials_json_encrypted BYTEA,
  confidence_score NUMERIC(5,4) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_patient_reports_user_id ON public.patient_reports(user_id);
CREATE INDEX idx_patient_reports_last_updated ON public.patient_reports(last_updated DESC);

COMMENT ON TABLE public.patient_reports IS 'Oncology report insights; NO raw pathology text stored. Encrypted JSON only.';
COMMENT ON COLUMN public.patient_reports.biomarkers_json_encrypted IS 'AES-256 encrypted: { biomarkers, tnm_stage, histology }';
COMMENT ON COLUMN public.patient_reports.matched_trials_json_encrypted IS 'AES-256 encrypted: { matched_trials, big_idea, doctor_conversation_starter }';

-- =============================================================================
-- 3. ENTERPRISE: Advocate–Patient Assignments
-- =============================================================================
CREATE TABLE public.enterprise_patient_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  advocate_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(advocate_id, patient_user_id)
);

CREATE INDEX idx_enterprise_assignments_advocate ON public.enterprise_patient_assignments(advocate_id);
CREATE INDEX idx_enterprise_assignments_patient ON public.enterprise_patient_assignments(patient_user_id);

COMMENT ON TABLE public.enterprise_patient_assignments IS 'Enterprise advocates can access assigned patients reports';

-- =============================================================================
-- 4. RLS — patient_reports
-- =============================================================================
ALTER TABLE public.patient_reports ENABLE ROW LEVEL SECURITY;

-- Users can read their own reports
CREATE POLICY "Users read own patient reports"
  ON public.patient_reports FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.enterprise_patient_assignments epa
      JOIN public.profiles p ON p.id = epa.advocate_id
      WHERE epa.patient_user_id = patient_reports.user_id
        AND epa.advocate_id = auth.uid()
        AND p.subscription_tier = 'enterprise'
    )
  );

-- Users can insert their own reports
CREATE POLICY "Users insert own patient reports"
  ON public.patient_reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reports
CREATE POLICY "Users update own patient reports"
  ON public.patient_reports FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.enterprise_patient_assignments epa
      JOIN public.profiles p ON p.id = epa.advocate_id
      WHERE epa.patient_user_id = patient_reports.user_id
        AND epa.advocate_id = auth.uid()
        AND p.subscription_tier = 'enterprise'
    )
  )
  WITH CHECK (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM public.enterprise_patient_assignments epa
      JOIN public.profiles p ON p.id = epa.advocate_id
      WHERE epa.patient_user_id = patient_reports.user_id
        AND epa.advocate_id = auth.uid()
        AND p.subscription_tier = 'enterprise'
    )
  );

-- Users can delete their own reports only (not via enterprise)
CREATE POLICY "Users delete own patient reports"
  ON public.patient_reports FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Service role for Server Actions / webhooks
CREATE POLICY "Service role full access to patient_reports"
  ON public.patient_reports FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 5. RLS — enterprise_patient_assignments
-- =============================================================================
ALTER TABLE public.enterprise_patient_assignments ENABLE ROW LEVEL SECURITY;

-- Enterprise advocates can read their assignments
CREATE POLICY "Enterprise advocates read own assignments"
  ON public.enterprise_patient_assignments FOR SELECT
  TO authenticated
  USING (
    advocate_id = auth.uid()
    OR patient_user_id = auth.uid()
  );

-- Only service role can manage assignments (admin workflow)
CREATE POLICY "Service role manages enterprise assignments"
  ON public.enterprise_patient_assignments FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- =============================================================================
-- 6. HELPERS — last_updated trigger for patient_reports
-- =============================================================================
CREATE OR REPLACE FUNCTION public.set_patient_reports_last_updated()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.last_updated = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_patient_reports_last_updated
  BEFORE UPDATE ON public.patient_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.set_patient_reports_last_updated();

-- =============================================================================
-- 7. HIPAA — Remove raw pathology text storage (ZERO RETENTION)
-- =============================================================================
ALTER TABLE public.medical_reports DROP COLUMN IF EXISTS raw_extracted_text;
