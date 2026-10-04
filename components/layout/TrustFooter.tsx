import Link from 'next/link';
import { getBrandTheme } from '@/lib/branding';
import { GLOBAL_SITE_DISCLAIMER_TEXT } from '@/lib/disclosures';

const footerColumns = [
  {
    heading: 'Product',
    links: [
      { href: '/#how-it-works', label: 'How It Works' },
      { href: '/#features', label: 'Features' },
      { href: '/pricing', label: 'Pricing' },
      { href: '/#sample-demo', label: 'Try Demo' },
      { href: '/community', label: 'Community' },
      { href: '/learn', label: 'Resources' },
    ],
  },
  {
    heading: 'Platform',
    links: [
      { href: '/features/empathy-filter', label: 'Empathy Filter' },
      { href: '/mission', label: 'Mission' },
      { href: '/trust', label: 'Trust & Privacy' },
      { href: 'https://status.oncokind.com', label: 'System Status', external: true },
      { href: '/learn', label: 'Learn' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/about#founder-section', label: 'Founder Story' },
      { href: '/support', label: 'Support' },
      { href: 'mailto:support@oncokind.com', label: 'Contact', external: true },
    ],
  },
  {
    heading: 'For Professionals',
    links: [
      { href: '/professional', label: 'Professional Overview' },
      { href: 'https://calendly.com/oncokind-support', label: 'Book a Demo', external: true },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { href: '/terms', label: 'Terms of Service' },
      { href: '/trust', label: 'Trust & Privacy' },
      { href: '/privacy', label: 'Privacy Policy' },
    ],
  },
];

export async function TrustFooter() {
  const brandTheme = await getBrandTheme();
  const year = new Date().getFullYear();

  const globalDisclaimer =
    brandTheme.displayName === 'OncoKind'
      ? GLOBAL_SITE_DISCLAIMER_TEXT
      : (brandTheme.footerDisclaimer ?? GLOBAL_SITE_DISCLAIMER_TEXT);

  return (
    <footer className="mt-auto border-t border-[var(--color-surface-300)] bg-[var(--bg-deep)] text-[var(--color-text-inverse)]">
      <div className="mx-auto max-w-[var(--max-width-full)] px-4 py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          {/* Brand */}
          <div className="max-w-xs shrink-0">
            {brandTheme.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={brandTheme.logoUrl}
                alt={brandTheme.displayName}
                className="h-10 w-auto max-w-[10rem] object-contain"
              />
            ) : (
              <p className="font-display text-2xl font-semibold italic text-white">
                {brandTheme.displayName}
              </p>
            )}
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-surface-300)]">
              Clarity for families navigating cancer.
            </p>
            <p className="mt-4 text-xs leading-relaxed text-[var(--color-surface-400)]">
              If you or someone you love needs immediate support, the Cancer Support Community helpline is available at{' '}
              <a
                href="tel:18887939355"
                className="underline underline-offset-2 hover:text-white"
              >
                1-888-793-9355
              </a>
              .
            </p>
          </div>

          {/* Columns */}
          <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3 lg:max-w-3xl lg:grid-cols-5">
            {footerColumns.map((col) => (
              <div key={col.heading}>
                <p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--brand-gold)]">
                  {col.heading}
                </p>
                <ul className="mt-4 space-y-3 text-sm">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      {l.external ? (
                        <a
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--color-surface-300)] transition-colors hover:text-white"
                        >
                          {l.label}
                        </a>
                      ) : (
                        <Link
                          href={l.href}
                          className="text-[var(--color-surface-300)] transition-colors hover:text-white"
                        >
                          {l.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-[var(--color-surface-400)] sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <p>© {year} {brandTheme.displayName}. All rights reserved.</p>
          <p className="max-w-lg text-xs leading-relaxed">
            {globalDisclaimer}
          </p>
          <nav className="flex flex-wrap gap-5 text-xs" aria-label="Legal links">
            <Link href="/trust" className="hover:text-white">
              Trust &amp; Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
