'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
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
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */

const stats = [
  {
    figure: '91%',
    desc: 'of cancer caregivers feel ill-equipped to navigate medical terminology and clinical trials',
    cite: 'JCO Oncology Practice, 2023',
  },
  {
    figure: '99.9%',
    desc: 'of insurance denials are never appealed — and about half who do appeal, win',
    cite: 'Industry research',
  },
  {
    figure: '~20 min',
    desc: 'average oncology appointment length, often while the family is in shock',
    cite: 'Healthcare system data',
  },
];

const testimonials = [
  {
    quote:
      "I had never heard about clinical trials. No one ever brought them up with me. I was so shocked I didn\u2019t know about this.",
    attribution: 'Family caregiver — stage IV cancer',
  },
  {
    quote:
      "I felt like for a while I was doing this by myself. Not knowing what I was doing.",
    attribution: 'Family caregiver — advanced cancer',
  },
];

const sourceBadges = [
  'NCCN Clinical Guidelines',
  'NCI — cancer.gov',
  'JCO Oncology Practice',
  'Oncology Social Workers',
  'Patient Advocates',
];

const steps = [
  {
    n: '01',
    title: 'Upload your report',
    desc: 'Securely upload any pathology report, scan result, or discharge summary — PDF or image. Your raw file is not retained after processing.',
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
    desc: 'A personalized list of questions based on your loved one\'s exact diagnosis, stage, and biomarkers. Organized by priority. Exportable as PDF. Ready before Tuesday\'s appointment.',
    icon: FileCheck,
    devNote: false,
  },
  {
    n: '04',
    title: 'Navigate every step from here',
    desc: 'Track your care timeline, explore clinical trials, respond to insurance denials, find financial aid, and prepare for second opinions — all in one place, at any stage of the journey.',
    icon: GitBranch,
    devNote: false,
  },
];

const features = [
  {
    href: '/features/doctor-prep-sheet',
    title: 'Doctor Prep Sheet',
    desc: 'Personalized questions based on your loved one\'s exact diagnosis, stage, and biomarkers. Organized by priority. Exportable as PDF before every appointment.',
    Icon: Calendar,
    tag: 'Most impactful',
    tagStyle: 'bg-[#E1F5EE] text-[#0F6E56] border border-[#9FE1CB]',
  },
  {
    href: '/features/clinical-trial-matching',
    title: 'Clinical Trial Matching',
    desc: 'Live matching against ClinicalTrials.gov, filtered by location, cancer type, stage, and biomarkers. Every match explained in plain English.',
    Icon: FlaskConical,
    tag: 'Real-time data',
    tagStyle: 'bg-[#E1F5EE] text-[#0F6E56] border border-[#9FE1CB]',
  },
  {
    href: '/features/insurance-denial-defense',
    title: 'Insurance Denial Defense',
    desc: 'Upload your denial letter. OncoKind decodes the stated reason in plain English and generates a structured appeal packet — including the regulatory language insurers respond to.',
    Icon: ShieldCheck,
    tag: 'Advocate Plan',
    tagStyle: 'bg-[#FAEEDA] text-[#8b5e2a] border border-[#f0d5b8]',
  },
  {
    href: '/features/empathy-filter',
    title: 'The Empathy Filter',
    desc: 'Every output removes survival statistics and fear-based language. You get clarity and preparation — not prognosis. No other tool has built this by design.',
    Icon: Heart,
    tag: 'Our differentiator',
    tagStyle: 'bg-[#FAEEDA] text-[#8b5e2a] border border-[#f0d5b8]',
  },
  {
    href: '/journey/second-opinion',
    title: 'Second Opinion Mode',
    desc: 'A complete intake packet for a new oncologist: report summary, treatment history, current questions, and key findings — formatted for a new care team.',
    Icon: FileText,
    tag: 'Often overlooked',
    tagStyle: 'bg-[#E1F5EE] text-[#0F6E56] border border-[#9FE1CB]',
  },
  {
    href: '/journey/financial-help',
    title: 'Financial Help',
    desc: 'Live matching to pharmaceutical co-pay programs, foundation grants, and financial aid. Most families never find out these programs exist.',
    Icon: HandCoins,
    tag: 'All plans',
    tagStyle: 'bg-[#E1F5EE] text-[#0F6E56] border border-[#9FE1CB]',
  },
  {
    href: '/journey/timeline',
    title: 'Care Timeline',
    desc: 'A living record of your loved one\'s cancer journey. Document diagnoses, appointments, and milestones — so you always know exactly where you\'ve been and what comes next.',
    Icon: GitBranch,
    tag: 'Pro + Advocate',
    tagStyle: 'bg-[#E1F5EE] text-[#0F6E56] border border-[#9FE1CB]',
  },
  {
    href: '/community',
    title: 'Community Access',
    desc: 'Moderated caregiver conversations, real support. You are not alone in this. Read and participate in caregiver-only discussions, moderated for safety and compassion.',
    Icon: MessageCircle,
    tag: 'All plans',
    tagStyle: 'bg-[#E1F5EE] text-[#0F6E56] border border-[#9FE1CB]',
  },
  {
    href: '/prior-auth-pro',
    title: 'Prior Authorization Engine',
    desc: 'Generate a complete prior authorization letter in minutes — built around your loved one\'s exact diagnosis, biomarkers, and NCCN guidelines. Turn a 10-hour task into one upload.',
    Icon: ClipboardList,
    tag: 'Professional',
    tagStyle: 'bg-[#1e2d2b] text-white border border-[#1e2d2b]',
  },
];

const faqs = [
  {
    q: 'Is this medical advice? Can I trust what OncoKind tells me?',
    a: 'OncoKind is an educational preparation tool — it helps you understand what your loved one\'s report says and what questions to bring to your oncologist. It is not a substitute for medical advice and never tries to be. Every output is sourced from NCCN guidelines and NCI resources. Your oncology team remains your primary guide.',
  },
  {
    q: 'What happens to my loved one\'s medical records after I upload them?',
    a: 'Your raw file is not retained after processing. We extract what\'s needed to build your Cancer Profile, then the document is removed. Storage is encrypted. We have never retained raw PHI and our architecture is designed so that we can\'t.',
  },
  {
    q: 'I\'m not very tech-savvy. Is this hard to use?',
    a: 'The core experience is: upload a PDF, read the plain-English summary, review your question list. That\'s it. You can see exactly what the output looks like in the sample demo on this page before you create an account. If you can send an email attachment, you can use OncoKind.',
  },
  {
    q: 'My oncologist is very thorough. Do I really need this?',
    a: 'Most oncologists are thorough — and most appointments are 15–20 minutes long, while the family is still processing the diagnosis. OncoKind doesn\'t replace your oncologist. It helps you arrive at the appointment with the right questions and understand what you heard afterward.',
  },
  {
    q: 'What does \'free\' actually include?',
    a: 'One report translation per month, a full Cancer Profile, clinical trial matches, and read-only community access. No credit card required to start. Doctor Prep Sheets, unlimited reports, and insurance denial support are in paid plans. Full details on the pricing page.',
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
        <DemoRow label="Cancer type" value="Non-small cell lung cancer (NSCLC)" />
        <DemoRow label="Stage" value="Stage IIIA" />
        <DemoRow
          label="PD-L1 biomarker"
          value="60%"
          note="Immunotherapy may be especially effective"
          notePositive
        />
        <DemoRow
          label="EGFR"
          value="Negative"
          note="Targeted therapies not the current focus"
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
          Fictional sample patient. For educational illustration only.
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
                OncoKind translates your loved one&apos;s pathology report into plain English,
                prepares you for every oncology appointment, and guides your family through every
                step of the cancer journey — without survival statistics, without fear.
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
                        Upload your first report — it&apos;s free
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
            {stats.map((s) => (
              <div
                key={s.figure}
                className="rounded-2xl border border-[#cdd8d5] bg-white p-7 text-center shadow-sm"
              >
                <p className="font-bold text-[2.5rem] leading-none text-[#0F6E56]">{s.figure}</p>
                <p className="mt-3 text-sm leading-[1.7] text-[#5a6b68]">{s.desc}</p>
                <p className="mt-2 text-xs text-[#5a6b68]/70">{s.cite}</p>
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
                  — {t.attribution}
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
              Every word OncoKind generates passes through our Empathy Filter — removing survival
              rates, mortality framing, and fear-based language before it reaches you. No other
              tool has built this by design.
            </p>
          </Reveal>

          <div className="mt-12 grid items-stretch gap-5 sm:grid-cols-2 lg:gap-8 max-w-3xl mx-auto">
            {/* Google panel */}
            <Reveal>
              <div className="h-full rounded-2xl border border-red-200 bg-[#FCEBEB] p-6">
                <p className="mb-4 text-xs font-bold uppercase tracking-widest text-red-700">
                  ⚠ What a Google search returns
                </p>
                <p className="font-mono text-sm leading-[1.75] text-red-900">
                  &ldquo;Non-small cell lung cancer Stage IIIA has a 5-year survival rate of
                  approximately 36%. Median survival with current treatment protocols is 18–24
                  months. Prognosis is significantly affected by...&rdquo;
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
              From report to ready — in minutes.
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

      {/* ── 5. Features Grid ─────────────────────────────────── */}
      <section
        id="features"
        className="scroll-mt-20 bg-white px-4 py-[var(--section-padding-y)]"
      >
        <div className="mx-auto max-w-[var(--max-width-full)]">
          <Reveal className="text-center">
            <p className="eyebrow">What OncoKind builds for you</p>
            <h2 className="mt-4 text-3xl font-bold text-[#1e2d2b] sm:text-4xl">
              Nine tools. One mission: prepare you for what&apos;s next.
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
            {features.map((f) => (
              <div
                key={f.title}
                className="hover-lift-card flex flex-col rounded-2xl border border-[#cdd8d5] bg-white p-6 shadow-sm"
              >
                <f.Icon
                  className="h-8 w-8 text-[#0F6E56]"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-semibold text-[#1e2d2b]">{f.title}</h3>
                  <span
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide',
                      f.tagStyle
                    )}
                  >
                    {f.tag}
                  </span>
                </div>
                <p className="mt-2 flex-1 text-sm leading-[1.75] text-[#5a6b68]">{f.desc}</p>
                <Link
                  href={f.href}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-[#0F6E56] hover:text-[#085041]"
                >
                  Learn more
                  <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
                </Link>
              </div>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* ── 6. Founder Trust Bridge ──────────────────────────── */}
      <section className="bg-[#1e2d2b] px-4 py-[var(--section-padding-y)] text-white">
        <div className="mx-auto max-w-[var(--max-width-wide)]">
          <Reveal className="text-center">
            <p className="eyebrow" style={{ color: '#9FE1CB' }}>Why this exists</p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Why this exists — and why it&apos;s personal.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mx-auto mt-10 max-w-2xl">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 sm:p-10">
              <blockquote className="text-[1.05rem] leading-[1.85] text-white/90 italic">
                &ldquo;I built OncoKind because my mom is fighting Stage 4 cancer and I had no idea
                what any of it meant. I lost my grandmother to cancer at 9. My grandfather at 15.
                My dad had a kidney removed at 16. My cousin — who was more like a brother — died
                one month after his diagnosis at 28. And when my mom&apos;s diagnosis came, I still
                couldn&apos;t read her pathology report. I still didn&apos;t know what her
                biomarkers meant. I still sat in a waiting room without the questions I should have
                been asking. Every feature in OncoKind exists because a family needed it and
                couldn&apos;t find it anywhere. This is the tool I wish I had.&rdquo;
              </blockquote>
              <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[#9FE1CB]">
                — Mike Nielson, Founder &amp; CEO, OncoKind
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2} className="mt-8 text-center">
            <Link
              href="/about"
              className="text-sm text-white/60 underline-offset-4 hover:text-white hover:underline"
            >
              Read the full founder story →
            </Link>
          </Reveal>
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
              Upload your first report free. Get your Cancer Profile, Doctor Prep Sheet, and
              clinical trial matches in minutes. No credit card. No jargon. No survival statistics.
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
                    Upload your first report — free
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
