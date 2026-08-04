# OncoKind Site Review — Findings (July 2026)

Reviewed against `www.oncokind.com` directly. The product has moved a lot since
the June QA guide: pricing restructured, waitlist closed (site has launched),
signup form gained a name field, and a chunk of new marketing pages appeared
under `/features/*` and `/learn`. Most of it is solid. A handful of things
look like real bugs, not just "the guide is stale" — flagging those first.

## 🔴 Likely bugs — worth a look before wider launch push

1. **Two different site templates are live simultaneously.** `/`, `/pricing`,
   `/professional`, `/learn`, `/trust`, `/privacy`, `/terms`, `/support`,
   `/security`, `/mission`, `/signup`, `/login`, and `/waitlist` all share one
   nav + footer (8 nav items, 5-column footer, `support@oncokind.com`). But
   **`/about`, `/resources`, and `/community` render an entirely different,
   older nav + footer** (6 nav items including a "Caregiver Tools" link that
   doesn't exist elsewhere, a 4-column footer, and `hello@oncokind.com` as the
   contact address instead). `/resources` and `/community` also have a stray
   mobile bottom-tab bar (**Home / Timeline / Reports / Prep Sheet**) leaking
   into the page — that looks like an authenticated-app nav component
   rendering on a public, logged-out page.

   Practically: a visitor who clicks "Community" from the homepage footer
   lands on a page that looks like a different, older product. Same for
   "Founder Story" → `/about`. Since these are two of your highest-intent
   links (community + founder story), this is worth fixing before you drive
   real traffic. The test suite now has a dedicated `Site template
   consistency` check in `marketing.spec.ts` that fails on exactly this.

2. **`/features/empathy-filter` 404s** — and it's linked from the footer's
   "Platform" column on *every single new-template page*, plus the homepage's
   own "The Empathy Filter" feature card. Given the Empathy Filter is your
   core differentiator, this is probably the highest-value fix on this list.

3. **`robots.txt` almost certainly disallows `/prior-auth-pro` by accident.**
   I couldn't fetch `/prior-auth-pro` directly — my fetcher (which respects
   robots.txt) was blocked. I confirmed the same block applies to
   `/journey/second-opinion` (an authenticated app route, correctly blocked).
   That strongly suggests a rule like `Disallow: /prior-auth` is
   prefix-matching `/prior-auth-pro` too — robots.txt disallow rules match by
   path *prefix*, not exact path. If so, Google will never index your public
   KindAuth marketing page no matter what's in your sitemap. Fix: add an
   explicit `Allow: /prior-auth-pro` line before the `Disallow: /prior-auth`
   rule (ordering matters for most crawlers). `marketing.spec.ts` now checks
   this directly.

4. **"Forgot password" link is gone from `/login`.** The June guide called
   for it and it's not there anymore. Real regression, or intentionally
   removed pending a different flow? Either way, flagged as a failing (not
   fixme'd) test so it surfaces in every run until resolved.

5. **The "Start Advocate Plan →" button on `/pricing` doesn't pass a plan
   parameter** (`/signup`), while "Start Caregiver Pro →" correctly links to
   `/signup?plan=pro`. If your signup form pre-selects a plan from the query
   string, Advocate sign-ups are silently losing that pre-selection.

6. **The footer's "Join Waitlist" link is a dead end.** The waitlist itself
   now shows "The waitlist is now closed... OncoKind has launched!" with a
   button back to the homepage — but the footer CTA (present on every
   new-template page) still says "Join Waitlist" and sends people to a page
   whose whole message is "there's nothing to join here anymore." Low
   severity, easy fix — swap the footer link or copy.

## 🟡 Worth confirming (didn't fully verify, but see the pattern)

- `/community` shows 0 posts across all 4 categories and uses the old
  template's confusing nav pairing of **"Log In"** *and* **"Sign In"** as two
  separate links (both real links, "Sign In" actually points to `/signup` —
  mislabeled, since that's registration, not sign-in).
- `/security` is a good, detailed page but isn't linked from the new
  template's footer at all (only the old template links to it, under
  "Resources"). It's orphaned in the current nav.
- Two support inboxes are in play: `support@oncokind.com` (new template) and
  `hello@oncokind.com` (old template's "Contact" link). Confirm both are
  actually monitored, or consolidate.

## 🟢 Confirmed fixed since the June guide

- The pricing page **now has a working Monthly/Yearly toggle** ("2 months
  free") — this was flagged missing in the original guide.
- The pricing comparison table **now includes a Prior Auth Engine
  (KindAuth) row** — the June guide's QA notes specifically suggested adding
  this.

## Functional changes that just mean the tests needed updating (not bugs)

- **Pricing restructured**: Free ($0), Caregiver Pro ($39/mo), Advocate Plan
  ($49/mo, "Most Popular"), Professional ($999/mo, Book-a-Demo only — no more
  self-serve checkout for Professional tier).
- **Signup form gained a "Full name" field** (was email + password only).
- **Feature grid on the homepage is now 9 cards**, not 8 — Prior
  Authorization Engine was added as a 9th.
- **Waitlist flow is retired** — site has launched, so `/waitlist` shows a
  closed-state message instead of an email capture form.
- Nav is now: How It Works, Features, Pricing, For Professionals, Community,
  Resources (→ `/learn`), Log In, Get Started Free. Notably, **"Prior Auth
  Engine" only appears in the nav on the `/professional` page** — it's absent
  from the homepage/pricing/etc. nav. That's either an intentional
  page-specific nav or an inconsistency worth a decision either way; flagged
  as its own test so you'll see it either confirmed-consistent or
  confirmed-inconsistent on every run.

Everything above is reflected in the rewritten suite — see the updated
`README.md` for what's automated vs. what's called out as a known/flagged
issue.
