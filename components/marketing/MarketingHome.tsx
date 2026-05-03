'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  FileCheck,
  FileUp,
  FlaskConical,
  GitBranch,
  Globe,
  HandCoins,
  ListOrdered,
  Lock,
  MessageCircle,
  Minus,
  Heart,
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

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const steps = [
  {
    n: 1,
    title: 'Upload Your Report',
    desc: 'Securely upload your pathology report or scan.',
    icon: Upload,
  },
  {
    n: 2,
    title: 'Get Clear Results',
    desc: 'AI translates complex medical language into plain English.',
    icon: Sparkles,
  },
  {
    n: 3,
    title: 'Prepare for Your Appointment',
    desc: 'Your Doctor Prep Sheet is ready before you walk in.',
    icon: FileCheck,
  },
  {
    n: 4,
    title: 'Navigate with Confidence',
    desc: 'Track your care timeline. Match clinical trials. Get support.',
    icon: ListOrdered,
  },
];

const features = [
  {
    href: '/signup',
    title: 'Doctor Prep Sheet',
    desc: 'Walk into every appointment fully prepared.',
    Icon: Calendar,
  },
  {
    href: '/journey/trials',
    title: 'Clinical Trial Matching',
    desc: 'Find trials you may qualify for, explained in plain language.',
    Icon: FlaskConical,
  },
  {
    href: '/empathy-filter',
    title: 'Empathy Filter',
    desc: 'Every word is chosen to support you — not scare you.',
    Icon: Heart,
  },
  {
    href: '/community',
    title: 'Community Access',
    desc: 'Read moderated caregiver conversations and share support with Advocate access.',
    Icon: MessageCircle,
  },
  {
    href: '/journey/timeline',
    title: 'Care Timeline',
    desc: "A living record of your loved one's cancer journey.",
    Icon: GitBranch,
  },
  {
    href: '/journey/second-opinion',
    title: 'Second Opinion Mode',
    desc: 'Build a complete packet for a new oncologist.',
    Icon: FileCheck,
  },
  {
    href: '/journey/financial-help',
    title: 'Financial Help',
    desc: 'Track live co-pay and foundation support options matched to the diagnosis.',
    Icon: HandCoins,
  },
  {
    href: '/journey/insurance-support',
    title: 'Insurance Support',
    desc: 'Decode denials and generate structured appeal packets with Advocate access.',
    Icon: ShieldCheck,
  },
  {
    href: '/',
    title: 'Multi-Language',
    desc: 'Available in English, Spanish, 中文, and Tagalog.',
    Icon: Globe,
  },
];

const trustTiles = [
  {
    Icon: Shield,
    title: 'HIPAA-Conscious Design',
    desc: 'Designed with clinicians and caregivers with privacy in mind.',
  },
  {
    Icon: Lock,
    title: 'Zero Raw Report Retention',
    desc: 'We process your report without keeping raw files after use.',
  },
  {
    Icon: MessageCircle,
    title: 'Empathy Filter on Every Output',
    desc: 'Language that helps you prepare — not fear.',
  },
  {
    Icon: FlaskConical,
    title: 'Real-Time Clinical Trial Matching',
    desc: 'Explore trials in plain language, near you.',
  },
  {
    Icon: ShieldCheck,
    title: 'Appeals + Funding Support',
    desc: 'Insurance denial decoding and live financial help for tougher care decisions.',
  },
];

const comparisonRows: [string, string, string, string][] = [
  ['Report processing', '1/month', 'Unlimited', 'Unlimited + batch'],
  ['Trial matches', 'Limited', 'Full (50mi)', 'Full + custom'],
  ['Insurance Denial Defense', '—', '✓', '✓'],
  ['Live Financial Aid Tracker', '—', '✓', '✓'],
  ['NCCN-aligned advocate sheets', '—', '✓', '✓'],
  ['Appointment Check-In', '—', '✓', '✓'],
  ['Community Access', 'Read only', '✓', '✓'],
  ['Multi-patient dashboard', '—', '—', '✓'],
];

export function MarketingHome({ signedIn }: { signedIn: boolean }) {
  const reduce = useReducedMotion();

  return (
    <main className="bg-[var(--color-bg-page)]">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:pb-20 sm:pt-16 lg:pb-28 lg:pt-20">
        <div
          className="pointer-events-none absolute inset-0 hero-texture"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-100"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(58,97,134,0.08) 0%, transparent 70%)',
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-[var(--max-width-full)]">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              {/* Static hero copy for fast LCP — avoid opacity:0 until JS (Framer) hydrates */}
              <h1 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[var(--leading-tight)] tracking-[var(--tracking-tight)] text-[var(--color-primary-900)]">
                Navigate Cancer Care With{' '}
                <em className="font-display not-italic text-[var(--color-accent-500)]">Clarity</em>
              </h1>
              <p className="mt-3 text-sm font-semibold text-[var(--color-primary-600)] hero-nudge-up">
                <Link
                  href="/about#founder-section"
                  className="nav-link-underline underline-offset-4 hover:text-[var(--color-primary-900)]"
                >
                  Built by a caregiver, for caregivers.
                </Link>
              </p>
              <p className="mt-5 max-w-[30rem] text-lg leading-[var(--leading-relaxed)] text-[var(--color-text-secondary)] hero-nudge-up hero-nudge-up-delay-1">
                Understand diagnoses, explore treatment options, and find the best steps for your loved
                one.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap hero-nudge-up hero-nudge-up-delay-2">
                {signedIn ? (
                  <Button asChild size="lg">
                    <Link href="/journey">Go to Journey</Link>
                  </Button>
                ) : (
                  <>
                    <Button asChild size="lg">
                      <Link href="/signup" className="flex items-center gap-2">
                        <FileUp className="h-5 w-5" />
                        Upload Your Medical Report
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                      <Link href="/#sample-demo">Try a Sample Report</Link>
                    </Button>
                  </>
                )}
              </div>
              <p className="mt-6 flex flex-wrap items-center gap-2 text-xs font-medium tracking-[var(--tracking-wide)] text-[var(--color-text-muted)]">
                <Lock className="h-3.5 w-3.5" aria-hidden />
                HIPAA-conscious · Zero raw report retention
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <DashboardPreview />
            </div>
          </div>
          <SampleReportDemo />
          <motion.div
            className="mt-14 flex flex-col items-center gap-2 text-[var(--color-text-muted)]"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <span className="text-xs tracking-[var(--tracking-wide)]">Scroll to see how it works</span>
            <motion.span
              aria-hidden
              animate={reduce ? undefined : { y: [0, 6, 0] }}
              transition={reduce ? undefined : { repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <ChevronDown className="h-5 w-5" />
            </motion.span>
          </motion.div>
        </div>
      </section>

      <SectionWave fill="var(--color-bg-section-alt)" />

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-24 bg-[var(--color-bg-section-alt)] px-4 py-[var(--section-padding-y)]"
      >
        <div className="mx-auto max-w-[var(--max-width-full)]">
          <Reveal className="text-center">
            <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)] sm:text-4xl">
              How It Works
            </h2>
          </Reveal>
          <div className="relative mt-16 lg:mt-20">
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {steps.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.12} className="relative">
                  {i < steps.length - 1 && (
                    <div
                      className="absolute left-[calc(50%+2rem)] top-12 hidden h-px w-[calc(100%-1rem)] border-t border-dashed border-[var(--color-border)] lg:block"
                      aria-hidden
                    />
                  )}
                  <div className="hover-lift-card relative rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-8 shadow-[var(--shadow-md)]">
                    <span
                      className="pointer-events-none absolute right-6 top-4 font-display text-[5rem] font-bold leading-none text-[var(--color-primary-900)]/[0.07]"
                      aria-hidden
                    >
                      {step.n}
                    </span>
                    <step.icon
                      className="relative z-[1] h-10 w-10 text-[var(--color-sage-500)]"
                      strokeWidth={1.5}
                    />
                    <h3 className="relative z-[1] mt-4 font-display text-xl font-semibold text-[var(--color-primary-900)]">
                      {step.title}
                    </h3>
                    <p className="relative z-[1] mt-2 text-[var(--color-text-secondary)]">{step.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SectionWave flip fill="var(--color-bg-page)" />

      {/* Features */}
      <section
        id="features"
        className="scroll-mt-24 bg-white px-4 py-[var(--section-padding-y)]"
      >
        <div className="mx-auto max-w-[var(--max-width-full)]">
          <Reveal className="text-center">
            <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)] sm:text-4xl">
              Built to help you prepare with confidence
            </h2>
          </Reveal>
          <RevealStagger
            className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            stagger={0.08}
          >
            {features.map((f) => (
              <div
                key={f.title}
                className="hover-lift-card group rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-100)] p-8 shadow-[var(--shadow-sm)]"
              >
                <motion.div
                  initial={reduce ? false : { opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, ease: easeOutExpo }}
                >
                  <f.Icon className="h-10 w-10 text-[var(--color-sage-500)]" strokeWidth={1.5} />
                </motion.div>
                <h3 className="mt-4 font-sans text-lg font-semibold text-[var(--color-primary-900)]">
                  {f.title}
                </h3>
                <p className="mt-2 text-[var(--color-text-secondary)]">{f.desc}</p>
                <Link
                  href={f.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-accent-600)] transition-colors hover:text-[var(--color-accent-500)]"
                >
                  Learn more about {f.title}
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                </Link>
              </div>
            ))}
          </RevealStagger>
        </div>
      </section>

      {/* Trusted guidance — editorial split */}
      <section
        aria-labelledby="trusted-guidance-heading"
        className="overflow-hidden bg-[var(--color-bg-page)] px-0 py-[var(--section-padding-y)]"
      >
        <h2 id="trusted-guidance-heading" className="sr-only">
          Trusted guidance for families
        </h2>
        <div className="mx-auto grid max-w-[var(--max-width-full)] lg:grid-cols-2">
          <Reveal className="flex flex-col justify-center bg-[var(--color-bg-dark)] px-6 py-16 sm:px-12 lg:px-16">
            <blockquote className="font-display text-2xl font-medium italic leading-snug text-[var(--color-text-inverse)] sm:text-3xl">
              &ldquo;You shouldn&apos;t have to understand oncology to advocate for someone you love.&rdquo;
            </blockquote>
            <p className="mt-8 text-xs font-bold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-400)]">
              — The OncoKind Promise
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-px bg-[var(--color-border)] sm:grid-cols-2">
            {trustTiles.map((t) => (
              <Reveal
                key={t.title}
                className="flex flex-col gap-3 bg-[var(--color-surface-100)] p-8 sm:p-10"
              >
                <t.Icon className="h-8 w-8 text-[var(--color-sage-500)]" strokeWidth={1.5} />
                <h3 className="font-sans text-lg font-semibold text-[var(--color-primary-900)]">
                  {t.title}
                </h3>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{t.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* For professionals */}
      <section className="bg-[var(--color-bg-dark)] px-4 py-[var(--section-padding-y)] text-[var(--color-text-inverse)]">
        <div className="mx-auto max-w-[var(--max-width-wide)] text-center">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">For Professionals</h2>
            <p className="mx-auto mt-4 max-w-2xl text-[var(--color-surface-300)]">
              Built for patient advocates, care navigators, and concierge health services.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-wrap justify-center gap-3 sm:gap-4">
              {[
                'Multi-patient dashboard',
                'Batch processing',
                'Branded reports',
                'Concierge workflow support',
              ].map((feature) => (
                <div
                  key={feature}
                  className="rounded-full border border-[var(--color-primary-600)] bg-[var(--color-primary-800)]/40 px-5 py-2.5 text-sm font-medium text-[var(--color-surface-200)]"
                >
                  {feature}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <Button asChild size="lg" className="mt-10">
              <Link href="/pricing#enterprise">View Enterprise Options</Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="bg-[var(--color-surface-200)] px-4 py-[var(--section-padding-y)]">
        <div className="mx-auto max-w-[var(--max-width-full)]">
          <Reveal className="text-center">
            <h2 className="font-display text-3xl font-semibold text-[var(--color-primary-900)] sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[var(--color-text-secondary)]">
              Start free. Upgrade when you need more.
            </p>
          </Reveal>
          <div className="mt-14 grid items-stretch gap-8 lg:grid-cols-3 lg:gap-6">
            {/* Free */}
            <Reveal className="h-full">
              <div className="hover-lift-card flex h-full flex-col rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-8 text-center shadow-[var(--shadow-md)]">
                <span className="mx-auto inline-flex rounded-full bg-[var(--color-surface-200)] px-3 py-1 text-[var(--text-xs)] font-bold uppercase tracking-[var(--tracking-widest)] text-[var(--color-primary-700)]">
                  For First Steps
                </span>
                <h3 className="font-display text-xl font-semibold text-[var(--color-primary-900)]">Free</h3>
                <p className="mt-2 text-sm font-medium text-[var(--color-primary-700)]">Try OncoKind</p>
                <p className="mt-6 font-display text-4xl font-semibold text-[var(--color-primary-900)]">
                  $0
                </p>
                <ul className="mt-8 flex-1 space-y-3 text-left text-sm text-[var(--color-text-secondary)]">
                  {['Diagnosis explanation', 'Basic care map', '1 report per month'].map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-sage-500)]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="mt-8 w-full">
                  <Link href="/signup">Get Started</Link>
                </Button>
              </div>
            </Reveal>
            {/* Advocate */}
            <Reveal delay={0.08} className="h-full lg:-mt-4 lg:mb-4">
              <div
                className="relative flex h-full flex-col rounded-[var(--radius-xl)] border-t-[3px] border-t-[var(--color-accent-400)] bg-[var(--color-primary-900)] p-8 text-center text-[var(--color-text-inverse)] shadow-[0_0_60px_rgba(232,168,56,0.15)] motion-safe:transition-transform motion-safe:duration-300 lg:scale-[1.04]"
              >
                <span className="absolute -right-1 top-4 rotate-3 rounded-full bg-[var(--color-accent-400)] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-primary-900)]">
                  Most Popular
                </span>
                <span className="mx-auto inline-flex rounded-full bg-white/10 px-3 py-1 text-[var(--text-xs)] font-bold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-400)]">
                  For Caregivers
                </span>
                <h3 className="font-display text-xl font-semibold">Advocate Plan</h3>
                <p className="mt-2 text-sm font-medium text-[var(--color-surface-200)]">
                  Insurance defense, financial navigation, and advanced oncology prep.
                </p>
                <p className="mt-6 font-display text-4xl font-semibold sm:text-5xl">$49</p>
                <p className="text-sm text-[var(--color-surface-400)]">/month</p>
                <ul className="mt-8 flex-1 space-y-3 text-left text-sm text-[var(--color-surface-200)]">
                  {[
                    'Insurance Denial Defense',
                    'Live Financial Aid Tracker',
                    'NCCN-Aligned Advocate Sheets',
                    'Clinical trial matching (50mi)',
                    'Care timeline',
                    'Unlimited reports',
                    'Doctor Prep Sheet (PDF)',
                    'Appointment Check-In',
                    'Community Access',
                  ].map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent-400)]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-8 w-full">
                  <Link href="/pricing?plan=advocate">View Advocate Plan</Link>
                </Button>
              </div>
            </Reveal>
            {/* Professional */}
            <Reveal delay={0.12} className="h-full">
              <div className="hover-lift-card flex h-full flex-col rounded-[var(--radius-xl)] border-[1.5px] border-[var(--color-primary-800)] bg-white p-8 text-center shadow-[var(--shadow-md)]">
                <span className="mx-auto inline-flex rounded-full border border-[var(--color-primary-300)] bg-[var(--color-surface-200)] px-3 py-1 text-[var(--text-xs)] font-bold uppercase tracking-[var(--tracking-widest)] text-[var(--color-primary-800)]">
                  For Care Teams
                </span>
                <h3 className="mt-4 font-display text-xl font-semibold text-[var(--color-primary-900)]">
                  Professional
                </h3>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  For Care Teams & Concierge Health Services
                </p>
                <p className="mt-6 font-display text-4xl font-semibold text-[var(--color-primary-900)]">
                  $999
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">/month</p>
                <ul className="mt-8 flex-1 space-y-3 text-left text-sm text-[var(--color-text-secondary)]">
                  {[
                    'Everything in Advocate Plan',
                    'Multi-patient dashboard',
                    'Batch document analysis',
                    'Branded portal',
                    'HIPAA BAA flow',
                    'Clinic integrations',
                    'Dedicated support',
                  ].map((f) => (
                    <li key={f} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-sage-500)]" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="outline" className="mt-8 w-full border-[var(--color-primary-800)]">
                  <Link href="/pricing#enterprise">Contact</Link>
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal className="mt-16 overflow-x-auto rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white shadow-[var(--shadow-sm)]">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-100)]">
                  <th className="px-4 py-4 font-sans font-semibold text-[var(--color-primary-900)] sm:px-6">
                    Feature
                  </th>
                  {(['Free', 'Advocate Plan', 'Professional'] as const).map((h) => (
                    <th
                      key={h}
                      className="px-4 py-4 text-center font-sans font-semibold text-[var(--color-primary-900)] sm:px-6"
                    >
                      <span className="inline-block rounded-full bg-[var(--color-surface-200)] px-3 py-1 text-xs uppercase tracking-[var(--tracking-widest)] text-[var(--color-primary-700)]">
                        {h}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map(([feature, free, advocate, prof], row) => (
                  <tr
                    key={feature}
                    className={cn(
                      'border-b border-[var(--color-border-subtle)]',
                      row % 2 === 1 && 'bg-[var(--color-surface-100)]/60'
                    )}
                  >
                    <td className="px-4 py-4 font-medium text-[var(--color-primary-900)] sm:px-6">
                      {feature}
                    </td>
                    {[free, advocate, prof].map((cell, ci) => (
                      <td
                        key={`${feature}-${ci}`}
                        className="px-4 py-4 text-center text-[var(--color-text-secondary)] sm:px-6"
                      >
                        {cell === '—' || cell === '' ? (
                          <Minus className="mx-auto h-4 w-4 text-[var(--color-text-muted)]" />
                        ) : cell.includes('✓') ? (
                          <span className="inline-flex items-center justify-center gap-1 font-medium text-[var(--color-accent-600)]">
                            <Check className="h-4 w-4 shrink-0" aria-hidden />
                            {cell.replace(/✓/g, '').trim() ? (
                              <span>{cell.replace(/✓/g, '').trim()}</span>
                            ) : null}
                          </span>
                        ) : (
                          cell
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Reveal>

          <p className="mt-10 text-center">
            <Link
              href="/pricing"
              className="text-sm font-semibold text-[var(--color-primary-700)] underline-offset-4 hover:underline"
              aria-label="View full pricing details"
            >
              View Full Pricing, including Advocate →
            </Link>
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="cta-noise relative bg-[var(--color-bg-dark)] px-4 py-[var(--section-padding-y)] text-center text-[var(--color-text-inverse)]">
        <div className="relative z-[1] mx-auto max-w-2xl">
          <Reveal>
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Start with clarity today.</h2>
            <p className="mt-4 text-[var(--color-surface-300)]">
              Join families and advocates who use OncoKind to prepare for their oncology appointments.
            </p>
          </Reveal>
          {!signedIn && (
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/signup">Upload Medical Report</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-[var(--color-text-inverse)] text-[var(--color-text-inverse)] hover:bg-[var(--color-text-inverse)] hover:text-[var(--color-primary-900)]"
                >
                  <Link href="/#sample-demo">Try a Sample Report</Link>
                </Button>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </main>
  );
}
