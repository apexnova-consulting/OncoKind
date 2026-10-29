# After the first 90 days: implementation plan

Written before application code. Repo wins on conflicts.

## Intent

Keep families after active treatment and add organization sponsorship revenue. No new tools. Public ladder stays Explorer, Caregiver Pro, Concierge, plus Keep labeled "After active treatment". All of this ships behind flags that default off.

## Repo conflicts (trust the repo)

- Public product is two-door family (Tools + Concierge). Caregiver Plus is merged into Caregiver Pro. Professional / KindAuth / B2B routes are parked. Keep must not revive parked B2B as a main-menu item.
- Concierge purchase (`FEATURE_CONCIERGE_PURCHASE`) stays off until Stripe Concierge price is live. Rollover checkbox is still built, gated by `conciergeKeepRollover`.
- Stripe price IDs are never invented. Keep prices read `STRIPE_PRICE_ID_KEEP_MONTHLY` and `STRIPE_PRICE_ID_KEEP_YEARLY`. Empty IDs block checkout.
- Billing cancel today goes through the Stripe customer portal. When `saveFlow` is on, account settings use the in-app save flow instead of sending Cancel into the portal.
- Comparison table currently has Explorer and Caregiver Pro only. Keep becomes a third column when `keepPlan` is on. Concierge stays a per-case card, not a matrix column.
- Tools still delete raw report text after processing unless Records vault consent is stored. Concierge still purges 90 days after Case Ready unless vault consent plus an active Caregiver Pro or Keep subscription.
- Family tree already exists (`families`, `family_members`, `consents`). Family risk reuses it. Relatives do not get a new tool. Share grants are additive and stricter than today's family-member row visibility.
- There is no companion mobile app in this repository. Parity is documented in REPORT.md, not built here.

## Names and prices (single config)

File: `lib/after-90/config.ts`, re-exported through `lib/pricing-config.ts`.

| Thing | Exact name |
| --- | --- |
| Phase | After the first 90 days |
| Plan | Keep |
| Part 1 | Records vault |
| Part 2 | Follow-up visit prep |
| Part 3 | Family risk |
| Keep monthly | $9 / 900 cents |
| Keep yearly | $99 / 9900 cents (10x monthly) |

## Feature flags (all default off)

| Flag | Env | Default |
| --- | --- | --- |
| saveFlow | FEATURE_SAVE_FLOW | off |
| keepPlan | FEATURE_KEEP_PLAN | off |
| keepEligibility | FEATURE_KEEP_ELIGIBILITY | off |
| recordsVault | FEATURE_RECORDS_VAULT | off |
| after90Phase | FEATURE_AFTER_90_PHASE | off |
| orgSponsorship | FEATURE_ORG_SPONSORSHIP | off |
| conciergeKeepRollover | FEATURE_CONCIERGE_KEEP_ROLLOVER | off |

Turn-on order after counsel: saveFlow, then keepPlan + keepEligibility, then recordsVault, then after90Phase, then orgSponsorship, then conciergeKeepRollover.

## Files touched

- Flags: `lib/feature-flags.ts`
- Entitlements: `lib/pricing-config.ts`, `lib/stripe-prices.ts`, `lib/report-limits.ts`, `lib/auth.ts`
- Copy: `lib/legal/retention.ts`, `lib/legal/refunds.ts`, `lib/crawler/public-copy.ts`
- Public: `/pricing`, `/features`, homepage FAQ, `/concierge`, `/trust`, `/partners`, footer, `/about`
- Dashboard: `/journey` next step, `/journey/after-90`, `/dashboard/billing`, `/dashboard/billing/save`, `/dashboard/vault-consent`
- APIs: keep checkout, save flow, vault consent, compare, ready packet, rollover opt-out, org seats, cron
- Stripe webhook: Keep tier, pause, pending switch, bereavement refund
- Emails: `lib/after-90/emails.ts`
- Cron: `vercel.json` + `/api/cron/after-90`
- SQL: `supabase/migrations/20261029120000_after_90_keep.sql`

No new `/features/*` routes. Tool freeze stays.

## Tables

- `profiles`: `treatment_finished_at`, `vault_consent_at`, `vault_consent_text`, `pause_resumes_at`, `bereavement_at`, `pending_plan`, `sponsorship_code`
- `keep_rollover_consents`: ticked, text shown, timestamps, opt-out token
- `subscription_pauses`
- `billing_save_events`
- `family_item_shares`
- `follow_up_visits`
- `org_sponsorship_contracts`, `org_sponsored_seats`
- `product_events` (event name, source, user id, no PHI)
- `vault_deletion_log`

RLS: owner and relative isolation; organization role select-only on count views, never on reports, family PHI, or concierge blobs.

## Stripe objects (staging / live, not in git)

- Product Keep, prices $9/mo and $99/yr
- Invoicing for org contracts (no self-serve)
- Pause via `pause_collection`
- Pro to Keep at period end (metadata + cron)
- Keep to Pro immediate with proration

## Risks

- Auto-renewal and vault/family-risk consent need counsel before flags go on.
- Bereavement refunds unused time of the current period. That is a change from "unused subscription time is not refunded except where required by law" and is isolated to the bereavement path.
- Vault retention changes the Tools privacy sentence only after consent.
- Stripe Keep price IDs must be set in Vercel before `keepPlan` is turned on.

## PR

One production PR, flags off. Tests cover eligibility, save flow, claims, comparison eval, and RLS SQL intent.
