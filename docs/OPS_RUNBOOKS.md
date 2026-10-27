# Operations runbooks

## Severity

- SEV-1: confirmed or likely unauthorized access to health information, or a full site outage.
- SEV-2: Concierge cannot send records requests, billing webhooks fail, or AI processing is down for more than 30 minutes.
- SEV-3: a single feature is degraded.

## 72-hour breach clock

1. Detect: error tracking, Stripe mismatch job, or a support report.
2. Contain: rotate keys, disable the affected flag, and stop outbound Concierge sends.
3. Decide: founder plus counsel decide if it is a reportable incident.
4. Notify affected users within 72 hours of confirmation.
5. Counsel contact: record the live counsel email in the founder password manager. Do not put it in git.

## Concierge refund window

If no records request is sent within 10 business days of complete authorization and intake, flag the case for a full refund.

## Restore

Daily database backups live in the Supabase project. Test a restore before any paid marketing spend.
