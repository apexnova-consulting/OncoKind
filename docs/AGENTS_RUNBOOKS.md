# Agents runbooks

## Kill switches
- `FEATURE_AGENTS_KILL_SWITCH=1` disables Complete the Picture, Access Agent, and Call for me without a deploy.
- `FEATURE_VOICE_KILL_SWITCH=1` (default recommended) blocks calling.
- `FEATURE_VOICE_PRODUCTION_CALLS` must stay `0` until counsel approves a vendor, BAA, and scripts.

## Rule updates
1. Clinical author imports JSON or CSV into `content/agents/ctp-rules` or `rule_versions`.
2. A different person sets status to approved.
3. `next_review_due` is required. Past-due rules should be flagged monthly.

## Program verification
Re-verify every 90 days. Show last verified on every card. Seed records ship as `unverified`. Matching in production includes only `active` records verified in the last 90 days unless `FEATURE_ACCESS_INCLUDE_UNVERIFIED=1`.

## Model swap
Change `AGENT_EXTRACTION_MODEL` or `AGENT_REWORDING_MODEL`. Run `npm test`. Do not ship a model that fails banned-phrase, dash, or injection tests.

## Incident
Pause with kill switch. File the report from in-product Report a problem. Escalate clinical wrong-output reports to the named content owner. Do not restore raw report text into logs.
