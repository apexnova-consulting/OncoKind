import Link from 'next/link';
import { getBrandTheme } from '@/lib/branding';
import { getDictionaryFromCookies } from '@/lib/i18n-server';

const productLinks = [
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/#features', label: 'Features' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/#sample-demo', label: 'Try Demo' },
  { href: '/community', label: 'Community' },
  { href: '/resources', label: 'Resources' },
];

export async function TrustFooter() {
  const t = await getDictionaryFromCookies();
  const brandTheme = await getBrandTheme();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t-2 border-[var(--color-accent-400)] bg-[var(--color-primary-900)] text-[var(--color-text-inverse)]">
      <div className="mx-auto max-w-[var(--max-width-full)] px-4 py-14">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="max-w-sm">
            {brandTheme.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brandTheme.logoUrl}
                alt={brandTheme.displayName}
                className="h-12 w-auto max-w-[11rem] object-contain"
              />
            ) : (
              <p className="font-display text-2xl font-semibold italic text-white">{brandTheme.displayName}</p>
            )}
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-surface-300)]">
              Clarity for families navigating cancer.
            </p>
          </div>
          <div className="grid flex-1 grid-cols-2 gap-10 sm:grid-cols-4 lg:max-w-3xl">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-400)]">
                Product
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                {productLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[var(--color-surface-200)] transition-colors hover:text-[var(--color-accent-400)]"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-400)]">
                Resources
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    href="/empathy-filter"
                    className="text-[var(--color-surface-200)] transition-colors hover:text-[var(--color-accent-400)]"
                  >
                    {t['footer.empathyFilter']}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mission"
                    className="text-[var(--color-surface-200)] transition-colors hover:text-[var(--color-accent-400)]"
                  >
                    {t['footer.mission']}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/security"
                    className="text-[var(--color-surface-200)] transition-colors hover:text-[var(--color-accent-400)]"
                  >
                    {t['footer.security']}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-400)]">
                Company
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-[var(--color-surface-200)] transition-colors hover:text-[var(--color-accent-400)]"
                  >
                    {t['footer.about']}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about#founder-section"
                    className="text-[var(--color-surface-200)] transition-colors hover:text-[var(--color-accent-400)]"
                  >
                    {t['footer.founder']}
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:hello@oncokind.com"
                    className="text-[var(--color-surface-200)] transition-colors hover:text-[var(--color-accent-400)]"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-400)]">
                Legal
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <Link
                    href="/terms"
                    className="text-[var(--color-surface-200)] transition-colors hover:text-[var(--color-accent-400)]"
                  >
                    {t['footer.terms']}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-[var(--color-surface-200)] transition-colors hover:text-[var(--color-accent-400)]"
                  >
                    {t['footer.privacy']}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-[var(--color-primary-700)] pt-8 text-sm text-[var(--color-surface-300)] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <p>© {year} {brandTheme.displayName}. All rights reserved.</p>
          <p className="max-w-xl text-[var(--color-surface-400)]">
            {brandTheme.footerDisclaimer ??
              'OncoKind provides informational guidance and is not a substitute for professional medical advice.'}
          </p>
          <nav className="flex flex-wrap gap-6" aria-label="Legal links">
            <Link href="/privacy" className="hover:text-[var(--color-accent-400)]">
              {t['footer.privacy']}
            </Link>
            <Link href="/terms" className="hover:text-[var(--color-accent-400)]">
              {t['footer.terms']}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
