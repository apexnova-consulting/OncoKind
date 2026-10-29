DROP POLICY IF EXISTS org_contracts_org_read ON public.org_sponsorship_contracts;
DROP POLICY IF EXISTS org_counts_org_read ON public.org_dashboard_counts;
DROP POLICY IF EXISTS product_events_self_insert ON public.product_events;
DROP POLICY IF EXISTS follow_up_self ON public.follow_up_visits;
DROP POLICY IF EXISTS family_shares_relative_read ON public.family_item_shares;
DROP POLICY IF EXISTS family_shares_owner ON public.family_item_shares;
DROP POLICY IF EXISTS save_events_self ON public.billing_save_events;
DROP POLICY IF EXISTS pauses_self ON public.subscription_pauses;
DROP POLICY IF EXISTS keep_rollover_self ON public.keep_rollover_consents;

DROP TABLE IF EXISTS public.org_dashboard_counts;
DROP TABLE IF EXISTS public.vault_deletion_log;
DROP TABLE IF EXISTS public.product_events;
DROP TABLE IF EXISTS public.org_sponsored_seats;
DROP TABLE IF EXISTS public.org_sponsorship_contracts;
DROP TABLE IF EXISTS public.follow_up_visits;
DROP TABLE IF EXISTS public.family_item_shares;
DROP TABLE IF EXISTS public.billing_save_events;
DROP TABLE IF EXISTS public.subscription_pauses;
DROP TABLE IF EXISTS public.keep_rollover_consents;

ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS treatment_finished_at,
  DROP COLUMN IF EXISTS vault_consent_at,
  DROP COLUMN IF EXISTS vault_consent_text,
  DROP COLUMN IF EXISTS pause_resumes_at,
  DROP COLUMN IF EXISTS bereavement_at,
  DROP COLUMN IF EXISTS pending_plan,
  DROP COLUMN IF EXISTS plan_ended_at,
  DROP COLUMN IF EXISTS sponsorship_code;
