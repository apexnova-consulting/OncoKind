# OncoKind — Pre-Launch QA Checklist
**Version:** 1.0 — June 2026  
**Tester:** Mike Nielson  
**Environment:** Production (oncokind.com) + Supabase Studio

---

## STEP 0 — Run These Two SQL Migrations First

Paste each block separately into **Supabase Studio → SQL Editor → Run**.

### Migration A — Prior Auth tables (if not already done)
Paste the contents of: `supabase/migrations/20260618000000_prior_auth_engine.sql`

### Migration B — Add `professional` tier to CHECK constraint
```sql
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_subscription_tier_check
    CHECK (subscription_tier IN ('free', 'pro', 'advocate', 'professional', 'enterprise'));
```

---

## STEP 1 — Create Test User Accounts

### 1A. Create 5 accounts via the app signup flow

Go to **https://oncokind.com/signup** and create one account for each role:

| Role | Email to use | Password |
|------|-------------|----------|
| Free user | `qa-free@oncokind.com` | `QAtest2026!` |
| Caregiver Pro | `qa-pro@oncokind.com` | `QAtest2026!` |
| Advocate | `qa-advocate@oncokind.com` | `QAtest2026!` |
| Professional | `qa-professional@oncokind.com` | `QAtest2026!` |
| Admin/Enterprise | `qa-admin@oncokind.com` | `QAtest2026!` |

> Sign up each one through the normal flow. Confirm emails if required. Do NOT buy a Stripe subscription yet — you'll set tiers manually below.

### 1B. Set subscription tiers via Supabase SQL Editor

After creating all 5 accounts, run this in **Supabase Studio → SQL Editor**:

```sql
-- Set tiers for QA test accounts
UPDATE public.profiles SET subscription_tier = 'free'
  WHERE email = 'qa-free@oncokind.com';

UPDATE public.profiles SET subscription_tier = 'pro'
  WHERE email = 'qa-pro@oncokind.com';

UPDATE public.profiles SET subscription_tier = 'advocate'
  WHERE email = 'qa-advocate@oncokind.com';

UPDATE public.profiles SET subscription_tier = 'professional'
  WHERE email = 'qa-professional@oncokind.com';

UPDATE public.profiles SET subscription_tier = 'enterprise'
  WHERE email = 'qa-admin@oncokind.com';

-- Verify all 5 were updated
SELECT email, subscription_tier FROM public.profiles
  WHERE email LIKE 'qa-%@oncokind.com'
  ORDER BY email;
```

Expected result: 5 rows, each with the correct tier.

---

## SECTION 1 — Public Marketing Pages (No login required)

Test with: **Incognito window, not logged in**

### Homepage (`/`)
- [ ] Page loads without errors
- [ ] Hero headline and CTA render correctly
- [ ] "Upload Your First Report" CTA goes to `/signup`
- [ ] "Try a Sample Report ↓" scrolls or navigates correctly
- [ ] Trust bar (below hero) renders
- [ ] "The Moment" empathy section renders
- [ ] How It Works — all 4 steps visible
- [ ] Feature grid — 8 feature cards visible, "Learn more" links work
- [ ] Founder Story section renders (video plays on click, NOT autoplay)
- [ ] Pricing preview — all 4 tiers visible (Free, Caregiver Pro, Advocate, Professional)
- [ ] Final CTA section renders

### About (`/about`)
- [ ] Page loads
- [ ] Headline: "This is not a startup story. This is a life's work."
- [ ] Founder video present (no autoplay, has controls)
- [ ] Timeline section renders
- [ ] "Get Started Free" CTA works

### Pricing (`/pricing`)
- [ ] All 4 tier cards visible (Free, Caregiver Pro, Advocate, Professional)
- [ ] Feature comparison table renders (17 rows)
- [ ] Toggle Monthly / Yearly works
- [ ] "Book a Demo" link for Professional tier points to Calendly
- [ ] FAQ section renders (5 questions)

### Professional (`/professional`)
- [ ] Page loads without errors
- [ ] "Book a Demo" CTA works

### Prior Auth Pro (`/prior-auth-pro`) ← NEW
- [ ] Page loads publicly (no login required)
- [ ] Three workflow cards visible (Prior Auth, Step Therapy, Continued Stay)
- [ ] Stats bar renders (90M+, 2–4 hrs, 45–60%)
- [ ] "Start Free — Professional Plan" → `/signup?plan=professional`
- [ ] "Book a Demo" → `mailto:hello@oncokind.com`
- [ ] Footer disclaimer present

### Learn (`/learn`)
- [ ] Article index loads
- [ ] At least 2 articles clickable and readable

### Resources (`/resources`)
- [ ] Resource index loads
- [ ] At least 1 resource opens

### Community (`/community`)
- [ ] Community hub loads without login
- [ ] Categories visible

### Trust & Legal
- [ ] `/trust` — loads
- [ ] `/privacy` — loads
- [ ] `/terms` — loads
- [ ] `/security` — loads
- [ ] `/support` — loads with support email visible

### Waitlist (`/waitlist`)
- [ ] Page loads
- [ ] Submit a test email — success state shows
- [ ] Submit same email again — "already on the list" state shows
- [ ] Waitlist banner appears on homepage (dismiss works, stays dismissed on reload)

### SEO Checks
- [ ] View source on `/` — `<title>` tag present and correct
- [ ] View source on `/` — JSON-LD structured data block present in `<head>`
- [ ] `robots.txt` — `/dashboard/`, `/api/`, `/prior-auth` are disallowed
- [ ] `sitemap.xml` — `/prior-auth-pro` appears in the list

---

## SECTION 2 — Authentication Flow

### Signup (`/signup`)
- [ ] Form renders with email + password fields
- [ ] Submit with weak password — shows error
- [ ] Submit with valid email + strong password — account created
- [ ] Redirects to dashboard after signup

### Login (`/login`)
- [ ] Login with valid credentials → dashboard
- [ ] Login with wrong password → error message shown
- [ ] "Forgot password" link present and functional
- [ ] After login, `/login` redirects away (no loop)

### Logout
- [ ] "Sign out" in dashboard nav → returns to homepage
- [ ] After signout, `/dashboard` redirects to `/login`

### Auth Gate — Unauthenticated Access
- [ ] Visit `/dashboard` while logged out → redirects to `/login`
- [ ] Visit `/prior-auth` while logged out → redirects to `/login?redirect=/prior-auth`
- [ ] Visit `/journey/timeline` while logged out → redirects to `/login`

---

## SECTION 3 — Free Tier (`qa-free@oncokind.com`)

Log in as the Free user.

### Dashboard
- [ ] Dashboard loads
- [ ] Tier badge or indicator shows "Free"
- [ ] Nav links visible: Home, Timeline, Reports, Prep Sheet, Billing, Community, Quiet Room, Security

### Report Upload
- [ ] Navigate to `/reports`
- [ ] Upload a PDF report — processes and shows AI Cancer Profile
- [ ] Try to upload a second report — either blocked with upgrade prompt OR shows usage limit message
- [ ] Report detail page renders (Cancer Profile, key findings)

### Feature Gates (Free user should be blocked)
- [ ] Attempt Doctor Prep Sheet → upgrade prompt shown (not the actual sheet)
- [ ] Attempt Clinical Trial Matching → upgrade prompt
- [ ] Attempt Insurance Denial Defense → upgrade prompt
- [ ] Billing page (`/dashboard/billing`) → shows Free plan, upgrade CTAs for Pro and Advocate

### Community
- [ ] `/community` — can read posts
- [ ] Cannot post (read-only for Free) OR posting is gated

### Quiet Room
- [ ] `/quiet-room` — loads and is accessible

---

## SECTION 4 — Caregiver Pro Tier (`qa-pro@oncokind.com`)

Log in as the Pro user.

### Core Features
- [ ] Dashboard loads with Pro indicator
- [ ] Upload 2+ reports — no limit error
- [ ] **Doctor Prep Sheet** — generates successfully, PDF export works
- [ ] **Clinical Trial Matching** — results load for a test zip code
- [ ] **Care Timeline** (`/journey/timeline`) — loads, can add entries
- [ ] **Second Opinion Mode** (`/journey/second-opinion`) — loads
- [ ] **Appointment Check-In** — accessible
- [ ] **Community full access** — can read AND post

### Feature Gates (Pro user should be blocked)
- [ ] Insurance Denial Defense → upgrade prompt for Advocate
- [ ] Financial Aid Tracker → upgrade prompt
- [ ] Visit `/prior-auth` → redirected to `/dashboard/billing?upgrade=prior-auth`

### Billing Page
- [ ] Shows "Caregiver Pro" plan
- [ ] Upgrade options for Advocate visible

---

## SECTION 5 — Advocate Tier (`qa-advocate@oncokind.com`)

Log in as the Advocate user.

### Advocate-Only Features
- [ ] **Insurance Denial Defense** (`/journey/insurance-support`) — loads
- [ ] Upload a denial letter or paste denial text → AI analysis generated
- [ ] **Structured Appeal Packet** — generates successfully, can download/print
- [ ] **Financial Aid Tracker** (`/journey/financial-help`) — loads with aid categories
- [ ] All Pro features still accessible (Doctor Prep Sheet, Clinical Trials, etc.)

### Feature Gates
- [ ] Visit `/prior-auth` → redirected to `/dashboard/billing?upgrade=prior-auth`

---

## SECTION 6 — Professional Tier (`qa-professional@oncokind.com`) ← NEW

Log in as the Professional user.

### Dashboard Nav
- [ ] "Prior Auth" link with "NEW" badge visible in dashboard nav
- [ ] Click opens `/prior-auth` in a **new tab**

### Prior Auth Hub (`/prior-auth`)
- [ ] Standalone workspace loads (dark header, "OncoKind | Prior Auth Engine")
- [ ] "← Back to Dashboard" link works
- [ ] Stats row shows 0s (new account)
- [ ] Three workflow cards visible: Prior Authorization, Step Therapy Exception, Continued Stay Defense
- [ ] Filter tabs present: All, Prior, Step, Continued

### New Case — Prior Authorization
- [ ] Click "New Prior Auth" card → `/prior-auth/new?type=prior_auth`
- [ ] Multi-step form renders with 5 steps shown in progress bar
- [ ] Step 0 auto-skips to Step 1 (type pre-selected)
- [ ] Fill in Step 1: Patient Identifier, Facility Name, Facility State (e.g. PA), Prescribing Physician
- [ ] Fill in Step 2: Insurance Company (e.g. Aetna), Plan Name, Member ID (last 4)
- [ ] Fill in Step 3: Medication (e.g. Keytruda 200mg), ICD-10 (C34.10), Diagnosis (Lung Cancer), check Urgent
- [ ] Step 4 Review — all fields shown correctly
- [ ] Click "Generate Document →" — loading spinner shows
- [ ] Redirects to case workspace (`/prior-auth/[id]`)
- [ ] Generated document appears in textarea (400–600 words, formal letter format)
- [ ] Document contains "[" placeholder brackets for physician signature
- [ ] **Copy button** — copies to clipboard, button shows "Copied!"
- [ ] **Print / PDF button** — print dialog opens, document appears with disclaimer footer
- [ ] Amber disclaimer bar below document is present

### New Case — Step Therapy Exception
- [ ] Return to `/prior-auth`, click "New Step Therapy"
- [ ] Complete form: same facility info, medication (e.g. Risperidone), diagnosis (F20.9 Schizophrenia)
- [ ] Add 2 previously tried medications with checkboxes (ineffective, adverse reaction)
- [ ] Step 4 (State Law) — shows auto-detected PA law citation
- [ ] Generate — document cites the Pennsylvania Act 2018-146 statute
- [ ] Sidebar shows "State Law Applied" card with citation

### New Case — Continued Stay Defense
- [ ] Return to `/prior-auth`, click "New Continued Stay"
- [ ] Complete form with Admission Date, Functional Status description
- [ ] Generate — document uses InterQual-adjacent language ("meets criteria for skilled care")

### Denial Analyzer
- [ ] Open any existing case workspace
- [ ] Paste a sample denial letter (2–3 sentences minimum)
- [ ] Click "Analyze Denial" — returns structured 6-point analysis
- [ ] Response contains Denial Reason, Denial Code, Appeal Basis, Urgency Level, Missing Info, Next Step

### Status Tracking
- [ ] Open a case, change status dropdown from "Ready" to "Submitted" — saves without error
- [ ] Change status to "Approved" — outcome modal appears
- [ ] Add optional notes, click Confirm — status updates to Approved
- [ ] Case list on dashboard shows correct status badges

### Deletion
- [ ] Create a new Draft case (do not generate document)
- [ ] Verify it shows as Draft in case list
- [ ] (API-level only: DELETE endpoint only allows draft deletion — no UI delete button needed unless you added one)

### All Pro+Advocate features still work
- [ ] Doctor Prep Sheet still accessible
- [ ] Insurance Denial Defense still accessible

### Access Gate — Non-Professional
- Log out, log in as `qa-free@oncokind.com`
- [ ] Visit `/prior-auth` → redirected to `/dashboard/billing?upgrade=prior-auth`
- Log in as `qa-pro@oncokind.com`
- [ ] Visit `/prior-auth` → redirected to `/dashboard/billing?upgrade=prior-auth`

### AI Audit Log Verification (Supabase)
After generating any Prior Auth document, run in Supabase SQL Editor:
```sql
SELECT user_id, model, feature, created_at
FROM public.ai_audit_log
WHERE feature LIKE 'prior_auth_%'
ORDER BY created_at DESC
LIMIT 5;
```
- [ ] At least 1 row exists for each generation you ran
- [ ] `feature` column shows `prior_auth_prior_auth`, `prior_auth_step_therapy`, or `prior_auth_continued_stay`
- [ ] No raw prompt or response text stored (only hashes)

### No PHI Verification (Supabase)
```sql
SELECT patient_identifier, facility_name, payer_name, medication_name,
       ai_generated_document IS NOT NULL as has_doc
FROM public.prior_auth_cases
ORDER BY created_at DESC
LIMIT 5;
```
- [ ] `patient_identifier` is only a reference like "Room 14B" or initials (not a real name)
- [ ] No social security numbers, DOBs, or full patient names stored

---

## SECTION 7 — Admin / Enterprise (`qa-admin@oncokind.com`)

Log in as the Enterprise/Admin user.

### Admin Nav
- [ ] "Admin" link visible in dashboard nav
- [ ] `/admin/organizations` — page loads, organization list (may be empty in test)
- [ ] `/admin/community` — community moderation page loads

---

## SECTION 8 — Security & Privacy

### Row Level Security — RLS Isolation Test
Run in Supabase SQL Editor:
```sql
-- Confirm prior auth cases are isolated by user
SELECT p.email, count(c.id) as case_count
FROM public.profiles p
LEFT JOIN public.prior_auth_cases c ON c.user_id = p.id
WHERE p.email LIKE 'qa-%@oncokind.com'
GROUP BY p.email;
```
- [ ] Each user only has their own cases (cross-user data not visible)

### API Auth Check
- [ ] In browser console (logged out), run:
  `fetch('/api/prior-auth/cases').then(r => r.json()).then(console.log)`
- [ ] Returns `{ error: "Unauthorized" }` — not case data

### Tier Gate — API Level
- [ ] While logged in as `qa-free@oncokind.com`, run in browser console:
  `fetch('/api/prior-auth/cases').then(r => r.json()).then(console.log)`
- [ ] Returns `{ error: "Professional tier required" }` with 403 status

### Data Retention
- [ ] Go to `/dashboard/security` or account settings
- [ ] "Delete my data" option present (if implemented)
- [ ] Privacy Policy states raw report content is not retained after processing

---

## SECTION 9 — Navigation & Cross-Page

### Site Header (marketing pages)
- [ ] All 6 nav links work: How It Works, Features, Pricing, For Professionals, Community, Resources
- [ ] Logo links back to `/`
- [ ] "Sign In" and "Get Started" buttons work

### Site Footer (TrustFooter)
- [ ] 5 columns visible: Product, Platform, Company, For Professionals, Legal
- [ ] Cancer Support Community helpline present
- [ ] "Join Waitlist" link in footer works
- [ ] Copyright year shows current year (2026)
- [ ] `support@oncokind.com` link opens email client

### Dashboard Nav
- [ ] All links in nav work for logged-in user
- [ ] Professional users see Prior Auth link
- [ ] Non-professional users do NOT see Prior Auth link
- [ ] Language selector visible and functional

### 404 Page
- [ ] Visit `/this-does-not-exist` — custom 404 shows (not a blank white page)

---

## SECTION 10 — Mobile & Accessibility

Test on iPhone or Chrome DevTools mobile viewport (375px width):

### Mobile
- [ ] Homepage hero is readable, CTA buttons tappable (min 44px height)
- [ ] Pricing page — cards stack vertically, all readable
- [ ] Prior Auth form — all inputs usable on mobile keyboard
- [ ] Dashboard nav — mobile hamburger or scrollable nav works
- [ ] Prior Auth workspace — document textarea scrollable, Copy button works

### Accessibility
- [ ] Tab through homepage — focus states visible on all interactive elements
- [ ] No keyboard traps
- [ ] Images have alt text (check in DevTools → Accessibility panel)
- [ ] Minimum font size 16px on body copy (check in DevTools)
- [ ] Color contrast on sage green buttons passes 4.5:1 (check in DevTools → Lighthouse)

### Reduced Motion
- [ ] In System Preferences, enable "Reduce Motion"
- [ ] Reload homepage — Reveal animations are instant (no fade/slide)

---

## SECTION 11 — Performance (Lighthouse)

Run Lighthouse in Chrome DevTools → Lighthouse tab on these pages:

| Page | Target Performance | Target A11y | Target SEO |
|------|-------------------|-------------|------------|
| `/` | ≥ 90 | ≥ 95 | ≥ 95 |
| `/pricing` | ≥ 85 | ≥ 95 | ≥ 95 |
| `/prior-auth-pro` | ≥ 85 | ≥ 95 | ≥ 95 |
| `/about` | ≥ 85 | ≥ 95 | ≥ 90 |

- [ ] Homepage passes targets
- [ ] Pricing page passes targets
- [ ] Prior Auth Pro marketing page passes targets

---

## SECTION 12 — Email Flows

- [ ] Sign up with a real email → confirmation email received (if Resend configured)
- [ ] Sign up for waitlist → confirmation email received
- [ ] Waitlist email contains correct branding, no broken links
- [ ] Password reset email → link works, can reset password

---

## SECTION 13 — Stripe (Billing)

> Use Stripe test mode card: `4242 4242 4242 4242`, any future expiry, any CVC

- [ ] From Pricing page, click "Get Caregiver Pro" → Stripe checkout loads
- [ ] Complete test purchase → redirected back to dashboard
- [ ] Dashboard billing page shows active Pro subscription
- [ ] From Pricing page, click "Get Advocate" → Stripe checkout loads
- [ ] Subscription status visible in `/dashboard/billing`

---

## SECTION 14 — Error States

- [ ] Visit `/prior-auth/00000000-0000-0000-0000-000000000000` (fake ID) → 404 page shown
- [ ] In Prior Auth new case form, click Generate with empty required fields → error shown (or validation prevents submit)
- [ ] Disconnect internet, try to generate a Prior Auth document → error message shown (not silent failure)

---

## SECTION 15 — Final Pre-Launch Checklist

### Content
- [ ] No placeholder text (lorem ipsum, "TODO", "[Your Name]") anywhere on public pages
- [ ] All email addresses on site are real and monitored (`hello@oncokind.com`, `support@oncokind.com`)
- [ ] Calendly link (`https://calendly.com/oncokind-support`) opens and is live
- [ ] Founder video (`/about`) plays correctly — portrait crop fits container
- [ ] Copyright year is 2026

### Infrastructure
- [ ] `status.oncokind.com` (Instatus) is live and shows "All Systems Operational"
- [ ] Vercel deployment shows green (no build errors)
- [ ] Supabase project is on a paid plan (not free tier — needed for production traffic)
- [ ] `ANTHROPIC_API_KEY` is set in Vercel environment variables
- [ ] `RESEND_API_KEY` is set (for emails)
- [ ] All Stripe price IDs are set in Vercel env vars

### SEO
- [ ] Google Search Console: site submitted and verified
- [ ] `robots.txt` accessible at `https://oncokind.com/robots.txt`
- [ ] `sitemap.xml` accessible at `https://oncokind.com/sitemap.xml`
- [ ] OG image renders when URL pasted in Slack or Twitter

---

## Sign-Off

| Section | Tester | Date | Status |
|---------|--------|------|--------|
| 0 — Migrations | | | ☐ |
| 1 — Marketing Pages | | | ☐ |
| 2 — Auth Flow | | | ☐ |
| 3 — Free Tier | | | ☐ |
| 4 — Caregiver Pro | | | ☐ |
| 5 — Advocate | | | ☐ |
| 6 — Professional / KindAuth | | | ☐ |
| 7 — Admin | | | ☐ |
| 8 — Security | | | ☐ |
| 9 — Navigation | | | ☐ |
| 10 — Mobile & A11y | | | ☐ |
| 11 — Performance | | | ☐ |
| 12 — Email | | | ☐ |
| 13 — Stripe | | | ☐ |
| 14 — Error States | | | ☐ |
| 15 — Final Checklist | | | ☐ |

**Go/No-Go Decision:** __________________ Date: __________

---

*Generated by OncoKind Cursor Agent — June 2026*
