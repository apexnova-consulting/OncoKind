# TrialBridge AI

Production-ready HealthTech app: pathology translation (Clarity engine), trial matches (ClinicalTrials.gov v2), and appointment question generator. Next.js 14 (App Router), Supabase, Stripe, Tailwind, Shadcn/UI, Claude 3.5 Sonnet.

## Setup

1. **Clone and install**
   ```bash
   npm install
   ```

2. **Environment**
   - Copy `.env.example` to `.env.local`
   - Set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
   - Set `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_ID` (Pro subscription price)
   - Set `ANTHROPIC_API_KEY`
   - Optional: `NEXT_PUBLIC_APP_URL` (e.g. `https://yourdomain.com`) for Stripe redirects

3. **Supabase**
   - Run migrations: `supabase db push` or run `supabase/migrations/20250227000000_initial_schema.sql` in the SQL editor
   - Create a Storage bucket named `reports` (private). Add RLS: users can INSERT/SELECT their own objects (path prefix = `auth.uid()`)

4. **Stripe**
   - Create a subscription product and price; set `STRIPE_PRICE_ID`
   - Webhook: add endpoint `https://yourdomain.com/api/webhooks/stripe`, events `checkout.session.completed`, `customer.subscription.deleted`; set `STRIPE_WEBHOOK_SECRET`

5. **Run**
   ```bash
   npm run dev
   ```

## Deploy (Vercel)

- Connect repo; set all env vars from `.env.example`
- Supabase: add site URL and redirect URLs in Auth settings
- Stripe webhook: use production URL
- Build command: `npm run build`; output: default

## Features

- **Auth**: Sign up / Sign in (Supabase Auth); session refresh via middleware
- **Dashboard**: Pathology Translation (PDF → Claude summary), Top 3 Trial Matches (ClinicalTrials.gov v2 API), Appointment Question Generator
- **Reports**: List and detail; Doctor Prep Sheet download (Pro only)
- **Billing**: Pro upgrade (Stripe Checkout); portal link when subscribed
- **Trust footer**: “Not Medical Advice. Consult your Oncologist.” on every page
- **Error boundaries**: App and dashboard level for API timeouts / PDF failures

## Project structure

See `FILE_STRUCTURE.md`.
