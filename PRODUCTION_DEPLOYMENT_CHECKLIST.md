# OncoKind — Production Deployment Checklist

**Use this checklist** once you have purchased your domain (oncokind.com) and are ready to deploy to Vercel. Complete each section in order.

---

## Phase 1: Domain & DNS

- [ ] **Purchase domain** (oncokind.com) from your registrar (Namecheap, GoDaddy, Google Domains, etc.)
- [ ] **Note registrar login** for DNS management
- [ ] **Create Vercel account** (or use existing) and connect GitHub/GitLab/Bitbucket repo
- [ ] **Deploy to Vercel** with default Vercel subdomain (e.g. `oncokind.vercel.app`) — do this *before* adding custom domain
- [ ] **Add custom domain** in Vercel: Project Settings → Domains → Add `oncokind.com` and `www.oncokind.com`
- [ ] **Configure DNS** at your registrar:
  - For **A record**: `76.76.21.21` (Vercel IP) or use CNAME if instructed
  - For **CNAME** (www): `cname.vercel-dns.com`
  - Or use **Vercel Nameservers** (recommended): replace registrar nameservers with Vercel's
- [ ] **Wait for propagation** (up to 48 hours; often &lt; 1 hour)
- [ ] **Verify SSL** — Vercel auto-provisions Let's Encrypt; confirm HTTPS works for both apex and www

---

## Phase 2: Environment Variables (Vercel)

Add all variables in **Vercel → Project → Settings → Environment Variables**. Use **Production** (and Preview if desired).

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_APP_URL` | `https://oncokind.com` (no trailing slash) | Your production URL |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (never expose) | Supabase Dashboard → Settings → API |
| `STRIPE_SECRET_KEY` | Live secret key for production | Stripe Dashboard → Developers → API keys |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | Stripe → Webhooks (create in Phase 5) |
| `STRIPE_PRICE_ID` | Pro subscription price ID | Stripe → Products → Pro price |
| `STRIPE_PRICE_ID_ENTERPRISE` | (Optional) Enterprise price ID | Stripe → Products → Enterprise price |
| `ANTHROPIC_API_KEY` | Claude API key | Anthropic Console |
| `ENCRYPTION_KEY` | 32-byte base64 key | Run: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |

- [ ] Copy each variable from `.env.example` template
- [ ] Generate and set `ENCRYPTION_KEY` (required for patient_reports encryption)
- [ ] **Never** commit `.env.local` or secrets to git

---

## Phase 3: Supabase — Migrations & Config

- [ ] **Run migrations** in order (Supabase Dashboard → SQL Editor, or `supabase db push`):
  1. `20250227000000_initial_schema.sql`
  2. `20250227000001_storage_reports_bucket.sql`
  3. `20250302000000_oncokind_v1_production.sql`
- [ ] **Verify tables**: `profiles`, `medical_reports`, `patient_reports`, `enterprise_patient_assignments`
- [ ] **Verify RLS** is enabled on all tables (Table Editor → each table → RLS)
- [ ] **Auth → URL Configuration**:
  - **Site URL**: `https://oncokind.com`
  - **Redirect URLs**: Add:
    - `https://oncokind.com/callback`
    - `https://oncokind.com/**`
    - `https://www.oncokind.com/callback`
    - `https://www.oncokind.com/**`
    - (Keep `http://localhost:3000/callback` for local dev)
- [ ] **Auth → Providers**: Enable Email (and any others you need)
- [ ] **Storage**: Confirm `reports` bucket exists; policies allow user-scoped paths only

---

## Phase 4: Stripe — Products & Checkout

- [ ] **Enable Stripe Tax** (Stripe Dashboard → Settings → Tax)
- [ ] **Create products**:
  - **Pro**: Monthly or annual subscription; copy Price ID (`price_xxx`) → `STRIPE_PRICE_ID`
  - **Enterprise** (optional): Custom or higher-tier; copy Price ID → `STRIPE_PRICE_ID_ENTERPRISE`
- [ ] **Create webhook** (Phase 5) *after* first deploy so URL exists

---

## Phase 5: Stripe Webhook (After First Deploy)

- [ ] **Deploy to Vercel** so `https://oncokind.com` is live
- [ ] **Stripe Dashboard → Developers → Webhooks → Add endpoint**
- [ ] **Endpoint URL**: `https://oncokind.com/api/webhooks/stripe`
- [ ] **Events to send**:
  - `checkout.session.completed`
  - `invoice.payment_succeeded`
  - `customer.subscription.deleted`
- [ ] **Create** and copy **Signing secret** (`whsec_xxx`) → add as `STRIPE_WEBHOOK_SECRET` in Vercel
- [ ] **Redeploy** so new env var is picked up
- [ ] **Test**: Run a test checkout; confirm webhook returns 200; verify `profiles.subscription_tier` updates in Supabase

---

## Phase 6: PWA & Meta

- [ ] **Icons**: Ensure `public/icons/icon-192.png` and `icon-512.png` exist (see `public/icons/README.md`)
- [ ] **manifest.json**: Update `name` and `short_name` to "OncoKind"
- [ ] **Layout metadata**: Confirm `title` and `description` in `app/layout.tsx` reflect OncoKind
- [ ] **Open Graph**: Add og:image for social shares (optional but recommended)

---

## Phase 7: Security Headers (Optional)

- [ ] Add **secure headers** in `next.config.js` (CSP, HSTS, X-Frame-Options) — see `next.config.js` if configured
- [ ] **Rate limiting**: Consider Vercel Edge Config or Upstash for `/api/process-report` and pathology processing
- [ ] **Sentry** (optional): Add for error monitoring; ensure no PHI in logs or context

---

## Phase 8: Post-Deploy Smoke Tests

Run these after full deployment:

- [ ] **Homepage** (`/`): Loads; hero and CTAs visible; nav works
- [ ] **Auth flow**: Sign up → email → redirect; Sign in → Dashboard
- [ ] **Dashboard**: Pathology upload, Reports list, Billing card load
- [ ] **Pathology upload**: Upload small PDF → processing completes → structured result stored (no raw text)
- [ ] **Reports**: Open a report; Doctor Prep PDF (Pro) or upsell (Free) works
- [ ] **Billing**: Upgrade to Pro → Stripe Checkout → success → `subscription_tier` = `pro`
- [ ] **Webhook**: Cancel subscription in Stripe; confirm `subscription_tier` reverts
- [ ] **Security page** (`/security`): Renders; no console errors
- [ ] **PWA**: On mobile Chrome/Safari, "Add to Home Screen"; open from home screen; standalone display correct
- [ ] **HTTPS**: All pages load over HTTPS; no mixed content warnings

---

## Phase 9: Compliance & Legal

- [ ] **Clinical disclaimer** visible on first login and every PDF export (modal)
- [ ] **Terms of Service** (`/terms`) — add page and link in footer
- [ ] **Privacy Policy** (`/privacy`) — add page; document data handling, Supabase, Stripe, Anthropic
- [ ] **BAA**: If handling real PHI, execute Business Associate Agreement with Supabase (and any other processors)
- [ ] **Trust footer**: "Not Medical Advice. Consult your Oncologist." on every page

---

## Quick Reference — Post-Launch

| Item | URL / Location |
|------|----------------|
| Vercel dashboard | vercel.com/dashboard |
| Supabase dashboard | supabase.com/dashboard |
| Stripe dashboard | dashboard.stripe.com |
| Auth callback | https://oncokind.com/callback |
| Webhook endpoint | https://oncokind.com/api/webhooks/stripe |

---

## Rollback

If deployment fails or issues arise:

1. **Revert deploy** in Vercel (Deployments → ... → Rollback)
2. **Fix env vars** if misconfigured; redeploy
3. **Check Supabase logs** for RLS or migration issues
4. **Check Stripe webhook logs** for failed events
5. **Review Vercel function logs** for runtime errors

---

*Complete this checklist before launch. Re-run after major config changes.*
