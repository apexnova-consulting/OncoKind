-- Prior Auth Engine — KindAuth
-- Supports: Prior Authorization Requests, Step Therapy Exceptions, Continued Stay Defense
-- All tables use RLS. Service role is used only in API routes for audit log writes.

-- ── Prior Auth Cases (master record) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.prior_auth_cases (
  id                      UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id                 UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id         UUID          REFERENCES public.organizations(id) ON DELETE SET NULL,
  case_type               TEXT          NOT NULL CHECK (case_type IN ('prior_auth', 'step_therapy', 'continued_stay')),
  status                  TEXT          NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft', 'ready', 'submitted', 'approved', 'denied', 'appealing')),

  -- Patient info (no PHI stored — staff-assigned de-identified references only)
  patient_identifier      TEXT,         -- e.g. "Room 14B" or initials
  facility_name           TEXT,
  facility_npi            TEXT,
  facility_state          TEXT,
  facility_type           TEXT,

  -- Insurance info
  payer_name              TEXT,
  payer_id                TEXT,
  plan_name               TEXT,
  member_id_masked        TEXT,         -- last 4 only
  existing_auth_number    TEXT,

  -- Medication / clinical info
  medication_name         TEXT,
  medication_nda_ndc      TEXT,
  diagnosis_code          TEXT,         -- ICD-10
  diagnosis_description   TEXT,
  prescribing_physician   TEXT,
  clinical_notes          TEXT,
  functional_status       TEXT,
  admission_date          DATE,
  is_urgent               BOOLEAN       DEFAULT false,

  -- AI-generated outputs
  ai_generated_document   TEXT,         -- the full generated letter
  ai_denial_analysis      TEXT,         -- plain-language denial explanation
  step_therapy_drugs_tried TEXT,        -- free-text additional drug history notes
  state_law_citation      TEXT,         -- cited step therapy state law

  -- Outcome tracking
  submitted_at            TIMESTAMPTZ,
  outcome_date            TIMESTAMPTZ,
  outcome_notes           TEXT,

  -- Metadata
  created_at              TIMESTAMPTZ   DEFAULT now() NOT NULL,
  updated_at              TIMESTAMPTZ   DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS prior_auth_cases_user_id_idx     ON public.prior_auth_cases(user_id);
CREATE INDEX IF NOT EXISTS prior_auth_cases_org_id_idx      ON public.prior_auth_cases(organization_id);
CREATE INDEX IF NOT EXISTS prior_auth_cases_status_idx      ON public.prior_auth_cases(status);

ALTER TABLE public.prior_auth_cases ENABLE ROW LEVEL SECURITY;

-- Users see their own cases OR cases belonging to their organization
CREATE POLICY "Users can view their own prior auth cases"
  ON public.prior_auth_cases FOR SELECT
  USING (
    auth.uid() = user_id
    OR organization_id IN (
      SELECT id FROM public.organizations WHERE owner_id = auth.uid()
    )
    OR organization_id IN (
      SELECT organization_id FROM public.enterprise_patient_assignments
      WHERE assigned_by = auth.uid()
    )
  );

CREATE POLICY "Users can insert their own prior auth cases"
  ON public.prior_auth_cases FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own prior auth cases"
  ON public.prior_auth_cases FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own prior auth cases"
  ON public.prior_auth_cases FOR DELETE
  USING (auth.uid() = user_id);


-- ── Prior Auth Denial Uploads (raw text not retained — only hash + extracted reason) ──
CREATE TABLE IF NOT EXISTS public.prior_auth_denial_uploads (
  id                        UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id                   UUID    NOT NULL REFERENCES public.prior_auth_cases(id) ON DELETE CASCADE,
  user_id                   UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  raw_text_hash             TEXT,   -- SHA-256 of uploaded content; content itself is not stored
  denial_reason_extracted   TEXT,   -- AI-extracted plain-language denial reason
  denial_code               TEXT,   -- payer denial code if present (e.g. CO-97)
  created_at                TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.prior_auth_denial_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their denial uploads"
  ON public.prior_auth_denial_uploads FOR ALL
  USING (auth.uid() = user_id);


-- ── Prior Auth Drug Trials (step therapy evidence, normalized) ─────────────────
CREATE TABLE IF NOT EXISTS public.prior_auth_drug_trials (
  id                      UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id                 UUID    NOT NULL REFERENCES public.prior_auth_cases(id) ON DELETE CASCADE,
  drug_name               TEXT    NOT NULL,
  trial_start_date        DATE,
  trial_end_date          DATE,
  reason_discontinued     TEXT,
  was_ineffective         BOOLEAN DEFAULT false,
  caused_adverse_reaction BOOLEAN DEFAULT false,
  contraindicated         BOOLEAN DEFAULT false,
  created_at              TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.prior_auth_drug_trials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage drug trials for their cases"
  ON public.prior_auth_drug_trials FOR ALL
  USING (
    case_id IN (
      SELECT id FROM public.prior_auth_cases WHERE user_id = auth.uid()
    )
  );

COMMENT ON TABLE public.prior_auth_cases IS
  'KindAuth Prior Authorization Engine — master case records. No raw PHI stored.';
COMMENT ON TABLE public.prior_auth_denial_uploads IS
  'Denial letter analysis records. Raw text is never persisted — only SHA-256 hash.';
COMMENT ON TABLE public.prior_auth_drug_trials IS
  'Normalized step therapy drug trial history for step therapy exception letters.';
