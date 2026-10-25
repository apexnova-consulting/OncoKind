# Cost model per Concierge case

Gross margin = price shown minus timed labor at loaded hourly cost minus vendor (fax, mail) minus Stripe fees minus model and compute.

Example at $299 with 94 human minutes, $34/hour loaded, $6.50 vendor, ~$9 fees, $1.20 model:

Labor = 94/60 * 34 = $53.27
Margin = 299 - 53.27 - 6.50 - 9 - 1.20 = about $229

HMPC is the north star. The ops metrics page uses the same math as `lib/concierge/metrics.ts`.
