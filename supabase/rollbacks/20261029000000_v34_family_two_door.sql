-- Reverse of 20261029000000_v34_family_two_door.sql
DELETE FROM public.concierge_sponsored_codes WHERE code = 'STAAR-2026' AND remaining = 0 AND active = false;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS sponsor_code;
