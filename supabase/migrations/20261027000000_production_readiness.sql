-- Forward: Concierge retention timestamps for the 90-day purge job.
-- Rollback: supabase/rollbacks/20261027000000_production_readiness.sql

ALTER TABLE public.concierge_cases
  ADD COLUMN IF NOT EXISTS case_ready_at timestamptz,
  ADD COLUMN IF NOT EXISTS purged_at timestamptz;

CREATE TABLE IF NOT EXISTS public.concierge_purge_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid,
  purged_at timestamptz NOT NULL DEFAULT now(),
  reason text NOT NULL DEFAULT 'retention_window'
);

ALTER TABLE public.concierge_purge_log ENABLE ROW LEVEL SECURITY;
