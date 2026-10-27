DROP TABLE IF EXISTS public.concierge_purge_log;
ALTER TABLE public.concierge_cases
  DROP COLUMN IF EXISTS case_ready_at,
  DROP COLUMN IF EXISTS purged_at;
