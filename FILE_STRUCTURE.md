# TrialBridge AI — File Structure (Production Launch)

```
TrialBridge/
├── .env.example
├── .env.local                    # (gitignored) local env vars
├── .eslintrc.json
├── FILE_STRUCTURE.md             # this file
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
│
├── app/
│   ├── layout.tsx                # root layout, Trust Footer
│   ├── page.tsx                  # landing / marketing
│   ├── globals.css
│   ├── error.tsx                 # Error Boundary (app-level)
│   ├── not-found.tsx
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── route.ts          # Supabase auth callback
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx            # dashboard layout, nav
│   │   ├── dashboard/
│   │   │   └── page.tsx          # main dashboard
│   │   │   # Cards: Pathology Translation, Top 3 Trial Matches, Appointment Question Generator
│   │   ├── reports/
│   │   │   ├── page.tsx          # list reports
│   │   │   └── [id]/
│   │   │       └── page.tsx      # single report + Doctor Prep Sheet (Pro-gated)
│   │   └── error.tsx             # dashboard Error Boundary
│   │
│   └── api/
│       ├── process-report/
│       │   └── route.ts          # PDF → extract → scrub PII → Claude → JSON
│       └── webhooks/
│           └── stripe/
│               └── route.ts      # checkout.session.completed, customer.subscription.deleted
│
├── components/
│   ├── ui/                       # Shadcn/UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── TrustFooter.tsx       # "Not Medical Advice. Consult your Oncologist."
│   │   └── DashboardNav.tsx
│   ├── dashboard/
│   │   ├── PathologyTranslationCard.tsx
│   │   ├── TrialMatchesCard.tsx  # Top 3 (ClinicalTrials.gov v2 API)
│   │   └── AppointmentQuestionGenerator.tsx
│   └── reports/
│       └── DoctorPrepSheet.tsx   # Pro-gated download
│
├── lib/
│   ├── supabase-server.ts        # createServerClient / server-side Supabase
│   ├── supabase-client.ts        # browser Supabase client
│   ├── stripe.ts                 # Stripe server SDK + helpers
│   └── medical-utils.ts          # PII scrubbing (regex: names, DOB, SSN)
│
├── actions/
│   └── report-actions.ts         # Server Action: scrub PII before LLM
│
├── supabase/
│   ├── config.toml               # (optional) local Supabase config
│   └── migrations/
│       └── 20250227000000_initial_schema.sql   # profiles, medical_reports, RLS, pgcrypto
│
└── public/
    └── (static assets)
```

## Env vars (see `.env.example`)

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ANTHROPIC_API_KEY`
- `ENCRYPTION_KEY` (optional; for `encrypted_summary` if using app-level encryption)

## Key entry points

| Path | Purpose |
|------|--------|
| `app/api/process-report/route.ts` | Clarity engine: PDF → text → scrub → Claude → JSON |
| `app/api/webhooks/stripe/route.ts` | Stripe webhooks → update `profiles.subscription_status` |
| `lib/medical-utils.ts` | PII scrub (names, DOB, SSN) before LLM |
| `actions/report-actions.ts` | Server Action wrapping scrub + any report write |
| `supabase/migrations/*.sql` | Schema: profiles, medical_reports, RLS, encryption column |
