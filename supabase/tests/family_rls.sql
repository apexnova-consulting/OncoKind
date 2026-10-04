-- Manual/automated RLS isolation checks for OncoKind Family.
-- Run in staging after applying 20261004180000_oncokind_family.sql
-- Expected: relative A cannot select relative B's hidden member row.

-- 1. Create two users and one family owned by A.
-- 2. Insert member claimed_by B with hidden=true.
-- 3. SET request.jwt.claim.sub = A; SELECT should return 0 rows.
-- 4. SET request.jwt.claim.sub = B; SELECT should return 1 row.
