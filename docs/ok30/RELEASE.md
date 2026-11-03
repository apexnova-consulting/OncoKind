# OK-30 Release log

Branch: `ok-30`. Built all tickets. Production ships in three flagged releases.

## Release 1 (live now, sell and market)

Tickets: OK-00, OK-01, OK-02 order-linked time log, OK-04, OK-05, OK-06, OK-12 public trial lists, OK-14, OK-15.

Shipped in code:

- Single config in `lib/ok01.ts`. Case Ready starts on variant A ($499). Included Pro days: 60.
- `/professional` and `/prior-auth-pro` are reachable, noindex, book-a-call only. Removed from sitemap and footer.
- Community is flagged off and redirects to `/support`.
- Prep Sheet library at `/features/prep-sheets`. Old tile URLs 301.
- Features hub: four stages plus one Concierge path block. Empathy Filter is a promise line, not a tile.
- Diagnosis pages render ClinicalTrials.gov lists in the initial HTML plus the sources line.
- Staff time log at `/admin/concierge-time`. Families never see entries.
- `/partners` is live and indexed. Hardship form keeps Concierge vs Pro choice.

Flags that stay OFF: Keep family, `community_enabled`, `case_model_v2`, `have_us_do_this`, `staff_back_office`, `revenue_dashboard`, `FEATURE_CONCIERGE_PURCHASE` until Stripe IDs exist and one live charge is refunded.

Conflict notes:

- Stripe Checkout still stores `supabase_user_id` and `plan_key` so existing webhooks keep working. OK-11 R3 will narrow metadata to `case_id`, `price_variant`, and `source` after the case model ships.
- There is no companion mobile app in this repo. Web is source of truth. Note this gap until a mobile client exists.
- Weekly Concierge price rotation was removed. Price is the active OK-01 variant.

Do not run `supabase/migrations/20261103010000_ok30_case_model.sql` in production.

R1 SQL that is safe: `supabase/migrations/20261103000000_ok30_r1_time_and_sponsor.sql`.

## Release 2 (flagged, no prod migration)

Tickets: OK-03 (SQL in repo only), OK-07 gap-to-task mapper, OK-09 family-visible status helper.

## Release 3 (flags off)

Tickets: OK-08 packet artifact reuse, OK-10 playbooks page, OK-11 Have us do this buttons (present, flagged), OK-12 Pro matching later, OK-13 revenue dashboard (flagged), OK-02 case_id switch after OK-03.

## Founder inputs still required

See the manual to-do list in the ship note.
