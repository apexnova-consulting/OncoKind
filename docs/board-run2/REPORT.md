# Board run 2 report

Shipped in this change set. Founder-decision flags stay off except tool freeze (on) and the homepage pitch (on).

## What shipped

- Pricing card no longer duplicates Insurance Denial Defense on the family Plus plan. Professional has one Book a Demo control.
- Concierge retention is `CONCIERGE_RETENTION_DAYS = 90` for purge, pricing FAQ, Concierge, trust, and security.
- Family plan display name is Caregiver Plus. Merge into Caregiver Pro stays behind `family_tier_merge` (off). Existing Advocate Stripe prices are grandfathered with no billing change.
- Guideline family sheets renamed. No clinical guideline license file is in the repo.
- Concierge machinery: weekly cap and waitlist, price variants behind a flag, time-tracking tables, facility playbook prefill, templates that require human approval, staff-only follow-up cron, sponsored codes, partner isolation helpers.
- Call for me cannot start without invite access, a signed authorization, and a human-approved script. No production calls. Voice vendor listed on /trust as not live.
- Homepage four stages replace the tool grid. Next-step engine offers Concierge after a denial. Signed-in nav uses stage names.
- Rare women cancer landings at /cancers. Homepage niche framing stays off.
- Individual advocate $699 plan is in config and hidden.
- Public results hide below n=30. Analytics events require cookie consent and drop PHI fields.

## Behind flags

| Flag | State |
|---|---|
| family_tier_merge | Off |
| concierge_price_variant | Off |
| individual_advocate_plan | Off |
| rare_womens_cancers_framing | Off |
| tool_freeze | On |
| concierge_purchase / ops / voice production | Off |

## Conflicts

- Prompt mentioned a native mobile app. This repo is web plus PWA only. No native app work.
- Concierge purchase stays off until counsel, staffing, and live SQL gates pass.
- Clinical guideline content is renamed only. License status is unconfirmed.

## What users see now

Four stages on the homepage, Caregiver Plus instead of a family Advocate Plan, Denial Defense from Caregiver Pro, Concierge still $299 and not self-serve until gates pass.
