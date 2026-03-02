# TrialBridge — Deployment Checklist

Use this list before and after deploy so the app is ready to launch.

---

## 1. Environment variables

- [ ] Copy `.env.example` to `.env.local` (local) and add all vars to your host (e.g. Vercel).
- [ ] **NEXT_PUBLIC_APP_URL** — Production URL, e.g. `https://yourdomain.com` (no trailing slash). Required for Stripe redirects and auth callbacks.
- [ ] **NEXT_PUBLIC_SUPABASE_URL** — From Supabase Dashboard → Settings → API.
- [ ] **NEXT_PUBLIC_SUPABASE_ANON_KEY** — Same place; safe to expose in client.
- [ ] **SUPABASE_SERVICE_ROLE_KEY** — Same place; **never** expose in client; only used server-side (webhooks, admin).
- [ ] **STRIPE_SECRET_KEY** — Stripe Dashboard → Developers → API keys (use live key for production).
- [ ] **STRIPE_WEBHOOK_SECRET** — From the webhook you create in step 4 below.
- [ ] **STRIPE_PRICE_ID** — From the subscription price you create in step 3 below (e.g. `price_xxx`).
- [ ] **ANTHROPIC_API_KEY** — From Anthropic console (Clarity engine).
- [ ] **ENCRYPTION_KEY** (optional) — Only if you implement app-level encryption for `encrypted_summary`.

---

## 2. Supabase — Database

- [ ] Run migrations in order:
  - [ ] `supabase/migrations/20250227000000_initial_schema.sql` (profiles, medical_reports, RLS, triggers).
  - [ ] `supabase/migrations/20250227000001_storage_reports_bucket.sql` (reports bucket + storage RLS).
- [ ] Confirm in Table Editor: `profiles` and `medical_reports` exist; RLS is enabled.
- [ ] Confirm trigger: sign up a test user and check that a row appears in `profiles`.

---

## 3. Supabase — Auth

- [ ] **Authentication → URL Configuration**:
  - [ ] **Site URL**: your production URL (e.g. `https://yourdomain.com`).
  - [ ] **Redirect URLs**: add:
    - `https://yourdomain.com/callback`
    - `https://yourdomain.com/**`
    - (Optional) `http://localhost:3000/callback` for local testing.
- [ ] **Authentication → Providers**: enable Email (or the providers you use); disable any you don’t need.
- [ ] If using email confirmations: set **Confirm email** on or off and adjust UX (e.g. “Check your inbox”) as needed.

---

## 4. Supabase — Storage

- [ ] Bucket **reports** exists (created by migration `20250227000001`).
- [ ] Bucket is **private** (not public).
- [ ] RLS on `storage.objects`: users can only INSERT/SELECT objects whose path starts with their `auth.uid()` (e.g. `{user_id}/*`). Policies are in the migration; verify in Storage → Policies.

---

## 5. Stripe — Product & price

- [ ] Create a **Product** (e.g. “TrialBridge Pro”).
- [ ] Create a **Recurring price** (monthly/yearly) and copy the **Price ID** (`price_xxx`).
- [ ] Set **STRIPE_PRICE_ID** in your env to that value.

---

## 6. Stripe — Webhook

- [ ] **Developers → Webhooks → Add endpoint**.
- [ ] **Endpoint URL**: `https://yourdomain.com/api/webhooks/stripe`.
- [ ] **Events**: select `checkout.session.completed` and `customer.subscription.deleted`.
- [ ] Create and copy the **Signing secret** (`whsec_xxx`) into **STRIPE_WEBHOOK_SECRET**.
- [ ] After first deploy: send a test event or run a test checkout and confirm the endpoint returns 200 and `profiles.subscription_status` updates in Supabase.

---

## 7. PWA — Icons & installability

- [ ] Add app icons under **public/icons/**:
  - [ ] **icon-192.png** (192×192 px).
  - [ ] **icon-512.png** (512×512 px).
- [ ] Use [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator) or your design tool; see `public/icons/README.md`.
- [ ] After deploy (HTTPS): on Android Chrome, confirm “Add to Home Screen” / Install prompt; on iOS Safari, confirm “Add to Home Screen” and that the app opens in standalone (no browser UI).
- [ ] Optional: test offline — open app, go to Dashboard, turn off network; reload and confirm cached shell or graceful message.

---

## 8. Build & deploy (e.g. Vercel)

- [ ] Connect repo to Vercel (or your host).
- [ ] **Build command**: `npm run build`.
- [ ] **Output directory**: leave default (Next.js auto).
- [ ] **Install command**: `npm install`.
- [ ] Add every env var from section 1 (use **Production** and optionally **Preview**).
- [ ] Deploy; fix any build errors (missing env, TypeScript, etc.).
- [ ] Set **Production domain** (e.g. `yourdomain.com`) and ensure DNS is correct.

---

## 9. Post-deploy — Smoke tests

- [ ] **Home**: Load `/`; sign-in and sign-up links work.
- [ ] **Auth**: Sign up → redirect to dashboard; sign out → redirect home; sign in again works.
- [ ] **Dashboard**: All three cards load (Pathology, Trials, Questions).
- [ ] **Pathology**: Upload a small PDF → processing runs → summary appears; new report appears under Reports.
- [ ] **Reports**: List shows reports; opening one shows summary and Doctor Prep Sheet (or Pro upsell).
- [ ] **Billing**: Upgrade to Pro → Stripe Checkout → success redirect; `profiles.subscription_status` = `pro`; Doctor Prep Sheet is downloadable.
- [ ] **Webhook**: Cancel subscription (or use Stripe test clock); confirm `subscription_status` becomes `cancelled`.
- [ ] **PWA**: Add to Home Screen on a phone; open from home screen; theme color and standalone display look correct.

---

## 10. Security & compliance

- [ ] **Service role key**: Only in server env; never in client bundle or `NEXT_PUBLIC_*`.
- [ ] **HTTPS**: Entire site and all redirect URLs use HTTPS in production.
- [ ] **Trust footer**: “Not Medical Advice. Consult your Oncologist.” is visible on every page (already in layout).
- [ ] If handling real health data: review HIPAA/regional requirements (BAA, encryption, access logs). Current setup uses Supabase RLS and PII scrubbing before the LLM; document and extend as needed.

---

## 11. Optional — Before launch

- [ ] **Error monitoring**: e.g. Vercel Analytics, Sentry, or similar for runtime errors.
- [ ] **Rate limiting**: Consider rate limits on `/api/process-report` and `/api/questions` (e.g. Vercel or Supabase Edge Functions).
- [ ] **Terms & Privacy**: Add `/terms` and `/privacy` if required; link in footer.
- [ ] **Custom domain**: SSL and DNS configured; redirect HTTP → HTTPS.

---

## Quick reference — Env vars to set in production

| Variable | Where to get it |
|----------|------------------|
| NEXT_PUBLIC_APP_URL | Your production URL |
| NEXT_PUBLIC_SUPABASE_URL | Supabase → Settings → API |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Supabase → Settings → API |
| SUPABASE_SERVICE_ROLE_KEY | Supabase → Settings → API |
| STRIPE_SECRET_KEY | Stripe → Developers → API keys |
| STRIPE_WEBHOOK_SECRET | Stripe → Webhooks → your endpoint |
| STRIPE_PRICE_ID | Stripe → Products → your price |
| ANTHROPIC_API_KEY | Anthropic console |

---

When every item above is done, the app is ready to launch. Re-run this checklist after any major config or env change.
