'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Check,
  ChevronDown,
  FileCheck,
  GitBranch,
  Heart,
  Lock,
  ScanSearch,
  Shield,
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
import { HOMEPAGE_HERO } from '@/lib/pricing-config';
import { isFeatureEnabled } from '@/lib/feature-flags';
import { JOURNEY_POSITIONING, JOURNEY_STAGE_HEADLINE, JOURNEY_STAGES } from '@/lib/journey/stages';
import { RARE_WOMENS_HERO_LINE } from '@/lib/cancers/landings';
import { SCOPED_RETENTION_BADGE } from '@/lib/legal/retention';
import { EMPATHY_FILTER_POLICY } from '@/lib/legal/empathy';
import {
  AFTER_TREATMENT_FAQ_ANSWER,
  AFTER_TREATMENT_FAQ_QUESTION,
  CONCIERGE_VAULT_RETENTION_CLAIM,
  isAfter90FlagOn,
} from '@/lib/after-90/config';

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
    desc: 'In Medicare Advantage, more than 80 percent of appealed prior authorization denials were overturned in the cited KFF brief.',
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
    title: 'Check for gaps',
    desc: 'Complete the Picture shows what the uploaded reports mention, what they do not mention, and questions worth asking next. It does not tell you which test to order.',
    icon: ScanSearch,
    devNote: false,
  },
  {
    n: '04',
    title: 'Get your Doctor Prep Sheet',
    desc: "A personalized list of questions based on your loved one's exact diagnosis, stage, and biomarkers. Organized by priority. PDF export is on Caregiver Pro.",
    icon: FileCheck,
    devNote: false,
  },
  {
    n: '05',
    title: 'Navigate every step from here',
    desc: 'Track your care timeline, explore clinical trials, respond to insurance denials, find financial aid, and prepare for second opinions, all in one place.',
    icon: GitBranch,
    devNote: false,
  },
];

const faqs = [
  {
    q: 'Is this medical advice? Can I trust what OncoKind tells me?',
    a: "OncoKind is an educational preparation tool. It helps you understand what your loved one's report says and what questions to bring to your oncologist. It is not a substitute for medical advice and never tries to be. Every output is guideline-informed and sourced from public education materials such as NCI resources. Your oncology team remains your primary guide.",
  },
  {
    q: 'Does OncoKind tell me which tests or treatments I need?',
    a: 'No. OncoKind helps you prepare questions for your care team. Your care team decides what is right for you.',
  },
  {
    q: 'Will anyone contact my providers for me?',
    a: 'OncoKind Concierge can collect records and follow up with intake offices after you authorize it. A person approves every outbound step. Tools stay self-serve unless you start a Concierge case.',
  },
  {
    q: "What happens to my loved one's medical records after I upload them?",
    a: isAfter90FlagOn('recordsVault')
      ? `Tools delete raw report text after processing unless you consent to the Records vault. ${CONCIERGE_VAULT_RETENTION_CLAIM}`
      : "Your raw file is not retained after processing. We extract what is needed to build your Cancer Profile, then the document is removed. Storage is encrypted. We have never retained raw PHI and our architecture is designed so that we cannot.",
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
  ...(isAfter90FlagOn('keepPlan')
    ? [{ q: AFTER_TREATMENT_FAQ_QUESTION, a: AFTER_TREATMENT_FAQ_ANSWER }]
    : []),
];

/* ─────────────────────────────────────────────────────────────
   HERO INLINE DEMO CARD
───────────────────────────────────────────────────────────── */

function HeroDemoCard() {
  return (
    <div className="rounded-2xl border border-[#cdd8d5] bg-white shadow-[0_8px_32px_rgba(15,110,86,0.10)] overflow-hidden">
      <div className="bg-[#E1F5EE] px-5 py-3 border-b border-[#cdd8d5]">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#0F6E56]">
          Sample Cancer Profile from a pathology report
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
                {HOMEPAGE_HERO.title}
              </h1>
              <p className="mt-5 max-w-[30rem] text-[1.05rem] leading-[1.75] text-[#5a6b68] hero-nudge-up hero-nudge-up-delay-2">
                {HOMEPAGE_HERO.subtitle}
              </p>
              <p className="mt-3 max-w-[30rem] text-sm leading-relaxed text-[#0F6E56]">
                {RARE_WOMENS_HERO_LINE}{' '}
                <Link href="/cancers" className="font-semibold underline-offset-2 hover:underline">
                  See diagnosis pages
                </Link>
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
                        Start First 72 Hours (Free)
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/concierge" data-analytics="hero_concierge_click">
                        Start Concierge Case ($299)
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Link href="/features" className="rounded-2xl border border-[#cdd8d5] bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#0F6E56]">Tools</p>
                  <p className="mt-1 font-semibold text-[#1e2d2b]">Do It Yourself</p>
                  <p className="mt-1 text-sm text-[#5a6b68]">
                    Get through the first 72 hours, decode reports, organize records, and prepare for doctor visits.
                  </p>
                </Link>
                <Link href="/concierge" className="rounded-2xl border border-[#cdd8d5] bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#0F6E56]">Concierge</p>
                  <p className="mt-1 font-semibold text-[#1e2d2b]">Have It Done For You</p>
                  <p className="mt-1 text-sm text-[#5a6b68]">
                    Records gathering, intake packet prep, and submission to the center you choose, until Case Ready.
                  </p>
                </Link>
              </div>

              {/* Trust micro-copy */}
              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-[#5a6b68]">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" aria-hidden />
                  {SCOPED_RETENTION_BADGE}
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
              {EMPATHY_FILTER_POLICY.homepage}
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
                  &ldquo;This is Stage IV vulvar squamous cell carcinoma. The cancer has spread
                  beyond the vulva. HPV-positive (p16+) status and a PD-L1 CPS of ≥10 are important
                  findings to review with the oncology team. Here are the questions to bring to the
                  first appointment...&rdquo;
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
        id="first-steps"
        className="scroll-mt-20 bg-[#f7faf9] px-4 py-[var(--section-padding-y)]"
      >
        <div className="mx-auto max-w-[var(--max-width-full)]">
          <Reveal className="text-center">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-4 text-3xl font-bold text-[#1e2d2b] sm:text-4xl">
              From report to ready, in minutes.
            </h2>
            <p className="mt-3 text-[1rem] text-[#5a6b68]">
              Five steps. No medical background required.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-5 lg:gap-5">
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
            <Link href="/features/first-72-hours" className="mt-4 inline-flex font-semibold text-[#0F6E56]">
              Open First 72 Hours
            </Link>
          </div>
        </section>
      ) : null}

      {/* ── 5. Features Grid ─────────────────────────────────── */}
      <section
        id="how-it-works"
        className="scroll-mt-20 bg-white px-4 py-[var(--section-padding-y)]"
      >
        <div className="mx-auto max-w-[var(--max-width-full)]">
          <Reveal className="text-center">
            <p className="eyebrow">What OncoKind builds for you</p>
            <h2 className="mt-4 text-3xl font-bold text-[#1e2d2b] sm:text-4xl">
              {JOURNEY_STAGE_HEADLINE}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-[1rem] text-[#5a6b68]">
              {JOURNEY_POSITIONING}
            </p>
          </Reveal>
          <div className="mt-10 overflow-visible rounded-3xl border border-[#cdd8d5] bg-[#f7faf9] p-5 sm:p-8">
            <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {JOURNEY_STAGES.map((stage, index) => (
                <li key={stage.id} className="min-w-0">
                  <Link href={stage.href} className="group block h-full text-left">
                    <p className="text-xs font-semibold tabular-nums text-[#0F6E56]">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <p className="mt-3 font-display text-xl font-semibold text-[#1e2d2b] group-hover:text-[#0F6E56]">
                      {stage.name}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[#5a6b68]">{stage.summary}</p>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
          <Reveal className="mt-10 text-center">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-full border border-[#cdd8d5] bg-white px-5 py-3 text-sm font-semibold text-[#0F6E56] shadow-sm transition-colors hover:border-[#0F6E56] hover:bg-[#E1F5EE]"
            >
              See all features
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── 6. Founder Trust Bridge ──────────────────────────── */}
      <section className="bg-[#1e2d2b] px-4 py-[var(--section-padding-y)] text-white">
        <div className="mx-auto max-w-[var(--max-width-full)]">
          <Reveal className="text-center">
            <p className="eyebrow" style={{ color: '#9FE1CB' }}>Why this exists</p>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
              Why this exists, and why it&apos;s personal.
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
                  cancer at 9. My grandfather at 15. My dad had a kidney removed at 16. My cousin,
                  who was more like a brother, died one month after his diagnosis at 28. And
                  when my mom&apos;s diagnosis came, I still couldn&apos;t read her pathology
                  report. I still didn&apos;t know what her biomarkers meant. I still sat in a
                  waiting room without the questions I should have been asking. Every feature in
                  OncoKind exists because a family needed it and couldn&apos;t find it anywhere.
                  This is the tool I wish I had.&rdquo;
                </blockquote>
                <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[#9FE1CB]">
                  Mike Nielson, Founder &amp; CEO, OncoKind
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
              Start First 72 Hours free, or start a Concierge case and let our team handle records and intake.
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
                    Start free
                  </Link>
                </Button>
              </div>

              {/* Trust micro-copy */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-white/75">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" aria-hidden />
                  {SCOPED_RETENTION_BADGE}
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
