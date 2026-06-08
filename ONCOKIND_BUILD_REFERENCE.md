# OncoKind — Complete Build Reference
**Last updated:** June 8, 2026
**Author:** Mike Nielson, Founder
**Document purpose:** Full technical reference for the OncoKind platform — features, structure,
database schema, services, and environment configuration.

---

## TABLE OF CONTENTS

1. [Product Overview](#1-product-overview)
2. [Tech Stack — Services & Apps](#2-tech-stack--services--apps)
3. [Environment Variables](#3-environment-variables)
4. [Database — Supabase Schema](#4-database--supabase-schema)
5. [Application Structure — All Pages](#5-application-structure--all-pages)
6. [API Routes](#6-api-routes)
7. [Feature Inventory](#7-feature-inventory)
8. [Component Library](#8-component-library)
9. [Pricing Tiers](#9-pricing-tiers)
10. [AI Integration](#10-ai-integration)
11. [Security & Compliance](#11-security--compliance)
12. [Pre-Launch Waitlist System](#12-pre-launch-waitlist-system)
13. [SEO & Content Structure](#13-seo--content-structure)
14. [Internationalization](#14-internationalization)
15. [Infrastructure & Deployment](#15-infrastructure--deployment)

---

## 1. PRODUCT OVERVIEW

**OncoKind** is an AI-powered cancer navigation platform built exclusively for family caregivers —
the adult children, spouses, and siblings who become the primary support person when someone they
love is diagnosed with cancer.

**Core mission:** Give every family the clarity they deserve. Translate the medical system into
plain English. Prepare caregivers for every appointment. Remove survival statistics and fear-based
language from every output via a proprietary Empathy Filter.

**Target user:** Adult children or spouses of cancer patients, ages 35–65. Navigating a cancer
diagnosis for the first time. Overwhelmed but trying.

**Competitive differentiation:** Built for the family beside the patient, not the patient alone.
The Empathy Filter — a proprietary system that removes survival statistics and fear-based language
from every AI-generated output — is unique in the market. No direct competitor has built this.

**Founder:** Mike Nielson. Active caregiver for his mother (Stage 4 metastatic cancer). Personal
history with the disease spanning grandmother (age 9), grandfather (age 15), father (age 16),
and cousin (age 28).

**Revenue targets:** $250K–$500K ARR within Year 1–2.

---

## 2. TECH STACK — SERVICES & APPS

### Core Framework
| Service | Role | Version |
|---|---|---|
| **Next.js** | Full-stack React framework, App Router, server components | 14.2.18 |
| **React** | UI library | 18.3.x |
| **TypeScript** | Type-safe development | 5.6.x |
| **Tailwind CSS** | Utility-first styling | 3.4.x |

### Backend & Database
| Service | Role |
|---|---|
| **Supabase** | Postgres database, authentication, row-level security, storage |
| **Supabase Auth** | Email/password authentication, MFA (TOTP) |
| **Supabase Storage** | Report file storage (reports bucket) |
| **Supabase SSR** | Server-side authentication in Next.js App Router |

### AI
| Service | Role |
|---|---|
| **Anthropic Claude** | Primary AI model for all report processing, summaries, prep sheets, insurance appeals, and care navigation |
| **@anthropic-ai/sdk** | Official Anthropic SDK | v0.32.x |

### Payments
| Service | Role |
|---|---|
| **Stripe** | Subscription billing, checkout sessions, webhook handling |
| **stripe (npm)** | Official Stripe SDK | v17.x |

### Email
| Service | Role |
|---|---|
| **Resend** | Transactional email (waitlist confirmation, notifications) |

### Deployment & Hosting
| Service | Role |
|---|---|
| **Vercel** | Hosting, CI/CD deployment, edge functions, serverless API routes |
| **GitHub** | Source code repository (`apexnova-consulting/OncoKind`) |

### External Data
| Service | Role |
|---|---|
| **ClinicalTrials.gov** | Real-time clinical trial matching data |
| **Playwright / Chromium** | Serverless browser for financial aid scraping |

### External Tools (non-code)
| Service | Role |
|---|---|
| **Calendly** (`calendly.com/oncokind-support`) | Professional plan demo booking |
| **Instatus** (`status.oncokind.com`) | Public system status page |
| **Google Search Console** | Sitemap submission and SEO monitoring |

### Key NPM Packages
| Package | Purpose |
|---|---|
| `framer-motion` | Page transitions, scroll animations, reduced-motion support |
| `lucide-react` | Icon library |
| `class-variance-authority` | Component variant system (buttons, etc.) |
| `pdf-parse` | PDF text extraction from uploaded reports |
| `@sparticuz/chromium` | Serverless Chromium for Playwright scraping on Vercel |
| `next/font` | Google Fonts (Lora + DM Sans) with zero layout shift |
| `tailwind-merge` | Safe Tailwind class merging |

---

## 3. ENVIRONMENT VARIABLES

All variables are set in **Vercel** project settings. Local development uses `.env.local`.

### Required — App will not function without these
```
NEXT_PUBLIC_SUPABASE_URL            Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY       Supabase public anon key
SUPABASE_SERVICE_ROLE_KEY           Supabase service role key (server-only, bypasses RLS)
ANTHROPIC_API_KEY                   Anthropic Claude API key
STRIPE_SECRET_KEY                   Stripe secret key
STRIPE_WEBHOOK_SECRET               Stripe webhook signing secret
NEXT_PUBLIC_APP_URL                 Full URL of the app (https://www.oncokind.com)
ENCRYPTION_KEY                      AES encryption key for sensitive data at rest
```

### Required — Payments (at least one pair needed for checkout)
```
STRIPE_PRICE_ID_PRO_MONTHLY         Stripe Price ID — Caregiver Pro, monthly ($19)
STRIPE_PRICE_ID_PRO_YEARLY          Stripe Price ID — Caregiver Pro, yearly ($190)
STRIPE_PRICE_ID_ADVOCATE_MONTHLY    Stripe Price ID — Advocate Plan, monthly ($49)
STRIPE_PRICE_ID_ADVOCATE_YEARLY     Stripe Price ID — Advocate Plan, yearly ($490)
STRIPE_PRICE_ID_ENTERPRISE_UNLIMITED  Stripe Price ID — Professional, unlimited
STRIPE_PRICE_ID_ENTERPRISE_PER_SEAT   Stripe Price ID — Professional, per seat
```

### Optional — Degrade gracefully if not set
```
RESEND_API_KEY                      Resend API key — enables waitlist confirmation emails
RESEND_FROM_EMAIL                   From address for transactional emails
WAITLIST_END_DATE                   ISO date when waitlist closes (default: 2026-06-30T23:59:59Z)
NEXT_PUBLIC_WAITLIST_ENABLED        Set to "false" to instantly disable waitlist UI everywhere
NEXT_PUBLIC_NCCN_GUIDELINES_VERSION  NCCN version label shown in AI output citations
NEXT_PUBLIC_CLINICAL_TRIALS_LAST_VERIFIED_AT  Last verified date for clinical trial data
FINANCIAL_AID_CRON_SECRET           Secret for financial aid sync cron job
FINANCIAL_AID_SCRAPER_MODE          "live" | "mock" — controls whether scraper runs live
FINANCIAL_AID_SCRAPER_USER_AGENT    User agent string for scraper requests
CHECK_IN_CRON_SECRET                Secret for appointment reminder cron job
CRON_SECRET                         General cron authorization secret
ADMIN_EMAILS                        Comma-separated list of admin email addresses
PLAYWRIGHT_EXECUTABLE_PATH          Custom Chromium path (auto-detected on Vercel)
NEXT_PUBLIC_WAITLIST_END_DATE       Client-side waitlist expiry (mirrors WAITLIST_END_DATE)
```

---

## 4. DATABASE — SUPABASE SCHEMA

Supabase (Postgres) is the primary database. All tables use Row Level Security (RLS).
Service-role access is used only in API routes for operations that must bypass RLS (e.g., waitlist,
webhooks, admin).

### Migration History
```
20250227000000_initial_schema.sql              Core profiles and initial setup
20250227000001_storage_reports_bucket.sql      Supabase Storage bucket for reports
20250302000000_oncokind_v1_production.sql      V1 production schema
20260308000000_care_timeline_entries.sql       Care timeline feature
20260413000000_advocacy_financial_navigation_foundation.sql  Financial aid tables
20260413010000_insurance_navigator_and_advocate_tier.sql     Insurance navigation
20260413020000_security_mfa_and_immutable_audit.sql          MFA + audit logging
20260413030000_restrict_financial_aid_funds_rls.sql          RLS hardening
20260416000000_patient_reports_schema_backfill.sql           Reports schema update
20260503160000_production_update_guide_features.sql          Feature flags
20260504143000_seed_launch_community_posts.sql               Community seed data
20260531120000_waitlist.sql                                  Pre-launch waitlist
```

### Tables

#### `profiles`
User profile linked 1:1 to Supabase Auth user.
Fields: id (FK → auth.users), full_name, email, subscription_tier, organization_id, created_at, updated_at.

#### `patient_reports` / `medical_reports`
Stores the AI-generated outputs from uploaded reports. Raw report content is NOT stored — only the
processed Cancer Profile summary and metadata.
Fields: id, user_id, cancer_type_inferred, stage, biomarkers (jsonb), summary, raw_text_hash,
created_at, source_filename, processed_at.

#### `prep_sheet_appointments`
Appointments for which a Doctor Prep Sheet has been generated.
Fields: id, user_id, report_id, appointment_date, doctor_name, questions (jsonb), notes, created_at.

#### `appointment_check_ins`
Records of appointment check-in sessions with AI explanation.
Fields: id, user_id, appointment_id, explanation, mood_before, mood_after, notes, created_at.
Note: created_at is immutable by design (cannot be altered after insert).

#### `care_timeline_entries`
Persistent care journal — diagnoses, treatments, milestones.
Fields: id, user_id, entry_type, title, description, entry_date, is_milestone, created_at.

#### `financial_aid_funds`
Master list of financial aid programs, co-pay assistance, and foundation grants.
Fields: id, name, description, eligibility_criteria, cancer_types (array), url, organization,
is_active, last_synced_at.

#### `financial_aid_sync_runs`
Log of financial aid data sync operations.
Fields: id, run_at, records_updated, status, error_message.

#### `user_financial_aid_matches`
User-specific matched financial aid programs based on diagnosis.
Fields: id, user_id, fund_id, matched_at, match_score, is_saved.

#### `insurance_navigation_cases`
Insurance denial cases and appeal progress.
Fields: id, user_id, denial_reason, denial_text, appeal_text, status, created_at, updated_at.

#### `community_threads`
Community discussion posts (caregiver-only moderated forum).
Fields: id, user_id, category, title, body, is_pinned, is_locked, created_at.

#### `community_replies`
Replies to community threads.
Fields: id, thread_id, user_id, body, created_at.

#### `community_reactions`
Emoji reactions on threads/replies.
Fields: id, user_id, target_id, target_type, reaction, created_at.

#### `community_flags`
Moderation flags on community content.
Fields: id, user_id, target_id, target_type, reason, resolved, created_at.

#### `quiet_room_journal_entries`
Private emotional journal entries from the Quiet Room feature.
Fields: id, user_id, body, mood_score, created_at.
Note: Encrypted at rest using AES key.

#### `caregiver_mood_entries`
Mood check-in data (separate from journal).
Fields: id, user_id, mood_score, notes, created_at.

#### `ai_audit_log`
Immutable log of every AI call — model used, input hash, output hash, user_id, cost estimate.
Fields: id, user_id, model, prompt_hash, response_hash, feature, created_at.
Note: No DELETE or UPDATE policy — append-only for compliance.

#### `organizations`
Enterprise/Professional tier organizations (multi-patient dashboards).
Fields: id, name, owner_id, branding (jsonb), created_at, subscription_tier.

#### `enterprise_patient_assignments`
Links enterprise users to patients they are navigating for.
Fields: id, organization_id, patient_user_id, assigned_by, created_at.

#### `waitlist`
Pre-launch email capture. Service-role writes only, no public read access.
Fields: id, email (unique), name, source ('banner' | 'page' | 'footer'), confirmed, created_at.

### Supabase Storage Buckets
```
reports     Private bucket for uploaded pathology report files.
            Access: authenticated users only, their own files.
            Retention: Files are deleted after processing (zero raw PHI retention).
```

---

## 5. APPLICATION STRUCTURE — ALL PAGES

### Authentication (`/app/(auth)/`)
| Route | Description |
|---|---|
| `/login` | Email + password login |
| `/signup` | New account creation with optional name |
| `/mfa` | Multi-factor authentication (TOTP) challenge page |

### Marketing (`/app/(marketing)/`)
All marketing pages share the `SiteHeader`, `WaitlistBanner`, and `TrustFooter`.

| Route | Description |
|---|---|
| `/` | Homepage — primary conversion page |
| `/about` | Founder story, principles, visual timeline, partner placeholder |
| `/pricing` | 4-tier pricing with comparison table and FAQ |
| `/waitlist` | Dedicated pre-launch waitlist signup page |
| `/professional` | B2B landing page for care navigators and patient advocates |
| `/mission` | Company mission statement |
| `/community` | Community hub — caregiver discussion forum |
| `/community/[category]` | Category-specific community thread listing |
| `/community/[category]/[thread]` | Individual thread with replies |
| `/community/new-post` | Create a new community post (Advocate plan required) |
| `/learn` | SEO content hub — index of all explainer articles |
| `/learn/[slug]` | Individual SEO article (20 articles, JSON-LD schema) |
| `/resources` | Legacy resources page |
| `/resources/[slug]` | Individual resource article |
| `/features/doctor-prep-sheet` | Doctor Prep Sheet feature detail page |
| `/features/clinical-trial-matching` | Clinical Trial Matching feature detail page |
| `/features/insurance-denial-defense` | Insurance Denial Defense feature detail page |
| `/empathy-filter` | Empathy Filter explanation page |
| `/trust` | Trust Center — full privacy and data practices page |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |
| `/security` | Security practices page |
| `/support` | Support contact page with Instatus link |

### Dashboard (`/app/(dashboard)/`)
Requires authenticated session. Protected by middleware.

| Route | Description |
|---|---|
| `/dashboard` | Main dashboard — overview of care status |
| `/dashboard/billing` | Subscription management via Stripe |
| `/dashboard/security` | MFA setup, account security settings |
| `/journey` | Care Journey hub — the primary user workspace |
| `/journey/ai-navigator` | AI Care Navigator — freeform Q&A about the diagnosis |
| `/journey/diagnosis/[id]` | Detailed diagnosis view for a specific report |
| `/journey/documents` | Document management |
| `/journey/financial-help` | Financial aid matching and tracking |
| `/journey/insurance-support` | Insurance denial defense workspace |
| `/journey/second-opinion` | Second Opinion packet builder |
| `/journey/timeline` | Care Timeline — chronological journey record |
| `/journey/trials` | Clinical trial matching |
| `/journey/check-in/[appointment_id]` | Appointment check-in with AI explanation |
| `/reports` | All uploaded reports listing |
| `/reports/[id]` | Individual report view with Cancer Profile |
| `/quiet-room` | Private emotional support space — journal and mood tracking |
| `/admin/community` | Admin: community moderation panel |
| `/admin/organizations` | Admin: enterprise organization management |

---

## 6. API ROUTES

All routes are in `/app/api/`. Server-side only.

| Route | Method | Purpose |
|---|---|---|
| `/api/auth/signup` | POST | New user registration via Supabase Auth |
| `/api/auth/login` | POST | Email/password login |
| `/api/process-report` | POST | Main AI pipeline — scrubs PII, generates Cancer Profile + Prep Sheet |
| `/api/reports/upload` | POST | Accepts PDF/image, extracts text, triggers processing |
| `/api/questions` | POST | Generates AI appointment questions for a report |
| `/api/trials` | GET | Fetches clinical trial matches from ClinicalTrials.gov |
| `/api/prep-appointments` | GET / POST | Manages appointment prep sheet records |
| `/api/check-ins` | GET / POST | Appointment check-in sessions |
| `/api/check-ins/send-reminders` | POST | Cron-triggered appointment reminder emails |
| `/api/care-timeline` | GET / POST / DELETE | CRUD for care timeline entries |
| `/api/insurance/decode` | POST | AI decodes an insurance denial reason |
| `/api/insurance/appeal` | POST | AI generates a structured appeal packet |
| `/api/advocacy/funding/sync` | POST | Cron-triggered financial aid data sync (Playwright scraper) |
| `/api/community/threads` | GET / POST | Community thread listing and creation |
| `/api/community/replies` | GET / POST | Replies to threads |
| `/api/community/reactions` | POST / DELETE | Emoji reactions |
| `/api/community/flags` | POST | Flag content for moderation |
| `/api/checkout` | POST | Creates a Stripe checkout session |
| `/api/webhooks/stripe` | POST | Handles Stripe subscription events (fulfillment, cancellation) |
| `/api/quiet-room/journal` | GET / POST | Private journal entries (encrypted) |
| `/api/quiet-room/mood` | GET / POST | Mood tracking entries |
| `/api/security/mfa/state` | GET | Returns MFA enrollment status for a user |
| `/api/admin/organizations` | GET / POST | Admin: manage enterprise organizations |
| `/api/waitlist` | POST | Pre-launch waitlist signup (service role, Resend email) |
| `/api/diagnostics/runtime` | GET | Internal health check for AI and upload pipelines |
| `/api/test/advocacy/seed` | POST | Dev-only: seed financial aid test data |
| `/api/test/zero-retention-status` | GET | Verifies zero-retention behavior in test env |

---

## 7. FEATURE INVENTORY

### Report Processing & Translation
- **Upload**: PDF or image upload via drag-and-drop or file picker
- **PII Scrubbing**: Patient name, DOB, provider identifiers removed before AI processing
- **Cancer Profile**: AI translates the report into plain English — cancer type, stage, biomarkers,
  what they mean, what typically comes next
- **Empathy Filter**: Applied to every AI output — survival statistics removed, fear-based language
  rewritten, deterministic framing replaced with possibility and next steps
- **Medical Disclaimer**: Shown on every AI output screen, every generated PDF, and in the site footer
- **Source Citations**: Every AI output includes cited sources (NCCN guidelines, NCI, ClinicalTrials.gov
  pull dates) above the medical disclaimer
- **Zero Raw PHI Retention**: Uploaded files are processed and deleted. Only the generated summary
  is retained, in the user's account, deletable at any time

### Doctor Prep Sheet
- Personalized appointment question list generated from the specific diagnosis, stage, and biomarkers
- Questions organized by priority (most critical first)
- PDF export (print-ready, with medical disclaimer and source citations in footer)
- Calendar sync prep (Google and Apple Calendar compatible)
- Appointment Check-In: review questions before appointment, check off items in real time

### Clinical Trial Matching
- Real-time matching against ClinicalTrials.gov
- Filtered by location (50-mile default radius, configurable for Professional tier), cancer type,
  stage, and biomarkers
- Every trial result explained in plain English
- Source citations with pull date included

### Insurance Denial Defense (Advocate Plan)
- Upload or paste denial letter text
- AI decodes the denial reason in plain English
- Generates a structured appeal packet with the specific regulatory language insurance companies
  respond to
- Printable HTML/PDF export with citations and disclaimer

### Financial Help Tracker (Advocate Plan)
- Live matching of financial aid programs to the user's specific diagnosis
- Pharmaceutical co-pay assistance, foundation grants, nonprofit programs
- Scraped and synced via scheduled Playwright browser automation
- Organized by program type and match quality

### Care Timeline
- Persistent chronological record: diagnoses, treatments, appointments, milestones
- Add, edit, and annotate entries
- Exportable for second opinion packets

### Second Opinion Mode (Caregiver Pro + Advocate)
- Builds a structured intake packet: report summary, treatment history, current questions, key findings
- Formatted for a new care team to review quickly

### AI Care Navigator
- Freeform conversational AI for caregivers
- Empathy Filter applied to every response
- Grounded in the user's existing uploaded reports

### Quiet Room
- Private emotional support space for caregivers
- Mood tracking with historical trend view
- Private journal (encrypted at rest using AES)
- Separate from the medical/clinical features

### Caregiver Wellbeing Check-In
- Regular emotional check-in prompts on the dashboard
- Mood score logging with optional notes

### Community (Caregiver-only Forum)
- Threaded discussion by category
- Moderated for safety and compassion
- Reactions (emoji) on posts and replies
- Flagging system for moderation
- Read-only on Free tier, full participation on Advocate and above
- Community post creation requires Advocate plan (upgrade modal shown)

### Multi-Language Support
- English, Spanish (Español), Mandarin (中文), Tagalog
- Language selector in navigation header (globe icon)
- Translations via `next-intl` dictionary system
- Language stored in cookie for server-side rendering

### Professional / Enterprise Tier
- Multi-patient dashboard: manage multiple care journeys simultaneously
- Batch document processing
- Branded portal (white-label ready, per-organization branding via `branding.ts`)
- HIPAA BAA available (contact flow via Calendly demo)
- Clinic integrations infrastructure (organizations table, enterprise patient assignments)
- Admin panel for organization and user management

### Security Features
- **MFA (TOTP)**: Time-based one-time password, mandatory for Professional tier accounts
- **AES Encryption**: Quiet Room journal entries encrypted at rest
- **Zero Raw PHI Retention**: Raw uploaded report files deleted after processing
- **AI Audit Log**: Immutable append-only log of every AI call (model, feature, hash of input/output)
- **Row Level Security**: All database tables have RLS enabled; no user can read another user's data
- **Service Role Isolation**: Service role key only used in API routes that explicitly require it
- **PII Scrubber**: Patient identifiers removed from report text before sending to AI

### PWA (Progressive Web App)
- Full PWA manifest and service worker
- Installable on iOS and Android
- Offline-capable (service worker caches key assets)
- Useful for caregivers using OncoKind at hospitals on mobile

### Cookie Consent & Analytics
- Cookie consent banner with Accept All / Essential Only / Manage Preferences options
- Consent stored in cookie; non-essential scripts (Google Analytics) only load after consent
- `AnalyticsScripts` component conditionally renders based on stored consent

### Accessibility (WCAG 2.2 AA)
- Skip-to-main-content link
- All interactive elements have visible focus states
- Minimum 16px body copy throughout
- Reduced motion: all Framer Motion animations wrapped in `prefers-reduced-motion` checks
- Screen reader labels on all icons and inputs
- Heading hierarchy enforced across all pages
- `lang="en"` on root HTML element (updated dynamically for non-English sessions)
- Print styles on Doctor Prep Sheet and Care Timeline pages

### SEO Content
- 20 SEO-optimized `/learn/[slug]` explainer articles
- Each article: MedicalWebPage + FAQPage JSON-LD schema markup
- Topics: PD-L1, EGFR, HER2, KRAS, MSI-High, ALK, BRCA, staging, immunotherapy, targeted therapy,
  insurance appeals, clinical trial phases, how to read a pathology report, and more
- `/learn` index page with category filtering
- `sitemap.ts` — dynamically generates sitemap including all learn article slugs
- `robots.ts` — allows general crawling, blocks dashboard and admin paths

---

## 8. COMPONENT LIBRARY

### Layout
| Component | Purpose |
|---|---|
| `SiteHeader` | Server component — passes auth state, brand theme, nav links to client |
| `SiteHeaderClient` | Client: sticky nav with scroll behavior, mobile hamburger drawer, language selector |
| `TrustFooter` | 5-column footer with product, platform, company, professionals, legal columns |
| `DashboardNav` | Sidebar navigation for authenticated journey pages |
| `LanguageSelector` | Globe icon dropdown for 4-language switching |

### Marketing
| Component | Purpose |
|---|---|
| `MarketingHome` | Full homepage with all sections (hero, trust bar, The Moment, How It Works, features, Empathy Filter spotlight, founder story, pricing preview, final CTA) |
| `PricingPlans` | 4-tier pricing cards (Free, Caregiver Pro, Advocate, Professional) with billing toggle |
| `DashboardPreview` | Animated preview card shown in hero section |
| `SampleReportDemo` | Interactive demo showing Cancer Profile, Prep Sheet, and Trial Matches outputs |
| `FeatureDetailPage` | Reusable template for feature detail pages |
| `WaitlistBanner` | Dismissable warm announcement strip for pre-launch email capture |
| `SectionWave` | SVG wave divider between sections |

### Care / Dashboard
| Component | Purpose |
|---|---|
| `JourneyUploadCard` | Report upload UI with trust link to Trust Center |
| `CancerProfileSummaryCard` | Displays AI Cancer Profile with sources + disclaimer |
| `DoctorPrepSheet` | Renders prep sheet for screen and printable PDF export |
| `TrialsMatcher` | Clinical trial matching UI with real-time data |
| `CareTimeline` | Interactive care timeline |
| `AICareNavigator` | Freeform AI chat interface |
| `SecondOpinionPacket` | Second opinion document builder |
| `InsuranceSupportWorkbench` | Insurance denial decode and appeal generation |
| `TrialMatchesCard` | Dashboard card for trial matches |
| `AppointmentQuestionGenerator` | Generates appointment questions from a report |
| `LiveFundingFeedCard` | Dashboard card for financial aid matches |
| `PathologyTranslationCard` | Dashboard card for pathology translation |
| `AppointmentCheckInForm` | Appointment check-in with AI explanation |
| `DiagnosisCards` | Grid of diagnosis summary cards |
| `ProgressStrip` | Visual care journey progress indicator |
| `CaregiverWellbeingCheckin` | Mood check-in prompt |

### Quiet Room
| Component | Purpose |
|---|---|
| `QuietRoomExperience` | Full Quiet Room interface: journal + mood tracking |

### Community
| Component | Purpose |
|---|---|
| `CommunityNewThreadForm` | Thread creation form |
| `CommunityReplyComposer` | Reply input with character limit |
| `CommunityPostActions` | Reaction and flag controls |
| `CommunityAvatar` | User avatar with tier indicator |
| `CommunityUpgradeModal` | Upgrade prompt for Free users trying to post |

### Disclosures
| Component | Purpose |
|---|---|
| `OutputSources` | Displays source citations above every AI output |
| `MedicalDisclaimer` | Standardized disclaimer text block shown on every AI output |

### Consent & Analytics
| Component | Purpose |
|---|---|
| `CookieConsentBanner` | Accept/Essential/Manage cookie consent UI |
| `AnalyticsScripts` | Conditionally loads Google Analytics after consent |

### Security
| Component | Purpose |
|---|---|
| `MfaSecurityPanel` | TOTP MFA enrollment and management |

### Motion
| Component | Purpose |
|---|---|
| `Reveal` | Scroll-triggered fade-in + lift animation with reduced-motion fallback |
| `RevealStagger` | Staggered children animation (0.07–0.1s per child) |

### UI Primitives
| Component | Purpose |
|---|---|
| `Button` | Primary, secondary, outline, ghost, link variants; sage green primary CTA |
| `Card`, `Input` | Base UI primitives |

---

## 9. PRICING TIERS

| Tier | Price | Stripe Key | Target User |
|---|---|---|---|
| **Free** | $0/forever | — | Families just starting out |
| **Caregiver Pro** | $19/month or $190/year | `STRIPE_PRICE_ID_PRO_MONTHLY` / `_YEARLY` | Active caregivers |
| **Advocate Plan** | $49/month or $490/year | `STRIPE_PRICE_ID_ADVOCATE_MONTHLY` / `_YEARLY` | Caregivers fighting insurance/financial challenges |
| **Professional** | $999/month | `STRIPE_PRICE_ID_ENTERPRISE_UNLIMITED` | Care navigators, patient advocates, concierge health |

### What Each Tier Includes

**Free**
- 1 report/month (AI Cancer Profile)
- Basic care map
- Empathy Filter on all outputs
- Read-only Community Access

**Caregiver Pro** *(everything in Free, plus)*
- Unlimited reports
- Doctor Prep Sheet (PDF export)
- Clinical Trial Matching (50mi radius)
- Care Timeline
- Second Opinion Mode
- Appointment Check-In
- Full Community Access
- Calendar integration

**Advocate Plan** *(everything in Caregiver Pro, plus)*
- Insurance Denial Defense
- Structured Appeal Packet generation
- Live Financial Aid Tracker
- NCCN-Aligned Advocate Sheets
- Priority email support

**Professional** *(everything in Advocate Plan, plus)*
- Multi-patient dashboard
- Batch document processing
- Branded portal (white-label)
- HIPAA BAA included
- Clinic integrations
- Dedicated support channel
- Custom trial radius
- Enterprise security review

---

## 10. AI INTEGRATION

**Model:** Anthropic Claude (via `@anthropic-ai/sdk`)
**Configuration:** `lib/anthropic.ts`

### AI Features and Their Pipeline
| Feature | API Route | Description |
|---|---|---|
| Cancer Profile | `/api/process-report` | Full report translation pipeline |
| Doctor Prep Sheet | `/api/process-report` | Generated alongside Cancer Profile |
| Appointment Questions | `/api/questions` | Generates questions from report |
| Insurance Decode | `/api/insurance/decode` | Decodes denial reason in plain English |
| Insurance Appeal | `/api/insurance/appeal` | Full appeal packet with regulatory language |
| AI Care Navigator | `/api/questions` | Freeform conversation grounded in user's reports |
| Appointment Check-In | `/api/check-ins` | Explains the appointment context in plain English |

### Empathy Filter (Technical)
Every prompt sent to Claude includes instructions to:
- Remove survival statistics and 5-year prognosis rates
- Remove mortality data and deterministic framing
- Rewrite fear-based language with possibility and next steps
- Never mention AI model names in output
- Use plain English (8th grade reading level target)
- Flag when clinical consultation is required

### Zero-Retention Compliance
- `lib/pii-scrubber.ts`: Strips patient names, DOBs, provider IDs, addresses from report text
- Raw report files deleted from Supabase Storage after text extraction
- `lib/privacy/zero-retention-monitor.ts`: Monitors and verifies zero-retention behavior
- `/api/test/zero-retention-status`: Internal endpoint to verify in test environment
- AI Audit Log records input/output hashes (not content) for compliance purposes

---

## 11. SECURITY & COMPLIANCE

### HIPAA Positioning (Path B — Educational Tool)
OncoKind is positioned as an educational tool, not a covered entity.
- No HIPAA BAA required at Free / Caregiver Pro / Advocate tiers
- Professional tier: HIPAA BAA available via sales process (Calendly → contact)
- User-facing language: "Built with privacy at its core. No raw report data retained.
  Educational tool — not a covered entity."
- All reference to "HIPAA-conscious" removed from public-facing copy

### Data Retention Policy
Communicated to users as:
> "Raw report content is processed to generate your summary and is not retained after processing.
> Your generated summaries and prep sheets are stored securely and can be deleted by you at any
> time from your account settings."

### Medical Disclaimer (Required on all AI outputs)
> "For educational support only. Not medical advice. Always consult your oncology team before
> making any treatment decisions."

### Global Site Disclaimer (Footer)
> "OncoKind is an educational support tool. Nothing on this platform constitutes medical advice.
> Always consult your oncologist or care team. OncoKind is not a substitute for professional
> medical guidance."

### Security Architecture
- All data encrypted in transit (TLS via Vercel/Supabase)
- Database-level encryption at rest (Supabase managed)
- Application-level AES encryption for Quiet Room journal entries (`lib/encryption.ts`)
- Row Level Security on every table
- MFA (TOTP) available for all users, enforced for Professional tier
- Immutable AI audit log (no DELETE/UPDATE policy)
- PII scrubbing before any data reaches the AI model
- Service Role key isolated — never exposed to client, only used in server-side API routes

### Subprocessors (listed in Trust Center at `/trust`)
- Anthropic — AI processing
- Vercel — hosting and serverless compute
- Supabase — database, authentication, and storage
- Resend — transactional email
- Stripe — payment processing

---

## 12. PRE-LAUNCH WAITLIST SYSTEM

### Database
Table: `public.waitlist`
Fields: id, email (unique), name, source, confirmed, created_at
Access: Service role only (no public read)

### API
`POST /api/waitlist`
- Validates email format
- Deduplicates (unique constraint → returns `already: true` on duplicate)
- Auto-closes at `WAITLIST_END_DATE` (default: 2026-06-30T23:59:59Z)
- Sends HTML confirmation email via Resend if `RESEND_API_KEY` is configured
- Returns HTTP 410 Gone after expiry

### UI Components
**WaitlistBanner** (`components/marketing/WaitlistBanner.tsx`)
- Appears 800ms after page load on all marketing pages (between nav and content)
- Warm cream strip (`--bg-warm`) with inline email form
- Remembers dismissal in `localStorage` (key: `ok_waitlist_dismissed`)
- Remembers successful signup in `localStorage` (key: `ok_waitlist_email`)
- Auto-hides client-side past expiry date
- X button to dismiss permanently (per browser/device)
- Loading, success, and error states

**Waitlist Page** (`/waitlist`)
- Full-experience dedicated page for link sharing
- Name (optional) + email form with accessible labels
- 4 benefit blocks: early access, founding pricing, privacy, product input
- Founder pull-quote
- Graceful closed state after expiry

### Kill-Switch
Set `NEXT_PUBLIC_WAITLIST_ENABLED=false` in Vercel env vars and redeploy.
Banner and form disappear immediately across the entire site.

---

## 13. SEO & CONTENT STRUCTURE

### Structured Data
`app/layout.tsx` includes a global `SoftwareApplication` JSON-LD schema:
```json
{
  "@type": "SoftwareApplication",
  "name": "OncoKind",
  "applicationCategory": "HealthApplication",
  "author": { "@type": "Person", "name": "Mike Nielson" },
  "offers": [Free/$0, Caregiver Pro/$19, Advocate/$49]
}
```
Individual `/learn/[slug]` pages include `MedicalWebPage` + `FAQPage` JSON-LD.

### Sitemap
`app/sitemap.ts` — dynamically generated, includes:
- All static marketing pages
- All 20 `/learn/[slug]` article pages
- Excludes dashboard, admin, and auth routes

### Robots
`app/robots.ts` — allows all crawlers on marketing content, disallows:
- `/dashboard/*`, `/journey/*`, `/admin/*`, `/api/*`, `/quiet-room/*`

### Learn Articles (20 total at `/learn/[slug]`)
PD-L1 Expression | EGFR Mutation | HER2 Status | KRAS Mutation | MSI-High |
ALK Rearrangement | BRCA Mutations | Tumor Grade | Stage IIIA NSCLC |
Stage 4 Metastatic Cancer | Adenocarcinoma | Negative Margins |
Lymphovascular Invasion | Immunotherapy | Targeted Therapy |
Appeal Insurance Denial | Appeal Keytruda Denial | Clinical Trial Phases |
How to Read a Pathology Report | Questions to Ask Your Oncologist

### Per-Page OG Metadata (unique on every page)
Homepage, About, Pricing, Professional, each feature page, each learn article.

---

## 14. INTERNATIONALIZATION

**Library:** `next-intl`
**Supported languages:** English, Español (Spanish), 中文 (Mandarin), Tagalog
**Configuration:** `lib/i18n.ts`, `lib/i18n-server.ts`
**Storage:** Language preference stored in a cookie, read server-side for SSR
**UI:** Globe icon in nav header → dropdown language selector
**Scope:** Navigation labels, footer labels, key UI strings

---

## 15. INFRASTRUCTURE & DEPLOYMENT

### Hosting
- **Platform:** Vercel (Next.js deployment, serverless API routes, edge middleware)
- **Repository:** GitHub — `apexnova-consulting/OncoKind` (main branch → production)
- **CI/CD:** Push to `main` → Vercel auto-deploys to production
- **Domain:** `www.oncokind.com`

### Status Page
- **Provider:** Instatus
- **URL:** `status.oncokind.com` (custom subdomain via CNAME)
- **Purpose:** Public uptime monitoring for caregivers and professionals

### Email
- **Provider:** Resend
- **From address:** `hello@oncokind.com` (transactional)
- **Support address:** `support@oncokind.com` (replies, support tickets)
- **Scope:** Waitlist confirmations, appointment reminders, subscription events

### Cron Jobs (Vercel Cron / Scheduled)
| Job | Route | Trigger | Purpose |
|---|---|---|---|
| Financial aid sync | `/api/advocacy/funding/sync` | Scheduled | Scrapes live financial aid programs via Playwright |
| Appointment reminders | `/api/check-ins/send-reminders` | Scheduled | Sends email reminders before appointments |

### Analytics
- Google Analytics (conditionally loaded after cookie consent)
- `AnalyticsScripts` component renders GA script only if `analytics` consent is `true`

### PWA Configuration
- `public/manifest.json` — PWA metadata, theme color, icons
- `public/sw.js` — Service worker for offline caching
- `components/PwaRegister.tsx` — Service worker registration

### Build Configuration
- TypeScript strict mode
- ESLint with Next.js rules and `@typescript-eslint/no-unused-vars` enforced
- No lint warnings allowed at build time (Vercel will fail on warnings)
- Font optimization via `next/font` (Lora + DM Sans, no layout shift)

---

## QUICK REFERENCE — SERVICE ACCOUNTS NEEDED

To run OncoKind in production, you need accounts with these services:

| Service | What you do there |
|---|---|
| **Supabase** | Create project, run migrations, get URL + anon key + service role key |
| **Anthropic** | Get Claude API key |
| **Stripe** | Create products and prices, get secret key + webhook secret, configure price IDs |
| **Vercel** | Connect GitHub repo, set all env vars, configure domain |
| **Resend** | Create account, verify `oncokind.com` domain, get API key |
| **GitHub** | Repository host (`apexnova-consulting/OncoKind`) |
| **Instatus** | Create status page, point `status.oncokind.com` CNAME to their server |
| **Calendly** | `calendly.com/oncokind-support` — used for Professional demo booking |
| **Google Search Console** | Submit `sitemap.xml` for indexing |

---

*This document reflects the state of the OncoKind codebase as of June 8, 2026.*
*For questions, contact: support@oncokind.com*
