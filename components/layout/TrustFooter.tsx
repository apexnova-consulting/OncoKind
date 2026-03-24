import Link from 'next/link';

export function TrustFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50 py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
        <p className="text-sm text-slate-600">
          OncoKind provides informational guidance and is not a substitute for professional medical advice.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link href="/about" className="text-slate-600 hover:text-slate-900">
            About
          </Link>
          <Link href="/about#founder-section" className="text-slate-600 hover:text-slate-900">
            Founder
          </Link>
          <Link href="/empathy-filter" className="text-slate-600 hover:text-slate-900">
            Empathy Filter
          </Link>
          <Link href="/mission" className="text-slate-600 hover:text-slate-900">
            Mission
          </Link>
          <Link href="/pricing" className="text-slate-600 hover:text-slate-900">
            Pricing
          </Link>
          <Link href="/security" className="text-slate-600 hover:text-slate-900">
            Security
          </Link>
          <Link href="/terms" className="text-slate-600 hover:text-slate-900">
            Terms
          </Link>
          <Link href="/privacy" className="text-slate-600 hover:text-slate-900">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
