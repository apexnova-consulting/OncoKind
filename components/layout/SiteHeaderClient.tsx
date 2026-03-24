'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/layout/LanguageSelector';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

export type SiteHeaderClientProps = {
  navLinks: { href: string; label: string }[];
  signedIn: boolean;
  labels: {
    login: string;
    signup: string;
    journey: string;
  };
};

export function SiteHeaderClient({ navLinks, signedIn, labels }: SiteHeaderClientProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'sticky top-0 border-b transition-[border-color,background-color] duration-300',
        /* When mobile menu is open, sit above the portaled overlay so the bar + close control stay tappable */
        open ? 'z-[110]' : 'z-50',
        scrolled
          ? 'border-[var(--color-border-subtle)] bg-[rgba(250,248,245,0.95)] backdrop-blur-[12px]'
          : 'border-transparent bg-[rgba(250,248,245,0.92)] backdrop-blur-[12px]'
      )}
    >
      <div className="mx-auto flex h-16 max-w-[var(--max-width-full)] items-center justify-between gap-4 px-4 lg:h-[4.25rem]">
        <Link
          href="/"
          className="group flex shrink-0 items-baseline gap-0 font-display text-[1.375rem] font-semibold italic tracking-tight text-[var(--color-primary-900)]"
        >
          <span className="text-[var(--color-accent-500)] transition-colors group-hover:text-[var(--color-accent-400)]">
            O
          </span>
          <span>ncoKind</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
          <LanguageSelector />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link-underline text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-primary-900)]"
            >
              {link.label}
            </Link>
          ))}
          {signedIn ? (
            <Button asChild size="sm" className="!min-h-10 !px-5 !py-2">
              <Link href="/journey">{labels.journey}</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="outline" size="sm" className="!min-h-10 !border-[1.5px] !px-5 !py-2">
                <Link href="/login">{labels.login}</Link>
              </Button>
              <Button asChild size="sm" className="!min-h-10 !px-5 !py-2">
                <Link href="/signup">{labels.signup}</Link>
              </Button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSelector />
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-primary-900)] transition-colors hover:bg-[var(--color-surface-200)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)] focus-visible:ring-offset-2"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      {/* Portal avoids Safari stacking bugs: fixed descendants inside backdrop-blur header paint under page / bottom nav */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                key="mobile-nav"
                id="mobile-nav"
                role="dialog"
                aria-modal="true"
                aria-label="Mobile navigation"
                className="fixed inset-0 top-16 z-[100] flex flex-col overflow-y-auto bg-[var(--color-bg-page)] px-6 pb-10 pt-8 lg:hidden"
                style={{ WebkitOverflowScrolling: 'touch' }}
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <nav className="relative z-[1] flex flex-col gap-1" aria-label="Mobile">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.href}
                      initial={reduceMotion ? false : { opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reduceMotion ? 0 : 0.05 + i * 0.06, duration: 0.35 }}
                    >
                      <Link
                        href={link.href}
                        className="block rounded-xl px-4 py-4 text-lg font-medium text-[var(--color-primary-800)] hover:bg-[var(--color-surface-200)] active:bg-[var(--color-surface-200)]"
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                  <div className="mt-6 flex flex-col gap-3 border-t border-[var(--color-border-subtle)] pt-6">
                    {signedIn ? (
                      <Button asChild className="w-full">
                        <Link href="/journey" onClick={() => setOpen(false)}>
                          {labels.journey}
                        </Link>
                      </Button>
                    ) : (
                      <>
                        <Button asChild variant="outline" className="w-full">
                          <Link href="/login" onClick={() => setOpen(false)}>
                            {labels.login}
                          </Link>
                        </Button>
                        <Button asChild className="w-full">
                          <Link href="/signup" onClick={() => setOpen(false)}>
                            {labels.signup}
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </nav>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </header>
  );
}
