# After the first 90 days: REPORT

Shipped behind flags that default off. Counsel still has to approve consent, auto-renewal, Family risk, and Trust wording before any flag turns on.

## What shipped

- Phase "After the first 90 days" at `/journey/after-90` (flag `after90Phase`). Records vault, follow-up visit prep, and family risk reuse existing tools. No new `/features` cards or public nav items.
- Keep plan in entitlements config: $9/month or $99/year. Public card and comparison column render only when `keepPlan` is on. Checkout is API-gated by eligibility.
- Save flow at `/dashboard/billing/save`: Pause 1/2/3 months, Switch to Keep, Cancel on the first screen, confirm on the second. Bereavement refunds unused time of the current period.
- Concierge rollover checkbox (unticked) when `conciergeKeepRollover` and `keepPlan` are on. Consent row stores the exact text. Opt-out at `/keep/opt-out/[token]` does not require login.
- `/partners` plus footer/about links when `orgSponsorship` is on. Organization dashboard is counts only.
- Trust, pricing FAQ, homepage FAQ, Concierge retention, and features stage-4 line update from config when the matching flag is on.
- Cron `/api/cron/after-90` for pause reminders, rollover reminder, sponsorship ending notice, and vault deletion log.
- SQL `supabase/migrations/20261029120000_after_90_keep.sql`. Not applied from this PR. Founder runs it in Supabase.

## Flag states in production

All off: `saveFlow`, `keepPlan`, `keepEligibility`, `recordsVault`, `after90Phase`, `orgSponsorship`, `conciergeKeepRollover`.

Turn on only after counsel, in this order: saveFlow, keepPlan + keepEligibility, recordsVault, after90Phase, orgSponsorship, conciergeKeepRollover.

## Stripe (founder, not in git)

Create Keep product prices $9/mo and $99/yr. Set `STRIPE_PRICE_ID_KEEP_MONTHLY` and `STRIPE_PRICE_ID_KEEP_YEARLY`. Empty IDs block Keep checkout. Live Stripe test clocks were not run here; switch and pause logic is unit-tested with dates.

## Tests

- `tests/after90.test.ts`
- `tests/save-flow.test.ts`
- `oncokind-e2e/tests/after90.spec.ts`
- `oncokind-e2e/tests/save-flow.spec.ts`

Tool-freeze CI still requires every `/features/*` directory to stay in `FROZEN_TOOL_ROUTES`. `/journey/after-90` is not a tool card.

## Could not be made true yet

- Mobile app parity: there is no companion app in this repo. Store pause/switch rules are not confirmed. Note this before an App Store Keep SKU.
- Counsel has not reviewed auto-renewal, vault consent, Family risk, or Trust additions.
- Org invoices are config-priced; Stripe Invoicing is not created until the first contract.
- Live Concierge rollover charge still needs Concierge purchase plus Keep price IDs.
- SQL migration is not auto-applied.

## Conflicts recorded in PLAN.md

Repo two-door product, parked B2B, no invented Stripe IDs, and tool freeze all held.
