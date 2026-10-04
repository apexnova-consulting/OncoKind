-- Rollback for 20261004180000_oncokind_family.sql
DROP POLICY IF EXISTS audit_log_insert ON public.audit_log;
DROP POLICY IF EXISTS audit_log_owner_read ON public.audit_log;
DROP POLICY IF EXISTS consents_self ON public.consents;
DROP POLICY IF EXISTS invites_owner ON public.invites;
DROP POLICY IF EXISTS family_members_self_delete ON public.family_members;
DROP POLICY IF EXISTS family_members_self_update ON public.family_members;
DROP POLICY IF EXISTS family_members_owner_write ON public.family_members;
DROP POLICY IF EXISTS family_members_visible ON public.family_members;
DROP POLICY IF EXISTS families_owner ON public.families;
DROP TABLE IF EXISTS public.audit_log;
DROP TABLE IF EXISTS public.consents;
DROP TABLE IF EXISTS public.invites;
DROP TABLE IF EXISTS public.family_members;
DROP TABLE IF EXISTS public.families;
