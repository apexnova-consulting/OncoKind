-- Seed launch-ready community starter threads with a placeholder system account.

DO $$
DECLARE
  seed_user_id CONSTANT UUID := '00000000-0000-4000-8000-000000000001';
  seed_email CONSTANT TEXT := 'community-seed@oncokind.local';
  seed_created_at CONSTANT TIMESTAMPTZ := now() - interval '21 days';
BEGIN
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token,
    is_sso_user,
    is_anonymous
  )
  VALUES (
    seed_user_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    seed_email,
    crypt(gen_random_uuid()::text, gen_salt('bf')),
    seed_created_at,
    seed_created_at,
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"OncoKind Community Seed"}'::jsonb,
    seed_created_at,
    seed_created_at,
    '',
    '',
    '',
    '',
    false,
    false
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    subscription_status,
    subscription_tier,
    created_at,
    updated_at
  )
  VALUES (
    seed_user_id,
    seed_email,
    'OncoKind Community Seed',
    'free',
    'free',
    seed_created_at,
    seed_created_at
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = EXCLUDED.updated_at;

  INSERT INTO public.community_threads (
    id,
    category_slug,
    slug,
    title,
    body,
    author_id,
    author_display_name,
    created_at,
    updated_at,
    is_moderated,
    moderation_status,
    is_pinned,
    is_locked,
    reply_count,
    view_count,
    is_flagged
  )
  SELECT
    seed.id,
    seed.category_slug,
    seed.slug,
    seed.title,
    seed.body,
    seed_user_id,
    seed.author_display_name,
    seed.created_at,
    seed.created_at,
    true,
    'approved',
    false,
    false,
    0,
    seed.view_count,
    false
  FROM (
    VALUES
      (
        '00000000-0000-4000-8000-000000000101'::uuid,
        'just-diagnosed',
        'we-got-the-call-last-tuesday-i-dont-know-where-to-start',
        'We got the call last Tuesday. I don''t know where to start.',
        'My mom was diagnosed with Stage II breast cancer last week. I''ve been reading everything I can find online and I feel more confused than when I started. Has anyone else felt like that at the beginning? How did you figure out what to actually focus on first?',
        'Sarah M.',
        now() - interval '20 days',
        18
      ),
      (
        '00000000-0000-4000-8000-000000000102'::uuid,
        'just-diagnosed',
        'husband-just-diagnosed-trying-to-be-strong-but-struggling',
        'Husband just diagnosed — trying to be strong but struggling',
        'My husband was told it''s prostate cancer, caught early they say, but that word changes everything. I''m trying to be the calm one for our kids but at night I''m a wreck. Just wondering if anyone else has been in this spot and what helped in those first few weeks.',
        'Renee T.',
        now() - interval '17 days',
        14
      ),
      (
        '00000000-0000-4000-8000-000000000103'::uuid,
        'just-diagnosed',
        'questions-to-bring-to-our-first-oncology-appointment',
        'Questions to bring to our first oncology appointment?',
        'Dad''s appointment is next Thursday, first time meeting the oncologist after his pathology results came back. We used OncoKind to build a prep sheet which was incredibly helpful, but I wanted to know if anyone here had questions they wish they''d asked at their very first visit that they didn''t think to bring up.',
        'Daniel K.',
        now() - interval '15 days',
        12
      ),
      (
        '00000000-0000-4000-8000-000000000201'::uuid,
        'treatment',
        'what-actually-helped-with-chemo-fatigue-sharing-what-worked-for-us',
        'What actually helped with chemo fatigue — sharing what worked for us',
        'My wife finished her fourth round of chemo last week. The fatigue has been the hardest part, not the nausea like we expected. A few things that actually made a difference: short walks in the morning even when she didn''t feel like it, cold water with lemon during infusions, and asking the oncology nurse about her specific anti-nausea schedule rather than waiting to feel sick. Sharing in case it helps anyone.',
        'Marcus W.',
        now() - interval '13 days',
        22
      ),
      (
        '00000000-0000-4000-8000-000000000202'::uuid,
        'treatment',
        'anyone-elses-loved-one-losing-appetite-completely',
        'Anyone else''s loved one losing appetite completely?',
        'My father is three weeks into chemo and has almost stopped eating. He says nothing tastes right. The care team said it''s normal but it''s really hard to watch. Has anyone found foods or strategies that helped? We''ve tried smoothies but even those feel like a fight.',
        'Priya N.',
        now() - interval '11 days',
        16
      ),
      (
        '00000000-0000-4000-8000-000000000203'::uuid,
        'treatment',
        'second-opinion-changed-everything-for-us',
        'Second opinion changed everything for us',
        'After our first oncologist recommended surgery right away, we asked for a second opinion at a larger cancer center two hours away. The second team had a completely different recommendation — a targeted therapy first based on a biomarker we didn''t even know we should have tested for. I can''t stress enough how important it was to ask. This community and OncoKind helped us prepare the questions that led to that conversation.',
        'Janet R.',
        now() - interval '9 days',
        24
      ),
      (
        '00000000-0000-4000-8000-000000000301'::uuid,
        'insurance-financial',
        'first-denial-came-in-sharing-how-we-responded',
        'First denial came in — sharing how we responded',
        'Got a denial letter for pembrolizumab last month. It felt like a gut punch on top of everything else. We ended up filing an internal appeal with a letter of medical necessity from the oncologist and documentation of the PD-L1 test result. Approval came in 11 days. Happy to share the exact approach if anyone is dealing with something similar.',
        'Thomas G.',
        now() - interval '8 days',
        19
      ),
      (
        '00000000-0000-4000-8000-000000000302'::uuid,
        'insurance-financial',
        'found-financial-help-we-didnt-know-existed-pan-foundation',
        'Found financial help we didn''t know existed — PAN Foundation',
        'We were drowning in co-pays until a social worker at the hospital mentioned the PAN Foundation. Within two weeks we had assistance covering almost all of our out-of-pocket costs for treatment. If you haven''t looked into co-pay foundations specific to your diagnosis, it is absolutely worth an hour of research. The financial help section in OncoKind also has a live tracker that helped us find this.',
        'Carmen L.',
        now() - interval '5 days',
        15
      ),
      (
        '00000000-0000-4000-8000-000000000303'::uuid,
        'insurance-financial',
        'how-do-i-find-out-if-a-clinical-trial-covers-costs',
        'How do I find out if a clinical trial covers costs?',
        'We matched with a trial through OncoKind and it looks promising, but I''m not sure how the costs work. Does the trial sponsor cover treatment costs? What about travel? We''re about 90 minutes from the trial site. Has anyone navigated this before?',
        'Andrew B.',
        now() - interval '3 days',
        11
      ),
      (
        '00000000-0000-4000-8000-000000000401'::uuid,
        'caregiver-support',
        'caregiver-burnout-is-real-and-i-finally-admitted-it',
        'Caregiver burnout is real and I finally admitted it',
        'I''ve been caring for my mom through her cancer treatment for eight months. Last week I broke down in a parking lot and couldn''t stop crying for an hour. I think I''ve been running on empty for months and pretending I was fine. I don''t have a solution yet, but I wanted to say this out loud somewhere safe. Is anyone else carrying this?',
        'Olivia C.',
        now() - interval '19 days',
        20
      ),
      (
        '00000000-0000-4000-8000-000000000402'::uuid,
        'caregiver-support',
        'how-do-you-actually-accept-help-when-people-offer',
        'How do you actually accept help when people offer?',
        'Everyone keeps saying ''let me know if you need anything'' and I never know what to say. By the time I think of something, the moment has passed. I''ve started keeping a small list on my phone of specific things that would actually help — grocery run, sitting with mom for two hours, returning a prescription — so when someone asks I have a real answer ready. It felt awkward at first but it''s made a real difference.',
        'Kevin S.',
        now() - interval '7 days',
        13
      ),
      (
        '00000000-0000-4000-8000-000000000403'::uuid,
        'caregiver-support',
        'you-are-not-invisible-a-note-to-fellow-caregivers',
        'You are not invisible — a note to fellow caregivers',
        'Everyone asks about the patient. That''s right and it should be that way. But sometimes I feel like I''ve disappeared. I wanted to write something here for anyone else who feels that way: you matter too. What you''re doing is extraordinary. Taking care of yourself isn''t selfish — it''s what makes it possible to keep showing up. Just wanted someone to say that.',
        'Michelle D.',
        now() - interval '2 days',
        17
      )
  ) AS seed(id, category_slug, slug, title, body, author_display_name, created_at, view_count)
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.community_threads existing
    WHERE existing.id = seed.id
       OR (existing.category_slug = seed.category_slug AND existing.slug = seed.slug)
  );
END $$;
