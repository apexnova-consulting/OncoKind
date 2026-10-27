# Board run 2 plan

Order: WS1 and WS2, then WS3, then WS4-WS8. Founder-decision flags stay **off** unless the table says On.

## Conflicts with the repo

- The prompt mentions a native mobile app. The repo is web + PWA only. No native app work.
- `CONCIERGE_RETENTION_DAYS` does not exist yet; the repo uses `CONCIERGE_RECORD_RETENTION_DAYS`.
- Concierge purchase and ops stay off until counsel, staffing, and SQL are live. WS3 ships the machinery; it does not turn purchase on.
- KindAuth remains the Prior Auth Engine product name on `/prior-auth-pro`. Family pages will not use "advocate" for a family plan once merge is confirmed.
- Clinical guideline sheets: no license file in repo. Rename the family document; flag the license gap in REPORT.md.

## Flags

| Flag | Default | Notes |
|---|---|---|
| `family_tier_merge` | off | Merge Advocate into Caregiver Pro when founder confirms |
| `concierge_price_variant` | off | $399 / $499 / $599 variants |
| `individual_advocate_plan` | off | $699 plan hidden |
| `rare_womens_cancers_framing` | off | Homepage niche A/B |
| `tool_freeze` | on | CI fails on new tool routes |
| `callForMe.enabled` | invite-only, off | Existing voice flags |

## PRs

One production PR covering WS1-WS8 with tests. Migrations are additive and reversible.

## Risks

- Merging the family Advocate Plan while the flag is off keeps current billing. Grandfather mapping only runs when the flag is on.
- Facility playbook stores process knowledge only.
- Call for me never places a production call in this work.
