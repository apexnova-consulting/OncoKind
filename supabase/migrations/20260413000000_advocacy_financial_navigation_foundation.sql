-- OncoKind Wave 5: advocacy & financial navigation foundation
-- Financial aid funds, user matches, sync runs, and audit logging.

CREATE TABLE IF NOT EXISTS public.financial_aid_funds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_slug TEXT NOT NULL CHECK (source_slug IN ('paf', 'healthwell', 'cancercare')),
  external_key TEXT NOT NULL,
  fund_name TEXT NOT NULL,
  current_status TEXT NOT NULL CHECK (current_status IN ('open', 'closed', 'waitlist')),
  eligibility_criteria TEXT NOT NULL,
  deep_link TEXT NOT NULL,
  diagnosis_focus TEXT[] NOT NULL DEFAULT '{}',
  last_scraped_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_changed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(source_slug, external_key)
);

CREATE INDEX IF NOT EXISTS idx_financial_aid_funds_status
  ON public.financial_aid_funds(current_status);
CREATE INDEX IF NOT EXISTS idx_financial_aid_funds_last_scraped
  ON public.financial_aid_funds(last_scraped_at DESC);

ALTER TABLE public.financial_aid_funds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users read financial aid funds"
  ON public.financial_aid_funds FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role manages financial aid funds"
  ON public.financial_aid_funds FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.financial_aid_sync_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  records_seen INTEGER NOT NULL DEFAULT 0,
  records_upserted INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_financial_aid_sync_runs_completed
  ON public.financial_aid_sync_runs(completed_at DESC NULLS LAST);

ALTER TABLE public.financial_aid_sync_runs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users read sync runs"
  ON public.financial_aid_sync_runs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service role manages sync runs"
  ON public.financial_aid_sync_runs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.user_financial_aid_matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  fund_id UUID NOT NULL REFERENCES public.financial_aid_funds(id) ON DELETE CASCADE,
  diagnosis_code TEXT,
  diagnosis_text TEXT,
  match_score NUMERIC(5,4) NOT NULL DEFAULT 0 CHECK (match_score >= 0 AND match_score <= 1),
  matcher_provider TEXT NOT NULL DEFAULT 'keyword-fallback',
  notification_state TEXT NOT NULL DEFAULT 'pending'
    CHECK (notification_state IN ('pending', 'sent', 'dismissed')),
  matched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, fund_id)
);

CREATE INDEX IF NOT EXISTS idx_user_financial_aid_matches_user
  ON public.user_financial_aid_matches(user_id, matched_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_financial_aid_matches_notification
  ON public.user_financial_aid_matches(notification_state);

ALTER TABLE public.user_financial_aid_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own financial aid matches"
  ON public.user_financial_aid_matches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own financial aid matches"
  ON public.user_financial_aid_matches FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role manages financial aid matches"
  ON public.user_financial_aid_matches FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.ai_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (
    event_type IN (
      'financial_aid_sync',
      'fund_match_refresh',
      'appeal_letter_generated',
      'lmn_generated'
    )
  ),
  model_id TEXT,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_audit_log_user
  ON public.ai_audit_log(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_audit_log_event
  ON public.ai_audit_log(event_type, created_at DESC);

ALTER TABLE public.ai_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own audit log"
  ON public.ai_audit_log FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages audit log"
  ON public.ai_audit_log FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
