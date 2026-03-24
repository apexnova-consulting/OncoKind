import Link from 'next/link';
import { getDictionaryFromCookies } from '@/lib/i18n-server';

export async function TrustFooter() {
  const t = await getDictionaryFromCookies();
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50 py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <p className="text-sm text-slate-600">
          OncoKind provides informational guidance and is not a substitute for professional medical advice.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link href="/about" className="text-slate-600 hover:text-slate-900">
            {t['footer.about']}
          </Link>
          <Link href="/about#founder-section" className="text-slate-600 hover:text-slate-900">
            {t['footer.founder']}
          </Link>
          <Link href="/empathy-filter" className="text-slate-600 hover:text-slate-900">
            {t['footer.empathyFilter']}
          </Link>
          <Link href="/mission" className="text-slate-600 hover:text-slate-900">
            {t['footer.mission']}
          </Link>
          <Link href="/pricing" className="text-slate-600 hover:text-slate-900">
            {t['footer.pricing']}
          </Link>
          <Link href="/security" className="text-slate-600 hover:text-slate-900">
            {t['footer.security']}
          </Link>
          <Link href="/terms" className="text-slate-600 hover:text-slate-900">
            {t['footer.terms']}
          </Link>
          <Link href="/privacy" className="text-slate-600 hover:text-slate-900">
            {t['footer.privacy']}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
