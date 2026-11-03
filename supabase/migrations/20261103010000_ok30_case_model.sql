-- OK-03 unified case model. DO NOT APPLY IN PRODUCTION until staging rehearsal
-- passes and the founder confirms in writing. Take a full backup first.

CREATE TABLE IF NOT EXISTS public.cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_label text,
  diagnosis_key text,
  mode text NOT NULL DEFAULT 'diy',
  status text NOT NULL DEFAULT 'open',
  center_id text,
  concierge_order_id uuid,
  sponsor_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.case_artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  type text NOT NULL,
  subtype text,
  version integer NOT NULL DEFAULT 1,
  content_json jsonb,
  status text NOT NULL DEFAULT 'draft',
  created_by_actor text NOT NULL,
  approved_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.case_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  type text NOT NULL,
  source_artifact_id uuid,
  facility_name text,
  assignee_actor text,
  status text NOT NULL DEFAULT 'todo',
  due_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.case_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  actor text,
  family_visible boolean NOT NULL DEFAULT false,
  payload_json jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.case_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL,
  UNIQUE (case_id, user_id)
);

ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY cases_owner ON public.cases
  FOR ALL USING (owner_user_id = auth.uid()) WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY artifacts_owner ON public.case_artifacts
  FOR ALL USING (
    case_id IN (SELECT id FROM public.cases WHERE owner_user_id = auth.uid())
  );

CREATE POLICY tasks_owner ON public.case_tasks
  FOR ALL USING (
    case_id IN (SELECT id FROM public.cases WHERE owner_user_id = auth.uid())
  );

CREATE POLICY events_family_visible ON public.case_events
  FOR SELECT USING (
    family_visible = true
    AND case_id IN (SELECT id FROM public.cases WHERE owner_user_id = auth.uid())
  );

CREATE POLICY members_self ON public.case_members
  FOR SELECT USING (user_id = auth.uid() OR case_id IN (SELECT id FROM public.cases WHERE owner_user_id = auth.uid()));
