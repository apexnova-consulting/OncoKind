-- Waitlist table for pre-launch email capture
-- Expires: 30 days from creation (managed in application layer)

create table if not exists public.waitlist (
  id          uuid        primary key default gen_random_uuid(),
  email       text        not null,
  name        text,
  source      text        not null default 'banner',   -- 'banner' | 'page' | 'footer'
  confirmed   boolean     not null default false,
  created_at  timestamptz not null default now(),
  constraint waitlist_email_key unique (email)
);

alter table public.waitlist enable row level security;

-- No public read access (protect submitter privacy)
-- Writes go through the service-role API route only — no RLS INSERT policy needed
-- Admin access via service role bypasses RLS by design

comment on table public.waitlist is
  'Pre-launch waitlist. Collected via marketing banner and /waitlist page. Managed via service-role API.';
