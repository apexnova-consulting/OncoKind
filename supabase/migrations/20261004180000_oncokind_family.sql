-- Forward: OncoKind Family (feature_oncokind_family)
-- Rollback: supabase/rollbacks/20261004180000_oncokind_family.sql

CREATE TABLE IF NOT EXISTS public.families (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.family_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  claimed_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  relationship text,
  lineage text,
  living_status text,
  cancer_type text,
  diagnosis_age text,
  birth_year text,
  approx_age text,
  age_at_death text,
  genetic_testing_status text,
  genetic_testing_note_encrypted bytea,
  sex_assigned_at_birth text,
  gender_identity text,
  hidden boolean NOT NULL DEFAULT false,
  health_details_encrypted bytea,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  member_id uuid REFERENCES public.family_members(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  channel text,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.consents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  statement text NOT NULL,
  granted boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id uuid REFERENCES public.families(id) ON DELETE CASCADE,
  actor_user_id uuid,
  action text NOT NULL,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY families_owner ON public.families
  FOR ALL USING (owner_user_id = auth.uid())
  WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY family_members_visible ON public.family_members
  FOR SELECT USING (
    claimed_by = auth.uid()
    OR (
      hidden = false
      AND (
        created_by = auth.uid()
        OR family_id IN (SELECT id FROM public.families WHERE owner_user_id = auth.uid())
      )
    )
  );

CREATE POLICY family_members_owner_write ON public.family_members
  FOR INSERT WITH CHECK (
    family_id IN (SELECT id FROM public.families WHERE owner_user_id = auth.uid())
  );

CREATE POLICY family_members_self_update ON public.family_members
  FOR UPDATE USING (
    claimed_by = auth.uid()
    OR created_by = auth.uid()
    OR family_id IN (SELECT id FROM public.families WHERE owner_user_id = auth.uid())
  );

CREATE POLICY family_members_self_delete ON public.family_members
  FOR DELETE USING (
    claimed_by = auth.uid()
    OR family_id IN (SELECT id FROM public.families WHERE owner_user_id = auth.uid())
  );

CREATE POLICY invites_owner ON public.invites
  FOR ALL USING (
    family_id IN (SELECT id FROM public.families WHERE owner_user_id = auth.uid())
  )
  WITH CHECK (
    family_id IN (SELECT id FROM public.families WHERE owner_user_id = auth.uid())
  );

CREATE POLICY consents_self ON public.consents
  FOR ALL USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY audit_log_insert ON public.audit_log
  FOR INSERT WITH CHECK (
    actor_user_id = auth.uid()
    AND family_id IN (SELECT id FROM public.families WHERE owner_user_id = auth.uid())
  );

CREATE POLICY audit_log_owner_read ON public.audit_log
  FOR SELECT USING (
    family_id IN (SELECT id FROM public.families WHERE owner_user_id = auth.uid())
  );
