-- Optional First 72 Hours progress (feature_first_72_hours)
CREATE TABLE IF NOT EXISTS public.first_72_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  task_id text NOT NULL,
  status text NOT NULL DEFAULT 'open',
  intake jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, task_id)
);

ALTER TABLE public.first_72_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY first_72_progress_self ON public.first_72_progress
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
