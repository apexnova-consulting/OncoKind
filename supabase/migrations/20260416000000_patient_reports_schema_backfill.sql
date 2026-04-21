-- Backfill patient_reports schema on Production Supabase if older instances
-- missed `20250302000000_oncokind_v1_production.sql`.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.patient_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  biomarkers_json_encrypted BYTEA,
  matched_trials_json_encrypted BYTEA,
  confidence_score NUMERIC(5,4) CHECK (confidence_score >= 0 AND confidence_score <= 1),
  last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.patient_reports
  ADD COLUMN IF NOT EXISTS biomarkers_json_encrypted BYTEA,
  ADD COLUMN IF NOT EXISTS matched_trials_json_encrypted BYTEA,
  ADD COLUMN IF NOT EXISTS confidence_score NUMERIC(5,4),
  ADD COLUMN IF NOT EXISTS last_updated TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'patient_reports_confidence_score_check'
  ) THEN
    ALTER TABLE public.patient_reports
      ADD CONSTRAINT patient_reports_confidence_score_check
      CHECK (confidence_score >= 0 AND confidence_score <= 1);
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_patient_reports_user_id
  ON public.patient_reports(user_id);

CREATE INDEX IF NOT EXISTS idx_patient_reports_last_updated
  ON public.patient_reports(last_updated DESC);

COMMENT ON TABLE public.patient_reports IS 'Oncology report insights; NO raw pathology text stored. Encrypted JSON only.';
COMMENT ON COLUMN public.patient_reports.biomarkers_json_encrypted IS 'AES-256 encrypted: { biomarkers, tnm_stage, histology }';
COMMENT ON COLUMN public.patient_reports.matched_trials_json_encrypted IS 'AES-256 encrypted: { matched_trials, big_idea, doctor_conversation_starter }';

ALTER TABLE public.patient_reports ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'patient_reports'
      AND policyname = 'Users read own patient reports'
  ) THEN
    CREATE POLICY "Users read own patient reports"
      ON public.patient_reports FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'patient_reports'
      AND policyname = 'Users insert own patient reports'
  ) THEN
    CREATE POLICY "Users insert own patient reports"
      ON public.patient_reports FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'patient_reports'
      AND policyname = 'Users update own patient reports'
  ) THEN
    CREATE POLICY "Users update own patient reports"
      ON public.patient_reports FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'patient_reports'
      AND policyname = 'Users delete own patient reports'
  ) THEN
    CREATE POLICY "Users delete own patient reports"
      ON public.patient_reports FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'patient_reports'
      AND policyname = 'Service role full access to patient_reports'
  ) THEN
    CREATE POLICY "Service role full access to patient_reports"
      ON public.patient_reports FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END
$$;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.patient_reports TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.patient_reports TO service_role;

CREATE OR REPLACE FUNCTION public.pgrst_watch() RETURNS event_trigger AS $$
BEGIN
  NOTIFY pgrst, 'reload schema';
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_event_trigger
    WHERE evtname = 'pgrst_watch'
  ) THEN
    CREATE EVENT TRIGGER pgrst_watch
      ON ddl_command_end
      EXECUTE PROCEDURE public.pgrst_watch();
  END IF;
END
$$;

NOTIFY pgrst, 'reload schema';
