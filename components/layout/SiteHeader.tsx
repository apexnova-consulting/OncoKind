import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Button } from '@/components/ui/button';
import { Cloud } from 'lucide-react';
import { LanguageSelector } from '@/components/layout/LanguageSelector';
import { getDictionaryFromCookies } from '@/lib/i18n-server';

export async function SiteHeader() {
  const supabase = await createServerSupabaseClient();
  const t = await getDictionaryFromCookies();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const navLinks = [
    { href: '/#how-it-works', label: t['nav.howItWorks'] },
    { href: '/signup', label: t['nav.caregiverTools'] },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-semibold tracking-tight text-slate-900 transition-colors hover:text-primary"
        >
          <Cloud className="h-7 w-7 text-primary" aria-hidden />
          OncoKind
        </Link>
        <nav className="flex items-center gap-6">
          <LanguageSelector />
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <Button asChild size="sm">
              <Link href="/journey">{t['nav.goToJourney']}</Link>
            </Button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                {t['nav.login']}
              </Link>
              <Button asChild size="sm">
                <Link href="/signup">{t['nav.signup']}</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
