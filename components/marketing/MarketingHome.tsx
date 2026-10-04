'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  BookHeart,
  Calendar,
  Check,
  ChevronDown,
  ClipboardList,
  FileCheck,
  FileText,
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
import { SampleReportDemo } from '@/components/marketing/SampleReportDemo';
import { SectionWave } from '@/components/marketing/SectionWave';
import { Reveal, RevealStagger } from '@/components/motion/Reveal';
import { FunnelPageView } from '@/components/analytics/FunnelPageView';
import { ROSEMARIE_SAMPLE } from '@/lib/sample-rosemarie';
import { cn } from '@/lib/utils';
import {
  CONSUMER_HOMEPAGE_FEATURES,
  HOMEPAGE_HERO,
  HOMEPAGE_TOOL_COUNT,
  numberToToolHeadline,
} from '@/lib/pricing-config';
import { isFeatureEnabled } from '@/lib/feature-flags';

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */

const stats = [
  {
    figure: '87%',
    desc: 'of physicians report that prior authorization requirements lead to care delays for critical treatments.',
    sourceName: 'American Medical Association (2024)',
    sourceUrl:
      'https://www.ama-assn.org/press-center/press-releases/ama-survey-shows-physicians-patients-heavily-burdened-prior-authorization',
  },
  {
    figure: '4 million+',
    desc: 'Over 4 million Medicare Advantage prior authorization requests were denied in 2024.',
    sourceName: 'Kaiser Family Foundation (2025)',
    sourceUrl:
      'https://www.kff.org/medicare/issue-brief/over-4-million-medicare-advantage-prior-authorization-requests-were-denied-in-2024/',
  },
  {
    figure: '80%+',
    desc: 'of appealed prior authorization denials are ultimately overturned, proving initial denials are often unjust.',
    sourceName: 'Kaiser Family Foundation (2024)',
    sourceUrl:
      'https://www.kff.org/medicare/issue-brief/over-4-million-medicare-advantage-prior-authorization-requests-were-denied-in-2024/',
  },
];

const testimonials = [
  {
    quote:
      "I had never heard about clinical trials. No one ever brought them up with me. I was so shocked I didn't know about this.",
    attribution: 'Caregiver research interview, family caregiver',
  },
  {
    quote: 'I felt like for a while I was doing this by myself. Not knowing what I was doing.',
    attribution: 'Caregiver research interview, family caregiver',
  },
];

const sourceBadges = [
  'NCCN Clinical Guidelines',
  'NCI (cancer.gov)',
  'JCO Oncology Practice',
  'Oncology Social Workers',
  'Patient Advocates',
];

const steps = [
  {
    n: '01',
    title: 'Upload your report',
    desc: 'Securely upload any pathology report, scan result, or discharge summary (PDF or image). Your raw file is not retained after processing.',
    icon: Upload,
    devNote: true,
  },
  {
    n: '02',
    title: 'Receive your Cancer Profile',
    desc: 'OncoKind translates the report into plain language: cancer type, stage, key biomarkers, and what each finding means for your next conversation with your oncologist. Every word passes through the Empathy Filter.',
    icon: Sparkles,
    devNote: false,
  },
  {
    n: '03',
    title: 'Get your Doctor Prep Sheet',
    desc: "A personalized list of questions based on your loved one's exact diagnosis, stage, and biomarkers. Organized by priority. PDF export is on Caregiver Pro.",
    icon: FileCheck,
    devNote: false,
  },
  {
    n: '04',
    title: 'Navigate every step from here',
    desc: 'Track your care timeline, explore clinical trials, respond to insurance denials, find financial aid, and prepare for second opinions, all in one place.',
    icon: GitBranch,
    devNote: false,
  },
];

const FEATURE_ICONS = {
  cancer_profile: Sparkles,
  doctor_prep: Calendar,
  second_opinion: FileText,
  check_in: ClipboardList,
  timeline: GitBranch,
  trials: FlaskConical,
  goals_of_care: BookHeart,
  insurance: ShieldCheck,
  financial_aid: HandCoins,
  community: MessageCircle,
  empathy_filter: Heart,
} as const;

const faqs = [
  {
    q: 'Is this medical advice? Can I trust what OncoKind tells me?',
    a: "OncoKind is an educational preparation tool. It helps you understand what your loved one's report says and what questions to bring to your oncologist. It is not a substitute for medical advice and never tries to be. Every output is sourced from NCCN guidelines and NCI resources. Your oncology team remains your primary guide.",
  },
  {
    q: "What happens to my loved one's medical records after I upload them?",
    a: "Your raw file is not retained after processing. We extract what is needed to build your Cancer Profile, then the document is removed. Storage is encrypted. We have never retained raw PHI and our architecture is designed so that we cannot.",
  },
  {
    q: "I'm not very tech-savvy. Is this hard to use?",
    a: 'The core experience is: upload a PDF, read the plain-English summary, review your question list. That is it. You can see exactly what the output looks like in the sample demo on this page before you create an account. If you can send an email attachment, you can use OncoKind.',
  },
  {
    q: 'My oncologist is very thorough. Do I really need this?',
    a: 'Most oncologists are thorough, and most appointments are 15 to 20 minutes long, while the family is still processing the diagnosis. OncoKind does not replace your oncologist. It helps you arrive at the appointment with the right questions and understand what you heard afterward.',
  },
  {
    q: "What does 'free' actually include?",
    a: HOMEPAGE_HERO.paidUnlock,
  },
];

/* ─────────────────────────────────────────────────────────────
   HERO INLINE DEMO CARD
───────────────────────────────────────────────────────────── */

function HeroDemoCard() {
  return (
    <div className="rounded-2xl border border-[#cdd8d5] bg-white shadow-[0_8px_32px_rgba(15,110,86,0.10)] overflow-hidden">
      <div className="bg-[#E1F5EE] px-5 py-3 border-b border-[#cdd8d5]">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0F6E56]">
          Sample Cancer Profile — generated from a pathology report
        </p>
      </div>
      <div className="divide-y divide-[#cdd8d5]">
        <DemoRow label="Cancer type" value={ROSEMARIE_SAMPLE.cancerTypeShort} />
        <DemoRow label="Stage" value={ROSEMARIE_SAMPLE.stage} />
        <DemoRow label="HPV status" value={ROSEMARIE_SAMPLE.hpv.value} />
        <DemoRow
          label="PD-L1 (CPS)"
          value={ROSEMARIE_SAMPLE.pdl1.value}
          note={ROSEMARIE_SAMPLE.pdl1.heroNote}
          notePositive
        />
        <div className="flex items-start gap-3 px-5 py-3.5 bg-[#f7faf9]">
          <span className="text-sm text-[#5a6b68] font-medium min-w-[120px] shrink-0">Next step</span>
          <span className="text-sm font-semibold text-[#0F6E56] flex items-center gap-1.5">
            <FileCheck className="h-4 w-4 shrink-0" aria-hidden />
            Doctor Prep Sheet ready for your appointment
          </span>
        </div>
      </div>
      <div className="px-5 py-3 bg-[#f7faf9] border-t border-[#cdd8d5]">
        <p className="text-xs text-[#5a6b68]">
          {ROSEMARIE_SAMPLE.illustrationNote}
        </p>
      </div>
    </div>
  );
}

function DemoRow({
  label,
  value,
  note,
  notePositive,
}: {
  label: string;
  value: string;
  note?: string;
  notePositive?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 px-5 py-3.5">
      <span className="text-sm text-[#5a6b68] font-medium min-w-[120px] shrink-0">{label}</span>
      <div>
        <span className="text-sm font-semibold text-[#1e2d2b]">{value}</span>
        {note && (
          <span
            className={cn(
              'ml-2 text-xs font-medium',
              notePositive ? 'text-[#0F6E56]' : 'text-[#5a6b68]'
            )}
          >
            › {note}
          </span>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   FAQ ACCORDION
───────────────────────────────────────────────────────────── */

function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-[#cdd8d5] rounded-2xl border border-[#cdd8d5] bg-white overflow-hidden">
      {faqs.map((item, i) => (
        <div key={i}>
          <button
            type="button"
            aria-expanded={open === i}
            aria-controls={`faq-panel-${i}`}
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-start justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-[#f7faf9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6E56] focus-visible:ring-inset"
          >
            <span className="text-base font-semibold text-[#1e2d2b] leading-snug">{item.q}</span>
            <ChevronDown
              className={cn(
                'mt-0.5 h-5 w-5 shrink-0 text-[#0F6E56] transition-transform duration-200',
                open === i && 'rotate-180'
              )}
              aria-hidden
            />
          </button>
          {open === i && (
            <div
              id={`faq-panel-${i}`}
              role="region"
              className="px-6 pb-5 text-[15px] leading-[1.75] text-[#5a6b68]"
            >
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */

export function MarketingHome({ signedIn }: { signedIn: boolean }) {
  return (
    <main className="bg-white">
      <FunnelPageView event="landing_view" />

      {/* ── 1. Hero ──────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-4 pb-16 pt-14 sm:pb-24 sm:pt-20 lg:pb-28 lg:pt-24"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div
          className="pointer-events-none absolute inset-0 hero-texture opacity-30"
          aria-hidden
        />
        <div className="relative mx-auto max-w-[var(--max-width-full)]">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">

            {/* Left — copy */}
            <div>
              <span className="eyebrow hero-nudge-up inline-block">
                Built by a caregiver, for caregivers
              </span>
              <h1 className="mt-4 text-[clamp(2.1rem,5vw,3rem)] font-bold leading-[1.1] tracking-tight text-[#1e2d2b] hero-nudge-up hero-nudge-up-delay-1">
                You shouldn&apos;t have to understand oncology to advocate for someone you love.
              </h1>
              <p className="mt-5 max-w-[30rem] text-[1.05rem] leading-[1.75] text-[#5a6b68] hero-nudge-up hero-nudge-up-delay-2">
                {HOMEPAGE_HERO.subtitle}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap hero-nudge-up hero-nudge-up-delay-2">
                {signedIn ? (
                  <Button asChild size="lg">
                    <Link href="/journey">Go to My Journey</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg">
                      <Link
                        href="/signup"
                        className="flex items-center gap-2"
                        data-analytics="hero_cta_click"
                      >
                        <Upload className="h-4 w-4" aria-hidden />
                        Upload your first report. It is free
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="lg" className="text-[#0F6E56] hover:bg-[#E1F5EE]">
                      <Link href="#sample-demo" data-analytics="hero_demo_click">
                        Try a sample report first →
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Trust micro-copy */}
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-[#5a6b68]">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" aria-hidden />
                  No raw data retained
                </span>
                <span aria-hidden>·</span>
                <span className="flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-[#0F6E56]" aria-hidden />
                  Empathy Filter on every output
                </span>
                <span aria-hidden>·</span>
                <span className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-[#0F6E56]" aria-hidden />
                  Free to start
                </span>
              </div>
            </div>

            {/* Right — inline demo card */}
            <div className="flex justify-center lg:justify-end" data-analytics="demo_panel_interaction">
              <div className="w-full max-w-md">
                <HeroDemoCard />
              </div>
            </div>
          </div>

          {/* Full interactive demo (secondary CTA target) */}
          <div className="mt-14">
            <SampleReportDemo />
          </div>
        </div>
      </section>

      {/* ── 2. Social Proof & Stats ──────────────────────────── */}
      <section className="bg-[#f7faf9] px-4 py-[var(--section-padding-y)] border-y border-[#cdd8d5]">
        <div className="mx-auto max-w-[var(--max-width-full)]">
          <Reveal className="text-center">
            <h2 className="text-2xl font-bold text-[#1e2d2b] sm:text-3xl">
              The information gap is real. OncoKind closes it.
            </h2>
          </Reveal>

          {/* Stats */}
          <RevealStagger className="mt-10 grid gap-6 sm:grid-cols-3" stagger={0.08}>
            {stats
              .filter((s) => Boolean(s.sourceName && s.sourceUrl))
              .map((s) => (
              <div
                key={s.figure}
                className="rounded-2xl border border-[#cdd8d5] bg-white p-7 text-center shadow-sm"
              >
                <p className="font-bold text-[2.5rem] leading-none text-[#0F6E56]">{s.figure}</p>
                <p className="mt-3 text-sm leading-[1.7] text-[#5a6b68]">{s.desc}</p>
                <a
                  href={s.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-xs font-semibold text-[#0F6E56] underline-offset-4 hover:underline"
                >
                  {s.sourceName}
                </a>
              </div>
            ))}
          </RevealStagger>

          {/* Testimonials */}
          <RevealStagger className="mt-10 grid gap-6 sm:grid-cols-2" stagger={0.08}>
            {testimonials.map((t, i) => (
              <blockquote
                key={i}
                className="rounded-2xl border border-[#cdd8d5] bg-white p-7 shadow-sm"
              >
                <p className="text-[1rem] leading-[1.75] text-[#1e2d2b] italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <footer className="mt-4 text-sm font-semibold text-[#5a6b68]">
                  {t.attribution}
                </footer>
              </blockquote>
            ))}
          </RevealStagger>

          {/* Source badges */}
          <Reveal delay={0.15} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {sourceBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-[#cdd8d5] bg-white px-4 py-1.5 text-xs font-semibold text-[#5a6b68]"
              >
                {badge}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── 3. Empathy Filter Spotlight ──────────────────────── */}
      <section className="bg-white px-4 py-[var(--section-padding-y)]">
        <div className="mx-auto max-w-[var(--max-width-full)]">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-[#1e2d2b] sm:text-3xl">
              When you search for cancer information, you get survival statistics.
              <br className="hidden sm:block" />
              OncoKind doesn&apos;t work that way.
            </h2>
            <p className="mt-5 text-[1rem] leading-[1.75] text-[#5a6b68]">
              Every word OncoKind generates passes through our Empathy Filter, removing survival
              rates, mortality framing, and fear-based language before it reaches you.
            </p>
          </Reveal>

          <div className="mt-12 grid items-stretch gap-5 sm:grid-cols-2 lg:gap-8 max-w-3xl mx-auto">
            {/* Google panel */}
            <Reveal>
              <div className="h-full rounded-2xl border border-red-200 bg-[#FCEBEB] p-6">
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-red-700">
                  What a Google search often looks like
                </p>
                <p className="select-none font-mono text-sm leading-[1.75] text-red-900 blur-[6px]" aria-hidden>
                  [redacted search snippet without numbers]
                </p>
                <p className="mt-3 text-sm text-red-800">
                  Search results often lead with statistics and fear. OncoKind does not show those numbers.
                </p>
              </div>
            </Reveal>

            {/* OncoKind panel */}
            <Reveal delay={0.25}>
              <div className="h-full rounded-2xl border border-[#9FE1CB] bg-[#E1F5EE] p-6">
                <div className="mb-4 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0F6E56] px-3 py-1 text-xs font-semibold text-white">
                    <Heart className="h-3 w-3" aria-hidden />
                    Empathy Filter Applied ✓
                  </span>
                </div>
                <p className="text-sm leading-[1.75] text-[#085041]">
                  &ldquo;This is Stage IIIA non-small cell lung cancer. The cancer has spread to
                  nearby lymph nodes but has not reached distant organs. A PD-L1 score of 60%
                  suggests immunotherapy may be especially effective. Here are the questions to ask
                  your oncologist next week...&rdquo;
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="mt-8 text-center">
            <Link
              href="/features/empathy-filter"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0F6E56] hover:text-[#085041] underline-offset-4 hover:underline"
            >
              Learn more about the Empathy Filter
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      <SectionWave fill="var(--bg-subtle)" />

      {/* ── 4. How It Works ──────────────────────────────────── */}
      <section
        id="how-it-works"
        className="scroll-mt-20 bg-[#f7faf9] px-4 py-[var(--section-padding-y)]"
      >
        <div className="mx-auto max-w-[var(--max-width-full)]">
          <Reveal className="text-center">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-4 text-3xl font-bold text-[#1e2d2b] sm:text-4xl">
              From report to ready, in minutes.
            </h2>
            <p className="mt-3 text-[1rem] text-[#5a6b68]">
              Four steps. No medical background required.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {steps.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.09}>
                <div className="relative h-full hover-lift-card rounded-2xl border border-[#cdd8d5] bg-white p-7 shadow-sm">
                  <span
                    className="pointer-events-none absolute right-4 top-3 font-bold leading-none text-[#0F6E56]/[0.07] text-[5rem]"
                    aria-hidden
                  >
                    {step.n}
                  </span>
                  <step.icon
                    className="relative z-[1] h-8 w-8 text-[#0F6E56]"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                  <h3 className="relative z-[1] mt-4 text-base font-semibold text-[#1e2d2b]">
                    {step.title}
                  </h3>
                  <p className="relative z-[1] mt-2 text-sm leading-[1.75] text-[#5a6b68]">
                    {step.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <SectionWave flip fill="var(--bg-base)" />

      {isFeatureEnabled('feature_first_72_hours') ? (
        <section className="bg-white px-4 py-12">
          <div className="mx-auto max-w-[var(--max-width-wide)] rounded-2xl border border-[#cdd8d5] bg-[#f7faf9] p-8">
            <h2 className="text-2xl font-bold text-[#1e2d2b]">Just diagnosed? Start here</h2>
            <p className="mt-3 text-[#5a6b68]">
              The First 72 Hours checklist is a calm, sequenced plan. No countdown clocks. Core tasks are
              free on every plan.
            </p>
            <Link href="/first-72-hours" className="mt-4 inline-flex font-semibold text-[#0F6E56]">
              Open First 72 Hours
            </Link>
          </div>
        </section>
      ) : null}

      {/* ── 5. Features Grid ─────────────────────────────────── */}
      <section
        id="features"
        className="scroll-mt-20 bg-white px-4 py-[var(--section-padding-y)]"
      >
        <div className="mx-auto max-w-[var(--max-width-full)]">
          <Reveal className="text-center">
            <p className="eyebrow">What OncoKind builds for you</p>
            <h2 className="mt-4 text-3xl font-bold text-[#1e2d2b] sm:text-4xl">
              {numberToToolHeadline(HOMEPAGE_TOOL_COUNT)}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[1rem] text-[#5a6b68]">
              Every feature was built because a caregiver needed it and couldn&apos;t find it
              anywhere else.
            </p>
          </Reveal>

          <RevealStagger
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
            stagger={0.06}
          >
            {CONSUMER_HOMEPAGE_FEATURES.map((f) => {
              const Icon = FEATURE_ICONS[f.id as keyof typeof FEATURE_ICONS] ?? FileText;
              return (
              <div
                key={f.id}
                className="hover-lift-card flex flex-col rounded-2xl border border-[#cdd8d5] bg-white p-6 shadow-sm"
              >
                <Icon
                  className="h-8 w-8 text-[#0F6E56]"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-[#1e2d2b]">{f.name}</h3>
                  <span className="rounded-full bg-[#E1F5EE] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-[#0F6E56]">
                    {f.homepage?.tag}
                  </span>
                </div>
                <p className="mt-2 flex-1 text-sm leading-[1.75] text-[#5a6b68]">{f.homepage?.desc}</p>
                <Link
                  href={f.homepage?.href ?? '/pricing'}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#0F6E56] hover:text-[#085041]"
                >
                  Learn more
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                </Link>
              </div>
            );
            })}
          </RevealStagger>
        </div>
      </section>

      {/* ── 6. Founder Trust Bridge ──────────────────────────── */}
      <section className="bg-[#1e2d2b] px-4 py-[var(--section-padding-y)] text-white">
        <div className="mx-auto max-w-[var(--max-width-full)]">
          <Reveal className="text-center">
            <p className="eyebrow" style={{ color: '#9FE1CB' }}>Why this exists</p>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              Why this exists — and why it&apos;s personal.
            </h2>
          </Reveal>

          <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)] lg:gap-14">

            {/* Mom's photo */}
            <Reveal className="mx-auto w-full max-w-[18rem] lg:max-w-none">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.4)]">
                <Image
                  src="/images/founder-photo.jpg"
                  alt="Founder's mother"
                  fill
                  sizes="(max-width: 1024px) 288px, 360px"
                  className="object-cover object-top"
                  priority
                />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#9FE1CB]/70 italic text-center">
                Dedicated to my mom, who faced her cancer with more courage than I&apos;ve ever had to.
              </p>
            </Reveal>

            {/* Story + quote */}
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 sm:p-10">
                <blockquote className="text-[1.05rem] leading-[1.85] text-white/90 italic">
                  &ldquo;I built OncoKind because my mom fought Stage 4 cancer, and I had no idea
                  what any of it meant. She passed away on July 4, 2026. I lost my grandmother to
                  cancer at 9. My grandfather at 15. My dad had a kidney removed at 16. My cousin
                  — who was more like a brother — died one month after his diagnosis at 28. And
                  when my mom&apos;s diagnosis came, I still couldn&apos;t read her pathology
                  report. I still didn&apos;t know what her biomarkers meant. I still sat in a
                  waiting room without the questions I should have been asking. Every feature in
                  OncoKind exists because a family needed it and couldn&apos;t find it anywhere.
                  This is the tool I wish I had.&rdquo;
                </blockquote>
                <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[#9FE1CB]">
                  — Mike Nielson, Founder &amp; CEO, OncoKind
                </p>
              </div>
              <div className="mt-6">
                <Link
                  href="/about"
                  className="text-sm text-white/60 underline-offset-4 hover:text-white hover:underline"
                >
                  Read the full founder story →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ───────────────────────────────────────────── */}
      <section className="bg-[#f7faf9] px-4 py-[var(--section-padding-y)]">
        <div className="mx-auto max-w-[var(--max-width-wide)]">
          <Reveal className="text-center">
            <p className="eyebrow">FAQ</p>
            <h2 className="mt-4 text-3xl font-bold text-[#1e2d2b] sm:text-4xl">
              Questions families ask before they start.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <FAQAccordion />
          </Reveal>
          <Reveal delay={0.2} className="mt-8 text-center">
            <p className="text-sm text-[#5a6b68]">
              More questions?{' '}
              <a
                href="mailto:support@oncokind.com"
                className="font-semibold text-[#0F6E56] hover:underline underline-offset-4"
              >
                Email our team →
              </a>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── 8. Final CTA ─────────────────────────────────────── */}
      <section
        className="relative px-4 py-[var(--section-padding-y)] text-center text-white"
        style={{ background: 'var(--gradient-cta)' }}
        aria-labelledby="final-cta-heading"
      >
        <div className="relative z-[1] mx-auto max-w-2xl">
          <Reveal>
            <h2
              id="final-cta-heading"
              className="text-3xl font-bold sm:text-4xl"
            >
              You&apos;ve already been through enough.
              <br className="hidden sm:block" />
              Let us handle the complexity.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-white/85 text-[1.05rem] leading-[1.75]">
              Upload your first report free and get your Cancer Profile in minutes. Paid plans unlock
              Doctor Prep Sheet PDFs, full trial matching, insurance appeals, and KindAuth for care teams.
            </p>
          </Reveal>

          {!signedIn && (
            <Reveal delay={0.1}>
              <div className="mt-10 flex justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-[#0F6E56] hover:bg-white/95 hover:text-[#085041] shadow-[0_4px_24px_rgba(0,0,0,0.18)] font-semibold"
                  data-analytics="final_cta_click"
                >
                  <Link href="/signup">
                    Upload your first report. It is free
                  </Link>
                </Button>
              </div>

              {/* Trust micro-copy */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-white/75">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" aria-hidden />
                  No raw data retained
                </span>
                <span aria-hidden>·</span>
                <span>No credit card</span>
                <span aria-hidden>·</span>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" aria-hidden />
                  Empathy Filter always on
                </span>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </main>
  );
}
