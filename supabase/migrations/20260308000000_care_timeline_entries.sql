-- OncoKind Wave 4: persistent care timeline entries

CREATE TABLE IF NOT EXISTS public.care_timeline_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  milestone_type TEXT NOT NULL CHECK (
    milestone_type IN (
      'diagnosis',
      'lab_result',
      'treatment_start',
      'clinical_trial_enrollment',
      'follow_up_appointment',
      'new_report_uploaded',
      'custom'
    )
  ),
  title TEXT NOT NULL,
  notes TEXT,
  report_summary TEXT,
  prep_sheet_link TEXT,
  occurred_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_care_timeline_entries_user_id
  ON public.care_timeline_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_care_timeline_entries_occurred_at
  ON public.care_timeline_entries(occurred_at DESC);

ALTER TABLE public.care_timeline_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own care timeline entries"
  ON public.care_timeline_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users insert own care timeline entries"
  ON public.care_timeline_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own care timeline entries"
  ON public.care_timeline_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users delete own care timeline entries"
  ON public.care_timeline_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to care timeline entries"
  ON public.care_timeline_entries FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
