'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, Loader2, Heart, Lock, FlaskConical, Calendar } from 'lucide-react';

const WAITLIST_END_DATE = process.env.NEXT_PUBLIC_WAITLIST_END_DATE ?? '2026-06-30T23:59:59Z';

function isWaitlistActive(): boolean {
  if (process.env.NEXT_PUBLIC_WAITLIST_ENABLED === 'false') return false;
  return new Date() < new Date(WAITLIST_END_DATE);
}

const BENEFITS = [
  {
    Icon: Calendar,
    headline: 'Early access before public launch',
    body: "You'll be among the first to upload a report and see what OncoKind can do for your family.",
  },
  {
    Icon: Heart,
    headline: 'Founding member pricing',
    body: 'Waitlist members receive a permanent discount on paid plans — our way of saying thank you for believing before the world did.',
  },
  {
    Icon: Lock,
    headline: 'Privacy built in from day one',
    body: 'Your email is stored securely and never shared. We will only email you about OncoKind — never third parties.',
  },
  {
    Icon: FlaskConical,
    headline: 'Shape what we build',
    body: 'Early members can send direct feedback to the founder. The features you need most will get prioritized.',
  },
];

export default function WaitlistPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [alreadyJoined, setAlreadyJoined] = useState(false);

  const active = isWaitlistActive();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), name: name.trim(), source: 'page' }),
      });
      const data: { ok?: boolean; already?: boolean; error?: string } = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      if (data.already) setAlreadyJoined(true);
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Network error — please check your connection and try again.');
    }
  }

  return (
    <main className="bg-[var(--bg-base)]">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        className="px-4 py-20 sm:py-28"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div className="mx-auto max-w-[var(--max-width-content)] text-center">
          <p className="eyebrow">{'// '}OncoKind is launching soon</p>
          <h1 className="mt-4 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-tight text-[var(--color-text-primary)]">
            Be the first to help a family navigate cancer with clarity.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-text-secondary)]">
            OncoKind is a platform built specifically for family caregivers — the adult children,
            spouses, and siblings navigating cancer for the first time. Join the waitlist to get
            early access when we launch.
          </p>
        </div>
      </section>

      {/* ── Form + Benefits ──────────────────────────────────── */}
      <section className="px-4 pb-20 sm:pb-28">
        <div className="mx-auto grid max-w-[var(--max-width-wide)] gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Form card */}
          <div className="rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-white p-8 shadow-[var(--shadow-lg)] sm:p-10">
            {!active ? (
              <div className="text-center">
                <p className="font-display text-2xl font-semibold text-[var(--color-text-primary)]">
                  The waitlist is now closed.
                </p>
                <p className="mt-3 text-[var(--color-text-secondary)]">
                  OncoKind has launched! Visit the homepage to get started free.
                </p>
                <Link
                  href="/"
                  className="mt-8 inline-block rounded-full bg-[var(--brand-primary)] px-8 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-secondary)]"
                >
                  Go to OncoKind →
                </Link>
              </div>
            ) : status === 'success' ? (
              <div className="py-4 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f0f7f5]">
                  <Check className="h-7 w-7 text-[var(--brand-primary)]" />
                </div>
                <h2 className="mt-5 font-display text-2xl font-semibold text-[var(--color-text-primary)]">
                  {alreadyJoined ? "You're already on the list." : "You're on the waitlist."}
                </h2>
                <p className="mt-3 leading-relaxed text-[var(--color-text-secondary)]">
                  {alreadyJoined
                    ? "We already have your email. We'll reach out before launch — thank you for your patience."
                    : "Check your inbox — we sent you a confirmation with details on what comes next. We'll be in touch before launch."}
                </p>
                <p className="mt-6 text-sm text-[var(--color-text-muted)]">
                  In the meantime,{' '}
                  <Link href="/learn" className="text-[var(--brand-primary)] underline-offset-2 hover:underline">
                    explore our Learn resources
                  </Link>{' '}
                  or{' '}
                  <Link href="/about" className="text-[var(--brand-primary)] underline-offset-2 hover:underline">
                    read the founder story
                  </Link>
                  .
                </p>
              </div>
            ) : (
              <>
                <h2 className="font-display text-2xl font-semibold text-[var(--color-text-primary)]">
                  Join the waitlist
                </h2>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                  We&rsquo;ll email you before launch with early access details.
                  No spam, ever.
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
                  <div>
                    <label
                      htmlFor="wl-name"
                      className="block text-sm font-medium text-[var(--color-text-primary)]"
                    >
                      First name{' '}
                      <span className="font-normal text-[var(--color-text-muted)]">(optional)</span>
                    </label>
                    <input
                      id="wl-name"
                      type="text"
                      name="name"
                      autoComplete="given-name"
                      placeholder="Alex"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={status === 'loading'}
                      className="mt-1.5 block w-full rounded-xl border border-[var(--color-border)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 disabled:opacity-60"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="wl-email"
                      className="block text-sm font-medium text-[var(--color-text-primary)]"
                    >
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="wl-email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === 'loading'}
                      className="mt-1.5 block w-full rounded-xl border border-[var(--color-border)] bg-[var(--bg-base)] px-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--brand-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/30 disabled:opacity-60"
                    />
                  </div>

                  {status === 'error' && errorMsg && (
                    <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading' || !email.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-full bg-[var(--brand-primary)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_4px_16px_rgba(46,107,94,0.30)] transition-all hover:bg-[var(--brand-secondary)] hover:shadow-[0_6px_24px_rgba(46,107,94,0.38)] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
                  >
                    {status === 'loading' && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                    {status === 'loading' ? 'Joining…' : 'Join the OncoKind Waitlist →'}
                  </button>

                  <p className="flex items-center justify-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                    <Lock className="h-3 w-3 shrink-0" aria-hidden />
                    Your email is never shared. Unsubscribe anytime.
                  </p>
                </form>
              </>
            )}
          </div>

          {/* Benefits */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-display text-2xl font-semibold text-[var(--color-text-primary)]">
                Why join the waitlist?
              </h2>
              <p className="mt-2 text-[var(--color-text-secondary)]">
                This isn&rsquo;t a generic SaaS product. It was built by a caregiver, for
                caregivers — and founding members will always know they helped shape it.
              </p>
            </div>

            <div className="space-y-5">
              {BENEFITS.map(({ Icon, headline, body }) => (
                <div key={headline} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-[#f0f7f5] text-[var(--brand-primary)]">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-text-primary)]">{headline}</p>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Founder pull-quote */}
            <blockquote className="mt-4 rounded-[var(--radius-xl)] border border-[var(--color-border-subtle)] bg-[var(--bg-subtle)] p-6">
              <p className="font-display text-lg font-medium italic leading-snug text-[var(--color-text-primary)]">
                &ldquo;Every feature in OncoKind exists because I needed it and couldn&rsquo;t find it.
                I&rsquo;m building the tool I wish existed when my mom was diagnosed.&rdquo;
              </p>
              <footer className="mt-4 text-xs font-semibold uppercase tracking-widest text-[var(--brand-primary)]">
                — Mike Nielson, Founder
              </footer>
            </blockquote>

            <p className="text-sm text-[var(--color-text-muted)]">
              Questions?{' '}
              <a
                href="mailto:support@oncokind.com"
                className="text-[var(--brand-primary)] underline-offset-2 hover:underline"
              >
                Email us directly
              </a>
              {' '}— a real person will reply.
            </p>
          </div>
        </div>
      </section>

      {/* ── Disclaimer ───────────────────────────────────────── */}
      <section className="border-t border-[var(--color-border-subtle)] bg-[var(--bg-subtle)] px-4 py-8">
        <p className="mx-auto max-w-2xl text-center text-xs leading-relaxed text-[var(--color-text-muted)]">
          OncoKind is an educational support tool — not a substitute for professional medical advice.
          Always consult your oncology team. Nothing on this site constitutes medical advice.
        </p>
      </section>
    </main>
  );
}
