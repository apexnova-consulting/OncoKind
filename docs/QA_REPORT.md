# QA report

## Automated
- `npx tsc --noEmit` and `npx next build` (run in this release).
- `npm test` (`tsx --test tests/release-safety.test.ts`): First 72 and Family copy mortality scan; yearly 10x; hidden-member isolation helper.
- Playwright marketing/billing fixtures updated for $39/$49/$999.

## Manual (staging, flags ON)
- [ ] Homepage hero/CTA/meta match Cancer Profile promise; paid unlock listed.
- [ ] Pricing cards: $0, $39/$390, $49/$490, $999; yearly 10 months.
- [ ] Free: 1 scan, top 3 trial preview, read-only community, basic timeline.
- [ ] Caregiver Pro: PDF prep, second opinion, check-in, 50-mile trials, First 72 extras, Family PDF.
- [ ] Advocate: insurance + financial tracker.
- [ ] KindAuth blocked for caregiver/advocate, allowed for professional.
- [ ] First 72 Hours: no countdown, intake "I am not sure", CSC + 988 footer.
- [ ] Family: I do not know, hide/delete own row, invite link, no risk scores.
- [ ] Relative A cannot read relative B hidden data (SQL in `supabase/tests/family_rls.sql`).
- [ ] WCAG 2.2 AA spot check, mobile Lighthouse Performance/Accessibility >= 90 on homepage and First 72 Hours.
- [ ] Spanish strings in `locales/es.json` for new keys (prep).

## De-identification (Anthropic payloads)
- Pathology and report routes call `scrubPII` / `scrubPHI` (`lib/pii-scrubber.ts`) before Anthropic.
- Coverage: SSN, labeled MRN, dates, phones, emails, street addresses, labeled ZIP, titled/labeled names.
- Gaps: unstructured full names without labels, ZIP-only values, and facility names may still pass. QA should treat de-identification as **strong but not complete** for unlabeled narrative PHI.

## Flags
- Production: `FEATURE_FIRST_72_HOURS=0`, `FEATURE_ONCOKIND_FAMILY=0`.
- Staging/preview: set both to `1` plus `NEXT_PUBLIC_*` copies.
