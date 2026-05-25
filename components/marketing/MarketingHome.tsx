'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  Check,
  FileCheck,
  FileText,
  FileUp,
  FlaskConical,
  GitBranch,
  HandCoins,
  Heart,
  Lock,
  MessageCircle,
  Shield,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardPreview } from '@/components/marketing/DashboardPreview';
import { SampleReportDemo } from '@/components/marketing/SampleReportDemo';
import { SectionWave } from '@/components/marketing/SectionWave';
import { Reveal, RevealStagger } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils';

const steps = [
  {
    n: '01',
    title: 'Upload Your Report',
    desc: 'Securely upload any pathology report, scan result, or discharge summary. We support PDFs and images. Your raw file is not retained after processing.',
    icon: Upload,
  },
  {
    n: '02',
    title: 'Get Your Cancer Profile',
    desc: 'OncoKind translates the report into plain language — cancer type, stage, key biomarkers, what they mean, and what typically comes next. Every word passes through our Empathy Filter.',
    icon: Sparkles,
  },
  {
    n: '03',
    title: 'Prepare for Your Appointment',
    desc: 'Your personalized Doctor Prep Sheet is ready: specific questions based on your loved one\'s exact diagnosis, organized by priority, ready to export as PDF.',
    icon: FileCheck,
  },
  {
    n: '04',
    title: 'Navigate Every Step',
    desc: 'Track your care timeline, explore clinical trials near you, decode insurance denials, find financial aid, and prepare for second opinions — all in one place.',
    icon: GitBranch,
  },
];

const featureRows = [
  {
    label: 'Acquisition',
    features: [
      {
        href: '/features/doctor-prep-sheet',
        title: 'Doctor Prep Sheet',
        headline: 'Walk into every appointment prepared.',
        desc: 'OncoKind generates a personalized list of questions based on your loved one\'s exact diagnosis, stage, and biomarkers. Organized by priority. Exportable as PDF.',
        Icon: Calendar,
        tag: 'Most Impactful',
        tagColor: 'bg-[#f0f7f5] text-[var(--brand-primary)] border border-[#c5ddd9]',
        tier: 'All plans',
      },
      {
        href: '/features/clinical-trial-matching',
        title: 'Clinical Trial Matching',
        headline: 'Find trials your loved one may qualify for — in plain English.',
        desc: 'Real-time matching against ClinicalTrials.gov. Filtered by location, cancer type, stage, and biomarkers. Every match explained in language a family can understand.',
        Icon: FlaskConical,
        tag: 'Real-time Data',
        tagColor: 'bg-[#f0f7f5] text-[var(--brand-primary)] border border-[#c5ddd9]',
        tier: 'Pro + Advocate',
      },
      {
        href: '/features/insurance-denial-defense',
        title: 'Insurance Denial Defense',
        headline: 'Don\'t let a denial be the final answer.',
        desc: 'Upload your denial letter. OncoKind decodes the reason in plain English and generates a structured appeal packet — including the specific regulatory language insurance companies respond to.',
        Icon: ShieldCheck,
        tag: 'Advocate Plan',
        tagColor: 'bg-[#fdf6ee] text-[#8b5e2a] border border-[#f0d5b8]',
        tier: 'Advocate',
      },
    ],
  },
  {
    label: 'Differentiation',
    features: [
      {
        href: '/features/empathy-filter',
        title: 'Empathy Filter',
        headline: 'Every word chosen to support you — not scare you.',
        desc: 'Our proprietary Empathy Filter removes survival statistics, mortality rates, and fear-based language from every output we generate. No other platform has built this by design.',
        Icon: Heart,
        tag: 'Our Differentiator',
        tagColor: 'bg-[#fdf6ee] text-[#8b5e2a] border border-[#f0d5b8]',
        tier: 'On every output',
      },
      {
        href: '/journey/second-opinion',
        title: 'Second Opinion Mode',
        headline: 'Build a complete packet for a new oncologist.',
        desc: 'Second opinions save lives. OncoKind generates a structured intake packet — report summary, treatment history, current questions, and key findings — formatted for a new care team.',
        Icon: FileText,
        tag: 'Often Overlooked',
        tagColor: 'bg-[#f0f7f5] text-[var(--brand-primary)] border border-[#c5ddd9]',
        tier: 'Pro + Advocate',
      },
      {
        href: '/journey/timeline',
        title: 'Care Timeline',
        headline: 'A living record of your loved one\'s cancer journey.',
        desc: 'Document diagnoses, appointments, treatment changes, and milestones in one persistent timeline. Families who build a care timeline always know exactly where they\'ve been — and what comes next.',
        Icon: GitBranch,
        tag: 'Retention',
        tagColor: 'bg-[#f0f7f5] text-[var(--brand-primary)] border border-[#c5ddd9]',
        tier: 'Pro + Advocate',
      },
    ],
  },
  {
    label: 'Retention',
    features: [
      {
        href: '/journey/financial-help',
        title: 'Financial Help',
        headline: 'Track every co-pay and foundation support option.',
        desc: 'Live matching of financial aid programs, pharmaceutical co-pay assistance, and foundation grants to your loved one\'s specific diagnosis. Most families don\'t know these programs exist.',
        Icon: HandCoins,
        tag: 'All plans',
        tagColor: 'bg-[#f0f7f5] text-[var(--brand-primary)] border border-[#c5ddd9]',
        tier: 'All plans',
      },
      {
        href: '/community',
        title: 'Community Access',
        headline: 'Moderated caregiver conversations. Real support.',
        desc: 'Read and participate in caregiver-only discussions, moderated for safety and compassion. You are not alone in this. Community is growing — early members shape the culture.',
        Icon: MessageCircle,
        tag: 'Community',
        tagColor: 'bg-[#f0f7f5] text-[var(--brand-primary)] border border-[#c5ddd9]',
        tier: 'Advocate — read only on Free',
      },
      {
        href: '/features/doctor-prep-sheet',
        title: 'Appointment Check-In',
        headline: 'Never forget a question again.',
        desc: 'Review your prep sheet before every appointment, check off questions as they\'re answered, and add notes in real time. Your entire appointment history in one place.',
        Icon: FileCheck,
        tag: 'Pro + Advocate',
        tagColor: 'bg-[#f0f7f5] text-[var(--brand-primary)] border border-[#c5ddd9]',
        tier: 'Pro + Advocate',
      },
    ],
  },
];

const pricingTiers = [
  {
    id: 'free',
    label: 'For First Steps',
    name: 'Free',
    price: '$0',
    cadence: 'forever',
    tagline: 'Understand your first report.',
    features: [
      '1 report/month — AI Cancer Profile',
      'Basic care map',
      'Empathy Filter on all outputs',
      'Read-only Community Access',
    ],
    cta: 'Get Started Free — No Card Required',
    href: '/signup',
    variant: 'outline' as const,
    highlight: false,
  },
  {
    id: 'pro',
    label: 'For Active Caregivers',
    name: 'Caregiver Pro',
    price: '$19',
    cadence: '/month',
    tagline: 'Prepare for every appointment, every step.',
    features: [
      'Everything in Free',
      'Unlimited reports',
      'Doctor Prep Sheet (PDF export)',
      'Clinical Trial Matching (50mi radius)',
      'Care Timeline',
      'Second Opinion Mode',
      'Appointment Check-In',
      'Community Access (full)',
      'Calendar integration',
    ],
    cta: 'Start Caregiver Pro →',
    href: '/signup?plan=pro',
    variant: 'default' as const,
    highlight: false,
  },
  {
    id: 'advocate',
    label: 'For Caregivers Who Need to Fight',
    name: 'Advocate Plan',
    price: '$49',
    cadence: '/month',
    tagline: 'Insurance, financial aid, and advanced navigation.',
    features: [
      'Everything in Caregiver Pro',
      'Insurance Denial Defense',
      'Structured Appeal Packet generation',
      'Live Financial Aid Tracker',
      'NCCN-Aligned Advocate Sheets',
      'Priority email support',
    ],
    cta: 'Start Advocate Plan →',
    href: '/pricing?plan=advocate',
    variant: 'default' as const,
    highlight: true,
    badge: 'Most Popular',
  },
  {
    id: 'professional',
    label: 'For Care Teams',
    name: 'Professional',
    price: '$999',
    cadence: '/month',
    tagline: 'Serve more clients. Do more good.',
    features: [
      'Everything in Advocate Plan',
      'Multi-patient dashboard',
      'Batch document processing',
      'Branded portal (white-label)',
      'HIPAA BAA included',
      'Clinic integrations',
      'Dedicated support channel',
    ],
    cta: 'Book a Demo →',
    href: 'https://calendly.com/oncokind-support',
    external: true,
    variant: 'outline' as const,
    highlight: false,
  },
];

export function MarketingHome({ signedIn }: { signedIn: boolean }) {

  return (
    <main className="bg-[var(--bg-base)]">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-4 pb-20 pt-14 sm:pb-28 sm:pt-20 lg:pb-32 lg:pt-24"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div
          className="pointer-events-none absolute inset-0 hero-texture opacity-40"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[var(--max-width-full)]">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="eyebrow hero-nudge-up">Built by a caregiver, for caregivers</p>
              <h1 className="mt-4 font-display text-[clamp(2.25rem,5vw,4.25rem)] font-semibold leading-[1.1] tracking-tight text-[var(--color-text-primary)] hero-nudge-up hero-nudge-up-delay-1">
                You shouldn&apos;t have to understand oncology to advocate for someone you love.
              </h1>
              <p className="mt-6 max-w-[30rem] text-lg leading-[1.75] text-[var(--color-text-secondary)] hero-nudge-up hero-nudge-up-delay-2">
                OncoKind translates your loved one&apos;s pathology report into plain English, prepares
                you for every oncology appointment, and guides your family through every step of the
                cancer journey — with compassion built in.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap hero-nudge-up hero-nudge-up-delay-2">
                {signedIn ? (
                  <Button asChild size="lg">
                    <Link href="/journey">Go to My Journey</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg">
                      <Link href="/signup" className="flex items-center gap-2">
                        <FileUp className="h-5 w-5" aria-hidden />
                        Upload Your First Report — It&apos;s Free
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/#sample-demo">Try a Sample Report ↓</Link>
                    </Button>
                  </>
                )}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-[var(--color-text-muted)]">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" aria-hidden />
                  No raw report data retained
                </span>
                <span aria-hidden>·</span>
                <span className="flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-[var(--brand-accent)]" aria-hidden />
                  Empathy Filter on every output
                </span>
                <span aria-hidden>·</span>
                <span>Free to start</span>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <DashboardPreview />
            </div>
          </div>
          <SampleReportDemo />
        </div>
      </section>

      {/* ── Trust Bar ────────────────────────────────────────── */}
      <section className="border-y border-[var(--color-border-subtle)] bg-[var(--bg-subtle)] px-4 py-6">
        <div className="mx-auto max-w-[var(--max-width-full)]">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            Designed with the guidance of oncology social workers and patient advocates
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {[
              { icon: Shield, label: 'Privacy-First Architecture' },
              { icon: Lock, label: 'Zero Raw PHI Retention' },
              { icon: Heart, label: 'Empathy Filter' },
              { icon: FlaskConical, label: 'Real-Time Trial Data' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)]">
                <Icon className="h-4 w-4 text-[var(--brand-primary)]" strokeWidth={1.5} aria-hidden />
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Moment ───────────────────────────────────────── */}
      <section className="bg-[var(--bg-base)] px-4 py-[var(--section-padding-y)]">
        <div className="mx-auto max-w-[var(--max-width-wide)]">
          <Reveal className="text-center">
            <p className="eyebrow">{'// '}You know this moment</p>
            <blockquote className="mt-6 font-display text-[clamp(1.5rem,3.5vw,2.5rem)] font-medium italic leading-snug text-[var(--color-text-primary)]">
              &ldquo;The report arrived. You read it three times and understood almost nothing.&rdquo;
            </blockquote>
          </Reveal>
          <Reveal delay={0.1} className="mx-auto mt-8 max-w-2xl text-center text-lg leading-relaxed text-[var(--color-text-secondary)]">
            <p>
              The terminology. The staging. The biomarkers. Your oncologist explained it but the
              appointment was 20 minutes and you were in shock. Now you&apos;re home, it&apos;s 11pm,
              and you&apos;re trying to figure out what T2N1M0 means and whether there are clinical
              trials your mom might qualify for.
            </p>
            <p className="mt-4 font-medium text-[var(--color-text-primary)]">
              That&apos;s exactly why OncoKind exists.
            </p>
          </Reveal>

          <RevealStagger className="mt-14 grid gap-6 sm:grid-cols-3" stagger={0.1}>
            {[
              'You deserve to understand what your loved one\'s report actually says — in plain English, without fear-inducing statistics.',
              'You deserve to walk into every oncology appointment with the right questions — not remember them in the parking lot afterward.',
              'You deserve to know about every clinical trial, financial aid program, and insurance appeal right your family has — without 40 hours of research.',
            ].map((text) => (
              <div
                key={text}
                className="hover-lift-card rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--bg-warm)] p-8 shadow-[var(--shadow-card)]"
              >
                <p className="leading-relaxed text-[var(--color-text-secondary)]">{text}</p>
              </div>
            ))}
          </RevealStagger>

          <Reveal delay={0.2} className="mt-10 text-center">
            <p className="text-lg font-semibold text-[var(--color-text-primary)]">
              OncoKind handles all of it.
            </p>
          </Reveal>
        </div>
      </section>

      <SectionWave fill="var(--bg-subtle)" />

      {/* ── How It Works ─────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="scroll-mt-20 bg-[var(--bg-subtle)] px-4 py-[var(--section-padding-y)]"
      >
        <div className="mx-auto max-w-[var(--max-width-full)]">
          <Reveal className="text-center">
            <p className="eyebrow">{'// '}How it works</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl">
              From report to ready — in minutes.
            </h2>
          </Reveal>
          <div className="relative mt-16 lg:mt-20">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {steps.map((step, i) => (
                <Reveal key={step.n} delay={i * 0.1} className="relative">
                  {i < steps.length - 1 && (
                    <div
                      className="absolute left-[calc(50%+2.5rem)] top-10 hidden h-px w-[calc(100%-1rem)] border-t border-dashed border-[var(--color-border)] lg:block"
                      aria-hidden
                    />
                  )}
                  <div className="hover-lift-card relative rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--bg-surface)] p-8 shadow-[var(--shadow-md)]">
                    <span
                      className="pointer-events-none absolute right-5 top-4 font-display text-[5rem] font-bold leading-none text-[var(--brand-primary)]/[0.06]"
                      aria-hidden
                    >
                      {step.n}
                    </span>
                    <step.icon
                      className="relative z-[1] h-9 w-9 text-[var(--brand-primary)]"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <h3 className="relative z-[1] mt-4 font-display text-lg font-semibold text-[var(--color-text-primary)]">
                      {step.title}
                    </h3>
                    <p className="relative z-[1] mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {step.desc}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionWave flip fill="var(--bg-base)" />

      {/* ── Feature Showcase ─────────────────────────────────── */}
      <section
        id="features"
        className="scroll-mt-20 bg-[var(--bg-base)] px-4 py-[var(--section-padding-y)]"
      >
        <div className="mx-auto max-w-[var(--max-width-full)]">
          <Reveal className="text-center">
            <p className="eyebrow">{'// '}What OncoKind builds for you</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl">
              Eight tools. One mission: prepare you for what&apos;s next.
            </h2>
          </Reveal>

          {featureRows.map((row) => (
            <RevealStagger
              key={row.label}
              className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              stagger={0.07}
            >
              {row.features.map((f) => (
                <div
                  key={f.title}
                  className="hover-lift-card group flex flex-col rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--bg-surface)] p-8 shadow-[var(--shadow-card)]"
                >
                  <f.Icon
                    className="h-9 w-9 text-[var(--brand-primary)]"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <h3 className="font-sans text-lg font-semibold text-[var(--color-text-primary)]">
                      {f.title}
                    </h3>
                    <span className={cn('rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wide', f.tagColor)}>
                      {f.tag}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-[var(--brand-primary)]">{f.headline}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {f.desc}
                  </p>
                  <Link
                    href={f.href}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[var(--brand-primary)] transition-colors hover:text-[var(--brand-secondary)]"
                  >
                    Learn more
                    <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                  </Link>
                </div>
              ))}
            </RevealStagger>
          ))}
        </div>
      </section>

      {/* ── Empathy Filter Spotlight ──────────────────────────── */}
      <section className="bg-[var(--bg-warm)] px-4 py-[var(--section-padding-y)]">
        <div className="mx-auto max-w-[var(--max-width-full)]">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left — text */}
            <Reveal>
              <p className="eyebrow">Our proprietary differentiator</p>
              <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl">
                The Empathy Filter.
                <br />
                <em className="font-display">No other platform has built this.</em>
              </h2>
              <div className="mt-6 space-y-4 text-[var(--color-text-secondary)]">
                <p>
                  When families search for cancer information — on Google, on generic AI tools,
                  anywhere — they receive raw clinical data. Survival statistics. Five-year prognosis
                  rates. Mortality data presented without context.
                </p>
                <p>
                  This information arrives like a second diagnosis. It is devastating, often
                  misleading without clinical context, and not what a family needs when they&apos;re
                  trying to figure out what questions to ask next Tuesday.
                </p>
                <p>
                  OncoKind made a technical and philosophical commitment: every word we generate
                  passes through the Empathy Filter. Survival statistics are removed. Fear-based
                  language is rewritten. Deterministic framing is replaced with possibility and next
                  steps.
                </p>
                <p className="font-medium text-[var(--color-text-primary)]">
                  You get clarity. You get preparation. You get to decide what information you want
                  and when.
                </p>
              </div>
              <Link
                href="/features/empathy-filter"
                className="mt-8 inline-flex items-center gap-1.5 font-semibold text-[var(--brand-primary)] hover:text-[var(--brand-secondary)]"
              >
                Learn more about the Empathy Filter
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Reveal>

            {/* Right — comparison */}
            <Reveal delay={0.1}>
              <div className="space-y-4">
                {/* Without */}
                <div className="rounded-[var(--radius-xl)] border border-red-200 bg-red-50 p-6">
                  <p className="mb-3 text-xs font-bold uppercase tracking-widest text-red-700">
                    ⚠ What a Google search returns
                  </p>
                  <p className="font-mono text-sm leading-relaxed text-red-900">
                    &ldquo;Non-small cell lung cancer Stage IIIA has a 5-year survival rate of
                    approximately 36%. Median survival with current treatment protocols is 18–24
                    months. Prognosis is significantly affected by...&rdquo;
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 text-sm font-medium text-[var(--color-text-muted)]">
                  <div className="h-px flex-1 bg-[var(--color-border-subtle)]" />
                  With OncoKind
                  <div className="h-px flex-1 bg-[var(--color-border-subtle)]" />
                </div>

                {/* With */}
                <div className="rounded-[var(--radius-xl)] border border-[#c5ddd9] bg-[#f0f7f5] p-6">
                  <div className="mb-3 flex items-center gap-2">
                    <span className="empathy-badge">
                      <Heart className="h-3.5 w-3.5 text-[var(--brand-accent)]" aria-hidden />
                      Empathy Filter Applied ✓
                    </span>
                  </div>
                  <p className="font-sans text-sm leading-relaxed text-[var(--color-text-primary)]">
                    &ldquo;This is Stage IIIA non-small cell lung cancer. The cancer has spread to
                    nearby lymph nodes but has not reached distant organs. A PD-L1 score of 60% is
                    an important finding — it suggests immunotherapy may be especially effective.
                    Here are the questions to ask...&rdquo;
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Founder Story ─────────────────────────────────────── */}
      <section className="cta-noise relative bg-[var(--bg-deep)] px-4 py-[var(--section-padding-y)] text-[var(--color-text-inverse)]">
        <div className="relative z-[1] mx-auto max-w-[var(--max-width-wide)]">
          <Reveal className="mx-auto max-w-2xl text-center">
            <blockquote className="font-display text-[clamp(1.5rem,3.5vw,2.5rem)] font-medium italic leading-snug">
              &ldquo;I built this because someone I love was diagnosed and I had no idea what any of it
              meant. No family should feel that alone.&rdquo;
            </blockquote>
            <div className="mt-8 space-y-4 text-base leading-[1.8] text-[var(--color-text-inverse)]/80">
              <p>
                My name is Mike. Cancer has been part of my life for as long as I can remember. I
                lost my grandmother at 9, my grandfather at 15, my father had a kidney removed at
                16, and I lost my cousin — who was more like a brother — just a month after his
                diagnosis at 28.
              </p>
              <p>And now my mom is fighting a rare Stage 4 metastatic cancer.</p>
              <p>
                I built OncoKind to change that. Not to replace oncologists — but to make sure no
                family ever sits in a waiting room without understanding what they&apos;re facing and
                what questions to ask.
              </p>
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-[var(--brand-gold)]">
              — Mike Nielson, Founder &amp; CEO, OncoKind
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-10 flex justify-center">
            <Button asChild size="lg">
              <Link href="/signup">
                Get Started Free — It&apos;s the tool I wish I&apos;d had
              </Link>
            </Button>
          </Reveal>
          <Reveal delay={0.2} className="mt-6 text-center">
            <Link
              href="/about"
              className="text-sm text-[var(--color-text-inverse)]/60 underline-offset-4 hover:text-white hover:underline"
            >
              Read the full founder story →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Pricing Preview ──────────────────────────────────── */}
      <section className="bg-[var(--bg-subtle)] px-4 py-[var(--section-padding-y)]">
        <div className="mx-auto max-w-[var(--max-width-full)]">
          <Reveal className="text-center">
            <p className="eyebrow">{'// '}Simple, transparent pricing</p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--color-text-primary)] sm:text-4xl">
              Start free. Upgrade when you need more.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[var(--color-text-secondary)]">
              No surprise billing. Cancel anytime. Every plan starts with a free report.
            </p>
          </Reveal>

          <div className="mt-14 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {pricingTiers.map((tier, i) => (
              <Reveal key={tier.id} delay={i * 0.08} className="h-full">
                <div
                  className={cn(
                    'hover-lift-card flex h-full flex-col rounded-[var(--radius-xl)] p-7 shadow-[var(--shadow-md)]',
                    tier.highlight
                      ? 'relative border-t-4 border-t-[var(--brand-gold)] bg-[var(--color-primary-900)] text-white'
                      : 'border border-[var(--color-border-subtle)] bg-[var(--bg-surface)] text-[var(--color-text-primary)]'
                  )}
                >
                  {tier.badge && (
                    <span className="absolute -right-1 top-4 rotate-3 rounded-full bg-[var(--brand-gold)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-primary-900)]">
                      {tier.badge}
                    </span>
                  )}
                  <span
                    className={cn(
                      'inline-flex w-fit rounded-full px-2.5 py-1 text-[0.7rem] font-bold uppercase tracking-widest',
                      tier.highlight
                        ? 'bg-white/10 text-[var(--brand-gold)]'
                        : 'bg-[var(--bg-subtle)] text-[var(--color-text-muted)]'
                    )}
                  >
                    {tier.label}
                  </span>
                  <h3
                    className={cn(
                      'mt-3 font-display text-xl font-semibold',
                      tier.highlight ? 'text-white' : 'text-[var(--color-text-primary)]'
                    )}
                  >
                    {tier.name}
                  </h3>
                  <p
                    className={cn(
                      'mt-1 text-sm',
                      tier.highlight ? 'text-white/70' : 'text-[var(--color-text-secondary)]'
                    )}
                  >
                    {tier.tagline}
                  </p>
                  <div className="mt-5">
                    <span
                      className={cn(
                        'font-display text-4xl font-semibold',
                        tier.highlight ? 'text-white' : 'text-[var(--color-text-primary)]'
                      )}
                    >
                      {tier.price}
                    </span>
                    <span
                      className={cn(
                        'ml-1 text-sm',
                        tier.highlight ? 'text-white/60' : 'text-[var(--color-text-muted)]'
                      )}
                    >
                      {tier.cadence}
                    </span>
                  </div>
                  <ul className="mt-6 flex-1 space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check
                          className={cn(
                            'mt-0.5 h-4 w-4 shrink-0',
                            tier.highlight ? 'text-[var(--brand-gold)]' : 'text-[var(--brand-primary)]'
                          )}
                          aria-hidden
                        />
                        <span className={tier.highlight ? 'text-white/80' : 'text-[var(--color-text-secondary)]'}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8">
                    {tier.external ? (
                      <a
                        href={tier.href}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                          'block w-full rounded-full px-5 py-3 text-center text-sm font-semibold transition-all',
                          tier.highlight
                            ? 'border border-white/20 text-white hover:bg-white/10'
                            : 'border border-[var(--color-border)] text-[var(--color-text-primary)] hover:border-[var(--brand-primary)] hover:text-[var(--brand-primary)]'
                        )}
                      >
                        {tier.cta}
                      </a>
                    ) : (
                      <Button
                        asChild
                        variant={tier.highlight ? 'default' : tier.variant}
                        className={cn(
                          'w-full',
                          tier.highlight && 'bg-[var(--brand-gold)] text-[var(--color-primary-900)] hover:bg-[var(--brand-gold)]/90 hover:shadow-none'
                        )}
                      >
                        <Link href={tier.href}>{tier.cta}</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10 text-center">
            <p className="mb-4 text-sm text-[var(--color-text-muted)]">
              All plans include the Empathy Filter. Always.
            </p>
            <Link
              href="/pricing"
              className="text-sm font-semibold text-[var(--brand-primary)] underline-offset-4 hover:underline"
            >
              View full pricing and feature comparison →
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section
        className="cta-noise relative px-4 py-[var(--section-padding-y)] text-center text-white"
        style={{ background: 'var(--gradient-cta)' }}
      >
        <div className="relative z-[1] mx-auto max-w-2xl">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">
              You&apos;ve already been through enough.
              <br className="hidden sm:block" /> Let us handle the complexity.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/85">
              Upload your first report free. Get your Cancer Profile, Doctor Prep Sheet, and clinical
              trial matches in minutes. No credit card required.
            </p>
          </Reveal>
          {!signedIn && (
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-[var(--brand-primary)] shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-white/95 hover:text-[var(--brand-primary)] hover:shadow-[0_6px_28px_rgba(0,0,0,0.2)]"
                >
                  <Link href="/signup">Upload Your First Report — Free →</Link>
                </Button>
              </div>
              <p className="mt-6 text-xs text-white/60">
                🔒 No raw report data retained after processing · Privacy-first design
              </p>
            </Reveal>
          )}
        </div>
      </section>
    </main>
  );
}
