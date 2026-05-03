-- OncoKind Production Update Guide foundation:
-- organizations, community, prep appointments + check-ins, and Quiet Room storage

CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#0d1b2a',
  secondary_color TEXT NOT NULL DEFAULT '#1b2d42',
  accent_color TEXT NOT NULL DEFAULT '#e8a838',
  custom_domain TEXT UNIQUE,
  footer_disclaimer TEXT,
  hipaa_baa_signed_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT organizations_active_requires_baa
    CHECK (is_active = false OR hipaa_baa_signed_at IS NOT NULL)
);

CREATE INDEX IF NOT EXISTS idx_organizations_slug ON public.organizations(slug);
CREATE INDEX IF NOT EXISTS idx_organizations_custom_domain ON public.organizations(custom_domain);

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'organizations'
      AND policyname = 'Public read active organizations'
  ) THEN
    CREATE POLICY "Public read active organizations"
      ON public.organizations FOR SELECT
      TO anon, authenticated
      USING (is_active = true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'organizations'
      AND policyname = 'Service role full access to organizations'
  ) THEN
    CREATE POLICY "Service role full access to organizations"
      ON public.organizations FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_organization_id ON public.profiles(organization_id);

ALTER TABLE public.patient_reports
  ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_patient_reports_organization_id ON public.patient_reports(organization_id);

CREATE TABLE IF NOT EXISTS public.prep_sheet_appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  report_id UUID REFERENCES public.patient_reports(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  report_title TEXT,
  appointment_at TIMESTAMPTZ NOT NULL,
  notes TEXT,
  follow_up_banner_dismissed_at TIMESTAMPTZ,
  check_in_email_sent_at TIMESTAMPTZ,
  check_in_due_at TIMESTAMPTZ GENERATED ALWAYS AS (appointment_at + interval '24 hours') STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_prep_sheet_appointments_user_id
  ON public.prep_sheet_appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_prep_sheet_appointments_due_at
  ON public.prep_sheet_appointments(check_in_due_at);

ALTER TABLE public.prep_sheet_appointments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'prep_sheet_appointments'
      AND policyname = 'Users read own prep appointments'
  ) THEN
    CREATE POLICY "Users read own prep appointments"
      ON public.prep_sheet_appointments FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'prep_sheet_appointments'
      AND policyname = 'Users insert own prep appointments'
  ) THEN
    CREATE POLICY "Users insert own prep appointments"
      ON public.prep_sheet_appointments FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'prep_sheet_appointments'
      AND policyname = 'Users update own prep appointments'
  ) THEN
    CREATE POLICY "Users update own prep appointments"
      ON public.prep_sheet_appointments FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'prep_sheet_appointments'
      AND policyname = 'Service role full access to prep appointments'
  ) THEN
    CREATE POLICY "Service role full access to prep appointments"
      ON public.prep_sheet_appointments FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.appointment_check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  appointment_id UUID NOT NULL UNIQUE REFERENCES public.prep_sheet_appointments(id) ON DELETE CASCADE,
  prep_sheet_id UUID REFERENCES public.prep_sheet_appointments(id) ON DELETE SET NULL,
  preparedness_score SMALLINT NOT NULL CHECK (preparedness_score BETWEEN 1 AND 4),
  prep_sheet_helped TEXT NOT NULL CHECK (prep_sheet_helped IN ('yes', 'somewhat', 'no', 'not_used')),
  follow_up_question TEXT,
  follow_up_explanation TEXT,
  discussed_trials TEXT CHECK (discussed_trials IN ('yes', 'forgot', 'not_relevant', 'not_available')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_appointment_check_ins_user_id
  ON public.appointment_check_ins(user_id);

ALTER TABLE public.appointment_check_ins ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'appointment_check_ins'
      AND policyname = 'Users read own appointment check-ins'
  ) THEN
    CREATE POLICY "Users read own appointment check-ins"
      ON public.appointment_check_ins FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'appointment_check_ins'
      AND policyname = 'Users insert own appointment check-ins'
  ) THEN
    CREATE POLICY "Users insert own appointment check-ins"
      ON public.appointment_check_ins FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'appointment_check_ins'
      AND policyname = 'Users update own appointment check-ins'
  ) THEN
    CREATE POLICY "Users update own appointment check-ins"
      ON public.appointment_check_ins FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'appointment_check_ins'
      AND policyname = 'Service role full access to appointment check-ins'
  ) THEN
    CREATE POLICY "Service role full access to appointment check-ins"
      ON public.appointment_check_ins FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.community_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_slug TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  is_locked BOOLEAN NOT NULL DEFAULT false,
  reply_count INTEGER NOT NULL DEFAULT 0,
  view_count INTEGER NOT NULL DEFAULT 0,
  is_flagged BOOLEAN NOT NULL DEFAULT false,
  is_moderated BOOLEAN NOT NULL DEFAULT false,
  moderation_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (moderation_status IN ('pending', 'approved', 'rejected'))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_community_threads_category_slug_slug
  ON public.community_threads(category_slug, slug);
CREATE INDEX IF NOT EXISTS idx_community_threads_category_created
  ON public.community_threads(category_slug, is_pinned DESC, created_at DESC);

ALTER TABLE public.community_threads ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_threads'
      AND policyname = 'Public read approved community threads'
  ) THEN
    CREATE POLICY "Public read approved community threads"
      ON public.community_threads FOR SELECT
      TO anon, authenticated
      USING (
        moderation_status = 'approved'
        OR auth.uid() = author_id
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_threads'
      AND policyname = 'Users insert own community threads'
  ) THEN
    CREATE POLICY "Users insert own community threads"
      ON public.community_threads FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = author_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_threads'
      AND policyname = 'Service role full access to community threads'
  ) THEN
    CREATE POLICY "Service role full access to community threads"
      ON public.community_threads FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.community_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES public.community_threads(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_display_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  heart_count INTEGER NOT NULL DEFAULT 0,
  is_flagged BOOLEAN NOT NULL DEFAULT false,
  is_moderated BOOLEAN NOT NULL DEFAULT false,
  moderation_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (moderation_status IN ('pending', 'approved', 'rejected'))
);

CREATE INDEX IF NOT EXISTS idx_community_replies_thread_created
  ON public.community_replies(thread_id, created_at ASC);

ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_replies'
      AND policyname = 'Public read approved community replies'
  ) THEN
    CREATE POLICY "Public read approved community replies"
      ON public.community_replies FOR SELECT
      TO anon, authenticated
      USING (
        moderation_status = 'approved'
        OR auth.uid() = author_id
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_replies'
      AND policyname = 'Users insert own community replies'
  ) THEN
    CREATE POLICY "Users insert own community replies"
      ON public.community_replies FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = author_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_replies'
      AND policyname = 'Service role full access to community replies'
  ) THEN
    CREATE POLICY "Service role full access to community replies"
      ON public.community_replies FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.community_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  thread_id UUID REFERENCES public.community_threads(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.community_replies(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL DEFAULT 'heart' CHECK (reaction_type = 'heart'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT community_reactions_target_check
    CHECK (
      (thread_id IS NOT NULL AND reply_id IS NULL)
      OR (thread_id IS NULL AND reply_id IS NOT NULL)
    )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_community_reactions_unique_thread
  ON public.community_reactions(user_id, thread_id)
  WHERE thread_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_community_reactions_unique_reply
  ON public.community_reactions(user_id, reply_id)
  WHERE reply_id IS NOT NULL;

ALTER TABLE public.community_reactions ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_reactions'
      AND policyname = 'Public read community reactions'
  ) THEN
    CREATE POLICY "Public read community reactions"
      ON public.community_reactions FOR SELECT
      TO anon, authenticated
      USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_reactions'
      AND policyname = 'Users manage own community reactions'
  ) THEN
    CREATE POLICY "Users manage own community reactions"
      ON public.community_reactions FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_reactions'
      AND policyname = 'Service role full access to community reactions'
  ) THEN
    CREATE POLICY "Service role full access to community reactions"
      ON public.community_reactions FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.community_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  thread_id UUID REFERENCES public.community_threads(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.community_replies(id) ON DELETE CASCADE,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT community_flags_target_check
    CHECK (
      (thread_id IS NOT NULL AND reply_id IS NULL)
      OR (thread_id IS NULL AND reply_id IS NOT NULL)
    )
);

CREATE INDEX IF NOT EXISTS idx_community_flags_status_created
  ON public.community_flags(status, created_at DESC);

ALTER TABLE public.community_flags ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_flags'
      AND policyname = 'Users insert own community flags'
  ) THEN
    CREATE POLICY "Users insert own community flags"
      ON public.community_flags FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = reporter_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'community_flags'
      AND policyname = 'Service role full access to community flags'
  ) THEN
    CREATE POLICY "Service role full access to community flags"
      ON public.community_flags FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.caregiver_mood_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mood TEXT NOT NULL CHECK (mood IN ('exhausted', 'anxious', 'sad', 'numb', 'okay', 'grateful', 'strong')),
  entry_date DATE NOT NULL DEFAULT (timezone('utc', now())::date),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, entry_date)
);

CREATE INDEX IF NOT EXISTS idx_caregiver_mood_entries_user_date
  ON public.caregiver_mood_entries(user_id, entry_date DESC);

ALTER TABLE public.caregiver_mood_entries ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'caregiver_mood_entries'
      AND policyname = 'Users manage own caregiver moods'
  ) THEN
    CREATE POLICY "Users manage own caregiver moods"
      ON public.caregiver_mood_entries FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'caregiver_mood_entries'
      AND policyname = 'Service role full access to caregiver moods'
  ) THEN
    CREATE POLICY "Service role full access to caregiver moods"
      ON public.caregiver_mood_entries FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.quiet_room_journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  entry_encrypted BYTEA NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_quiet_room_journal_entries_user_created
  ON public.quiet_room_journal_entries(user_id, created_at DESC);

ALTER TABLE public.quiet_room_journal_entries ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'quiet_room_journal_entries'
      AND policyname = 'Users manage own quiet room journal entries'
  ) THEN
    CREATE POLICY "Users manage own quiet room journal entries"
      ON public.quiet_room_journal_entries FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'quiet_room_journal_entries'
      AND policyname = 'Service role full access to quiet room journal entries'
  ) THEN
    CREATE POLICY "Service role full access to quiet room journal entries"
      ON public.quiet_room_journal_entries FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF to_regclass('public.organizations') IS NOT NULL THEN
    DROP TRIGGER IF EXISTS set_organizations_updated_at ON public.organizations;
    CREATE TRIGGER set_organizations_updated_at
      BEFORE UPDATE ON public.organizations
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF to_regclass('public.prep_sheet_appointments') IS NOT NULL THEN
    DROP TRIGGER IF EXISTS set_prep_sheet_appointments_updated_at ON public.prep_sheet_appointments;
    CREATE TRIGGER set_prep_sheet_appointments_updated_at
      BEFORE UPDATE ON public.prep_sheet_appointments
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF to_regclass('public.community_threads') IS NOT NULL THEN
    DROP TRIGGER IF EXISTS set_community_threads_updated_at ON public.community_threads;
    CREATE TRIGGER set_community_threads_updated_at
      BEFORE UPDATE ON public.community_threads
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at();
  END IF;

  IF to_regclass('public.community_replies') IS NOT NULL THEN
    DROP TRIGGER IF EXISTS set_community_replies_updated_at ON public.community_replies;
    CREATE TRIGGER set_community_replies_updated_at
      BEFORE UPDATE ON public.community_replies
      FOR EACH ROW
      EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;
