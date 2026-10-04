# Migration and rollback

## Apply (staging first)
```bash
supabase db push
# or run in SQL editor:
# supabase/migrations/20261004180000_oncokind_family.sql
# supabase/migrations/20261004181000_first_72_progress.sql
```

## Rollback
```bash
psql "$DATABASE_URL" -f supabase/rollbacks/20261004181000_first_72_progress.sql
psql "$DATABASE_URL" -f supabase/rollbacks/20261004180000_oncokind_family.sql
```

## Feature flags
Leave `FEATURE_FIRST_72_HOURS` and `FEATURE_ONCOKIND_FAMILY` unset or `0` in production. Tables can exist while UI stays off.

## Stripe
Create prices $39, $390, $49, $490, $999. Set Vercel:
`STRIPE_PRICE_ID_CAREGIVER_MONTHLY`, `STRIPE_PRICE_ID_CAREGIVER_YEARLY`,
`STRIPE_PRICE_ID_ADVOCATE_MONTHLY`, `STRIPE_PRICE_ID_ADVOCATE_YEARLY`,
`STRIPE_PRICE_ID_PROFESSIONAL_MONTHLY`.
Then redeploy. Do not invent IDs in git.
