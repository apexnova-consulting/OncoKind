# OncoKind E2E Test Suite

Playwright/TypeScript E2E suite generated from the **OncoKind Pre-Launch QA
Testing Guide** (v1.0, June 2026, 15 sections / 130+ checks), and **rewritten
in July 2026 against the live site** (`www.oncokind.com`) after a full
manual + automated review.

**Read [`SITE_REVIEW_FINDINGS.md`](./SITE_REVIEW_FINDINGS.md) first.** The
product changed a lot since June — new pricing, a 3-field signup form, the
waitlist closing — and a handful of real bugs turned up along the way (two
different site templates live simultaneously on `/about`, `/resources`, and
`/community`; a 404'd Empathy Filter page linked from every footer; a
robots.txt rule that likely blocks your public KindAuth marketing page from
search engines). Those are called out below and encoded as `test.fail(...)`
tests so they show up as visible, tracked regressions in every run rather
than silently passing or being deleted.

## File structure

```
oncokind-e2e/
├── playwright.config.ts
├── package.json
├── tsconfig.json
├── .env.example
├── tests/
│   ├── auth.setup.ts              # Logs in all 5 QA roles once, saves storageState
│   ├── marketing.spec.ts          # Section 1 (Public Pages) + public Section 9 (Nav/SEO)
│   ├── auth-gates.spec.ts         # Section 2 (Auth Flow) + tier gates + Section 8 (API auth)
│   ├── prior-auth.spec.ts         # Section 6 (Professional/KindAuth) — the critical section
│   ├── user-tiers.spec.ts         # Sections 3, 4, 5 (Free/Pro/Advocate) + Section 7 (Admin)
│   ├── billing.spec.ts            # Section 13 (Stripe checkout) — bonus, not in the original 4-file ask
│   └── fixtures/
│       ├── test-data.ts           # Roles, routes, sample case data, copy pulled from the guide
│       └── sample-pathology-report.pdf  # Placeholder upload fixture — REPLACE (see below)
└── playwright/.auth/              # Generated storageState JSON per role (gitignored)
```

## What each spec file covers, by guide section

| File | Guide sections |
|---|---|
| `marketing.spec.ts` | 1 (Public Marketing Pages), 9 (public nav/SEO checks), 10 (mobile layout, via the `mobile-marketing` project) |
| `auth-gates.spec.ts` | 2 (Auth Flow), tier-gate redirects from 3/4/5/6, 8 (API 401/403), part of 14 (wrong-password error) |
| `user-tiers.spec.ts` | 3 (Free), 4 (Caregiver Pro), 5 (Advocate), 7 (Admin/Enterprise, light pass), Section 9's role-based nav badge check |
| `prior-auth.spec.ts` | 6 (Professional/KindAuth — full 5-step wizard, Step Therapy, Continued Stay, Denial Analyzer, status tracking, case list), relevant parts of 14 (fake ID 404, empty-field validation) |
| `billing.spec.ts` | 13 (Stripe checkout) — added because the brief asked for it explicitly; not one of the 4 named files |

**Not automated** (by design — see inline comments in each guide section):
- **Section 11 (Lighthouse performance)** — this is a scoring/audit tool, not a
  functional assertion. Wire it up separately via `playwright-lighthouse` or
  a CI step running `lighthouse-ci` if you want this gated in CI.
- **Section 12 (Email Flows)** — verifying actual email delivery/content
  needs an inbox-testing service (Mailosaur, Ethereal, or a Resend webhook
  listener). Stubbed out; wire in your provider of choice.
- **Section 8's DB-level checks** (AI audit log, PHI masking, RLS
  cross-user leakage) — these are raw SQL run in Supabase Studio, not
  browser behavior. The two browser-visible pieces (401/403 API responses)
  *are* automated in `auth-gates.spec.ts`. The SQL checks belong in a
  separate DB test/script with a service-role key, not in browser-facing
  Playwright code.
- **Section 15 (Final Infrastructure Checklist)** — env var presence,
  Vercel deploy status, Supabase plan tier, etc. are deployment/ops checks,
  not app behavior. Consider a small pre-deploy script instead.

## Reading `test.fail(...)` in this suite

Two different markers show up in this codebase, and they mean different things:

- **`test.fixme(...)`** — the behavior doesn't exist yet / was never built.
  Not a regression, just unimplemented. (None of these are new in the July
  rewrite — the pricing toggle one from June was fixed and removed.)
- **`test.fail(...)`** — the behavior WAS expected (per the guide or basic
  consistency) and is currently broken on the live site. These are real,
  confirmed findings from the July review (see `SITE_REVIEW_FINDINGS.md`):
  template inconsistency on `/about`/`/resources`/`/community`, the 404'd
  `/features/empathy-filter`, the robots.txt prefix-block on
  `/prior-auth-pro`, the missing "Forgot password" link, and the Advocate
  checkout link missing its `plan=` param. Playwright runs these normally
  and reports them as **expected failures** (shown differently from a real
  CI-breaking failure) — so they stay visible without blocking every other
  run. Once fixed, flip `test.fail(...)` back to `test(...)` and it'll fail
  loudly if the fix regresses later.

## Before you run this

The guide's own annotations flag a few things as **currently broken or
missing**, and some tests are written against the *intended* behavior:

- `marketing.spec.ts` → `monthly/yearly toggle updates displayed prices` is
  `test.fixme(...)` — the toggle doesn't exist yet per the guide's note.
- `marketing.spec.ts` → `page renders exactly one site header` (on
  `/prior-auth-pro`) is `test.fixme(...)` — the guide flags two competing
  headers on that page.
- The homepage console-error check filters out the known service-worker
  fetch failure (`sw.js:53:21`) so it doesn't mask *new* regressions while
  that bug is open — remove the filter once it's fixed.

Also, **this codebase has zero visibility into OncoKind's actual DOM** —
I don't have `data-testid` attributes or real CSS selectors, so most
locators use `getByRole`/`getByLabel`/`getByText` (Playwright's recommended,
most resilient approach) with a few `[data-testid*="..." i]` / `[class*="..." i]`
fallbacks where the guide didn't give enough to go on. **Expect to spend an
hour or two on first run reconciling locator text with your real copy** —
search for `TODO`-worthy spots by running the suite once and triaging
failures; most will be a label/button-text mismatch, not a logic problem.
Adding `data-testid` to key elements (case rows, the generated-document
textarea, tier cards, FAQ accordion items) will make this suite much less
brittle long-term.

## Setup

### 1. Install

```bash
npm install
npx playwright install --with-deps chromium
```

### 2. Environment variables

```bash
cp .env.example .env
```

Fill in `.env`:

```
BASE_URL=https://staging.oncokind.com   # use staging for routine runs
QA_FREE_EMAIL=qa-free@oncokind.com
QA_FREE_PASSWORD=************
QA_PRO_EMAIL=qa-pro@oncokind.com
QA_PRO_PASSWORD=************
QA_ADVOCATE_EMAIL=qa-advocate@oncokind.com
QA_ADVOCATE_PASSWORD=************
QA_PROFESSIONAL_EMAIL=qa-professional@oncokind.com
QA_PROFESSIONAL_PASSWORD=************
QA_ADMIN_EMAIL=qa-admin@oncokind.com
QA_ADMIN_PASSWORD=************
```

Never commit real passwords — `.env` is gitignored. In CI, set these as
secret environment variables instead.

### 3. Seed the test accounts (Step 0 / Step 1 of the guide — do this once, outside Playwright)

1. Run both SQL migrations in Supabase Studio → SQL Editor (Prior Auth
   Engine tables + the `professional` tier check constraint).
2. Create all 5 accounts at `oncokind.com/signup` (or via Supabase Studio →
   Authentication → Users → Add User if you hit the 3/hr signup rate limit).
3. Run the tier-assignment SQL block from Step 1 of the guide, then verify
   with the provided `SELECT` — you should get 5 rows back with the correct
   tier per account.

### 4. Replace the upload fixture

`tests/fixtures/sample-pathology-report.pdf` is a placeholder (plain text on
a blank page) so `user-tiers.spec.ts`'s upload tests have *something* to
attach. Swap in a real de-identified sample pathology report PDF that your
report-parsing pipeline will actually recognize.

## Running the suite

```bash
# Full suite (setup project runs first automatically via `dependencies`)
npx playwright test

# One project at a time
npm run test:marketing
npm run test:auth-gates
npm run test:user-tiers
npm run test:prior-auth
npm run test:billing

# Interactive UI mode — great for first-time locator debugging
npm run test:ui

# Headed / debug a single file
npx playwright test tests/prior-auth.spec.ts --headed --debug

# View the HTML report after a run
npm run report
```

### Re-authenticating

If a role's session expires mid-suite or you rotate a test password, delete
its stored session and it'll be regenerated on the next run:

```bash
rm playwright/.auth/pro.json
npx playwright test --project=setup
```

## CI notes

- `forbidOnly`, `retries: 2`, and capped `workers` only kick in when
  `CI=true` is set — see `playwright.config.ts`.
- Run `billing.spec.ts` as its own CI job/stage if you want faster feedback
  from the rest of the suite without waiting on Stripe's hosted checkout
  page each time — it's already isolated as its own project.
- Point `BASE_URL` at staging for every routine run. Reserve a production
  run for the final Section 15 / QA Sign-Off pass described in the guide,
  and coordinate with the team since `billing.spec.ts` and the report-upload
  tests create real (if disposable) data.
