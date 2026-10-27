-- Forward: Concierge time tracking, facility playbook, sponsored codes, appeal outcomes.
-- Rollback: supabase/rollbacks/20261027200000_board_run2.sql

CREATE TABLE IF NOT EXISTS public.concierge_time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid,
  step text NOT NULL,
  minutes integer NOT NULL DEFAULT 0,
  started_at timestamptz,
  stopped_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.concierge_facility_playbook (
  facility_key text PRIMARY KEY,
  records_channel text NOT NULL,
  accepted_format text NOT NULL,
  typical_turnaround_days integer,
  intake_channel text NOT NULL,
  notes text NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS public.concierge_sponsored_codes (
  code text PRIMARY KEY,
  partner_id text NOT NULL,
  remaining integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS public.denial_appeal_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  insurer text,
  denial_type text,
  submitted_on date,
  deadline_on date,
  outcome text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.public_outcome_aggregates (
  id text PRIMARY KEY,
  n integer NOT NULL DEFAULT 0,
  value_label text NOT NULL,
  method text NOT NULL
);

ALTER TABLE public.concierge_time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concierge_facility_playbook ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concierge_sponsored_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.denial_appeal_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_outcome_aggregates ENABLE ROW LEVEL SECURITY;
