-- After the first 90 days, Keep, vault, save flow, sponsorship.
-- Rollback: supabase/rollbacks/20261029120000_after_90_keep.sql

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS treatment_finished_at timestamptz,
  ADD COLUMN IF NOT EXISTS vault_consent_at timestamptz,
  ADD COLUMN IF NOT EXISTS vault_consent_text text,
  ADD COLUMN IF NOT EXISTS pause_resumes_at timestamptz,
  ADD COLUMN IF NOT EXISTS bereavement_at timestamptz,
  ADD COLUMN IF NOT EXISTS pending_plan text,
  ADD COLUMN IF NOT EXISTS plan_ended_at timestamptz,
  ADD COLUMN IF NOT EXISTS sponsorship_code text,
  ADD COLUMN IF NOT EXISTS organization_id uuid;

CREATE TABLE IF NOT EXISTS public.keep_rollover_consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ticked boolean NOT NULL DEFAULT false,
  text_shown text NOT NULL,
  opted_out_at timestamptz,
  opt_out_token text UNIQUE,
  first_keep_charge_on date,
  reminder_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.subscription_pauses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  months integer NOT NULL CHECK (months IN (1, 2, 3)),
  resumes_at timestamptz NOT NULL,
  reminder_sent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.billing_save_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  choice text NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.family_item_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  relative_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  item_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.follow_up_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visit_on date NOT NULL,
  kind text NOT NULL DEFAULT 'visit',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.org_sponsorship_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid NOT NULL,
  partner_code text NOT NULL UNIQUE,
  seat_plan text NOT NULL DEFAULT 'keep',
  seats_purchased integer NOT NULL DEFAULT 0,
  concierge_cases_purchased integer NOT NULL DEFAULT 0,
  yearly_seat_cents integer NOT NULL,
  concierge_case_cents integer NOT NULL,
  starts_on date NOT NULL,
  ends_on date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.org_sponsored_seats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid NOT NULL REFERENCES public.org_sponsorship_contracts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  activated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (contract_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.product_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  event text NOT NULL,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.vault_deletion_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  deleted_at timestamptz NOT NULL DEFAULT now(),
  reason text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.org_dashboard_counts (
  organization_id uuid PRIMARY KEY,
  seats_used integer NOT NULL DEFAULT 0,
  seats_purchased integer NOT NULL DEFAULT 0,
  active_families integer NOT NULL DEFAULT 0,
  concierge_by_status jsonb NOT NULL DEFAULT '{}'::jsonb,
  case_ready_families integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.keep_rollover_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_pauses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_save_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_item_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_sponsorship_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_sponsored_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vault_deletion_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.org_dashboard_counts ENABLE ROW LEVEL SECURITY;

CREATE POLICY keep_rollover_self ON public.keep_rollover_consents
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY pauses_self ON public.subscription_pauses
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY save_events_self ON public.billing_save_events
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY family_shares_owner ON public.family_item_shares
  FOR ALL USING (owner_user_id = auth.uid()) WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY family_shares_relative_read ON public.family_item_shares
  FOR SELECT USING (relative_user_id = auth.uid());

CREATE POLICY follow_up_self ON public.follow_up_visits
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY product_events_self_insert ON public.product_events
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY org_counts_org_read ON public.org_dashboard_counts
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY org_contracts_org_read ON public.org_sponsorship_contracts
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.profiles WHERE id = auth.uid()
    )
  );

REVOKE ALL ON public.patient_reports FROM PUBLIC;
REVOKE ALL ON public.family_members FROM PUBLIC;
REVOKE ALL ON public.concierge_cases FROM PUBLIC;

COMMENT ON TABLE public.org_dashboard_counts IS
  'Organization role may read counts only. Never names, diagnoses, or documents.';
