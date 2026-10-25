# Concierge runbooks

## Kill switches
- `FEATURE_CONCIERGE_KILL_SWITCH=1` hides public pages, purchase, ops, and facility writes.
- `FEATURE_CONCIERGE_PURCHASE=0` (default) blocks Stripe.
- `FEATURE_CONCIERGE_OPS_CONSOLE=0` (default) redirects `/ops/*` to dashboard.
- `FEATURE_CTP_REDUCED_MODE=1` (default) keeps Complete the Picture in question-list mode without not-mentioned flagging.

## Misdirected document
1. Pause the case.
2. Isolate the file.
3. Notify the lead.
4. Follow counsel's notification checklist.
5. Log the incident in `concierge_access_log`.

## Authorization revoke
Revoke sets `authorizations.revoked_at` and must halt outstanding `record_requests` within one minute.

## Facility verification
Re-verify on a 90-day cadence. Families and coordinators can mark a profile out of date. Do not rank centers.
