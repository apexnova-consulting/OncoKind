-- Forward: Concierge case platform. Purchase and ops flags stay off until Section 12 gates.
-- Rollback: supabase/rollbacks/20261025000000_concierge.sql

CREATE TABLE IF NOT EXISTS public.concierge_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_to uuid,
  state text NOT NULL DEFAULT 'draft',
  substate text,
  center_id text,
  price_shown_cents integer NOT NULL,
  sponsor_code text,
  intake_encrypted bytea,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.concierge_case_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.concierge_cases(id) ON DELETE CASCADE,
  from_state text,
  to_state text NOT NULL,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.concierge_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.concierge_cases(id) ON DELETE CASCADE,
  task_type text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  expected_minutes integer,
  evidence_required boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.task_time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id uuid NOT NULL REFERENCES public.concierge_tasks(id) ON DELETE CASCADE,
  actor_id uuid NOT NULL,
  minutes integer NOT NULL,
  reason_code text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sop_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  task_type text NOT NULL,
  payload jsonb NOT NULL,
  version text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.facilities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id text NOT NULL UNIQUE,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'unverified',
  last_verified_on date,
  verified_by text,
  next_verification_due date
);

CREATE TABLE IF NOT EXISTS public.facility_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  facility_id text NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id text NOT NULL UNIQUE,
  payload jsonb NOT NULL,
  status text NOT NULL DEFAULT 'unverified',
  last_verified_on date,
  verified_by text,
  next_verification_due date
);

CREATE TABLE IF NOT EXISTS public.center_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  center_id text NOT NULL,
  payload jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.authorizations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.concierge_cases(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  signed_at timestamptz,
  ip text,
  device text,
  expires_at timestamptz,
  revoked_at timestamptz,
  pdf_encrypted bytea
);

CREATE TABLE IF NOT EXISTS public.record_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.concierge_cases(id) ON DELETE CASCADE,
  facility_id text,
  status text NOT NULL DEFAULT 'not_sent',
  channel text,
  destination text,
  fee_cents integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.request_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id uuid NOT NULL REFERENCES public.record_requests(id) ON DELETE CASCADE,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.packets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.concierge_cases(id) ON DELETE CASCADE,
  page_count integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.concierge_cases(id) ON DELETE CASCADE,
  channel text,
  proof_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.concierge_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.concierge_cases(id) ON DELETE CASCADE,
  direction text NOT NULL,
  body_encrypted bytea NOT NULL,
  flagged_clinical boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.macros (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  macro_id text NOT NULL UNIQUE,
  body text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.qa_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.concierge_cases(id) ON DELETE CASCADE,
  passed boolean,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.concierge_cases(id) ON DELETE CASCADE,
  csat integer,
  recommend integer,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sponsor_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  partner_name text NOT NULL,
  rate_cents integer NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.case_pricing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.concierge_cases(id) ON DELETE CASCADE,
  price_shown_cents integer NOT NULL,
  cohort_week text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.coordinator_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.concierge_access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  case_id uuid,
  action text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.concierge_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concierge_case_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concierge_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authorizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.record_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concierge_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concierge_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;

CREATE POLICY concierge_cases_self ON public.concierge_cases FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY authorizations_self ON public.authorizations FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY surveys_via_case ON public.surveys FOR ALL
  USING (case_id IN (SELECT id FROM public.concierge_cases WHERE user_id = auth.uid()))
  WITH CHECK (case_id IN (SELECT id FROM public.concierge_cases WHERE user_id = auth.uid()));
CREATE POLICY messages_via_case ON public.concierge_messages FOR ALL
  USING (case_id IN (SELECT id FROM public.concierge_cases WHERE user_id = auth.uid()))
  WITH CHECK (case_id IN (SELECT id FROM public.concierge_cases WHERE user_id = auth.uid()));
CREATE POLICY requests_via_case ON public.record_requests FOR ALL
  USING (case_id IN (SELECT id FROM public.concierge_cases WHERE user_id = auth.uid()))
  WITH CHECK (case_id IN (SELECT id FROM public.concierge_cases WHERE user_id = auth.uid()));
CREATE POLICY centers_read ON public.centers FOR SELECT USING (true);
CREATE POLICY facilities_read ON public.facilities FOR SELECT USING (true);
