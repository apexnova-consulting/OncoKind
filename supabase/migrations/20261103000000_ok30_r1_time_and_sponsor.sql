-- OK-02 time logging linked to existing Concierge orders. OK-03 case_id stays nullable until R2.
-- Do not run OK-03 family data migration from this file.

ALTER TABLE public.concierge_cases
  ADD COLUMN IF NOT EXISTS sponsor_id text,
  ADD COLUMN IF NOT EXISTS price_variant text;

CREATE TABLE IF NOT EXISTS public.case_time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid,
  concierge_order_id uuid,
  staff_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  step text NOT NULL,
  minutes integer NOT NULL CHECK (minutes > 0),
  started_at timestamptz,
  ended_at timestamptz,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.case_time_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY case_time_staff_all ON public.case_time_entries
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
  );

COMMENT ON TABLE public.case_time_entries IS 'Families never see time entries.';
