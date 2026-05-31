'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import Link from 'next/link';

const STORAGE_KEY_DISMISSED = 'ok_waitlist_dismissed';
const STORAGE_KEY_EMAIL = 'ok_waitlist_email';

/** ISO string; must match the server-side constant in /api/waitlist/route.ts */
const WAITLIST_END_DATE = process.env.NEXT_PUBLIC_WAITLIST_END_DATE ?? '2026-06-30T23:59:59Z';

function isWaitlistActive(): boolean {
  if (process.env.NEXT_PUBLIC_WAITLIST_ENABLED === 'false') return false;
  return new Date() < new Date(WAITLIST_END_DATE);
}

export function WaitlistBanner() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isWaitlistActive()) return;
    if (typeof window === 'undefined') return;
    // Don't show if already dismissed or already signed up
    const dismissed = localStorage.getItem(STORAGE_KEY_DISMISSED);
    const alreadySigned = localStorage.getItem(STORAGE_KEY_EMAIL);
    if (dismissed || alreadySigned) return;
    // Small delay so the page renders first — less jarring
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  function dismiss() {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY_DISMISSED, '1');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || status === 'loading') return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source: 'banner' }),
      });
      const data: { ok?: boolean; already?: boolean; error?: string } = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      localStorage.setItem(STORAGE_KEY_EMAIL, email.trim().toLowerCase());
    } catch {
      setStatus('error');
      setErrorMsg('Network error — please try again.');
    }
  }

  if (!visible) return null;

  return (
    <div
      role="banner"
      aria-label="Join the OncoKind waitlist"
      className="relative border-b border-[var(--brand-gold)]/30 bg-[#FDF6EE] px-4 py-3"
    >
      <div className="mx-auto flex max-w-[var(--max-width-full)] flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">

        {/* Label */}
        <div className="min-w-0 flex-1">
          {status === 'success' ? (
            <p className="flex items-center gap-2 text-sm font-medium text-[#1A2332]">
              <Check className="h-4 w-4 shrink-0 text-[var(--brand-primary)]" aria-hidden />
              You&rsquo;re on the list — we&apos;ll be in touch before launch. Thank you.
            </p>
          ) : (
            <p className="text-sm text-[#1A2332]">
              <span className="font-semibold">OncoKind is launching soon.</span>{' '}
              <span className="text-[#4A5568]">
                Join the waitlist for early access and founding member pricing.
              </span>
            </p>
          )}
        </div>

        {/* Form */}
        {status !== 'success' && (
          <form
            onSubmit={handleSubmit}
            className="flex shrink-0 items-center gap-2"
            aria-label="Waitlist sign up"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === 'loading'}
                  aria-label="Email address for waitlist"
                  className="h-9 w-48 rounded-full border border-[var(--color-border)] bg-white px-4 text-sm text-[#1A2332] placeholder:text-[#8896A4] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)] focus:ring-offset-1 disabled:opacity-60 sm:w-56"
                />
                <button
                  type="submit"
                  disabled={status === 'loading' || !email.trim()}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-[var(--brand-primary)] px-4 text-sm font-semibold text-white transition-all hover:bg-[var(--brand-secondary)] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
                >
                  {status === 'loading' ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  ) : null}
                  {status === 'loading' ? 'Joining…' : 'Join Waitlist'}
                </button>
                <Link
                  href="/waitlist"
                  className="hidden text-xs text-[#8896A4] underline-offset-2 hover:text-[var(--brand-primary)] hover:underline sm:inline"
                >
                  Learn more
                </Link>
              </div>
              {status === 'error' && errorMsg && (
                <p className="pl-4 text-xs text-red-600" role="alert">
                  {errorMsg}
                </p>
              )}
            </div>
          </form>
        )}

        {/* Dismiss */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss waitlist banner"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-[#8896A4] transition-colors hover:bg-[#E8E6E0] hover:text-[#1A2332] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] sm:static sm:ml-2 sm:shrink-0"
        >
          <X className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
