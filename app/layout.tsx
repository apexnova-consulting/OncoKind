import type { CSSProperties } from 'react';
import type { Metadata, Viewport } from 'next';
import { DM_Sans, Lora } from 'next/font/google';
import './globals.css';
import { TrustFooter } from '@/components/layout/TrustFooter';
import { PwaRegister } from '@/components/PwaRegister';
import { AnalyticsScripts } from '@/components/analytics/AnalyticsScripts';
import { CookieConsentBanner } from '@/components/consent/CookieConsentBanner';
import { getBrandTheme } from '@/lib/branding';
import { getLanguageFromCookies } from '@/lib/i18n-server';

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  weight: ['600', '700'],
  style: ['normal', 'italic'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const SITE_DESCRIPTION =
  'Translate your loved one\'s pathology report into plain English. Generate Doctor Prep Sheets, match clinical trials, fight insurance denials. Built by a caregiver, for caregivers.';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.oncokind.com'),
  title: {
    default: 'OncoKind — Clarity for Families Navigating Cancer',
    template: '%s | OncoKind',
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    title: 'OncoKind — Clarity for Families Navigating Cancer',
    description: SITE_DESCRIPTION,
    siteName: 'OncoKind',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://www.oncokind.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OncoKind — Clarity for Families Navigating Cancer',
    description: SITE_DESCRIPTION,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'OncoKind',
  },
  formatDetection: { telephone: false, email: false },
};

export const viewport: Viewport = {
  themeColor: '#2e6b5e',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'OncoKind',
  applicationCategory: 'HealthApplication',
  description:
    'AI-powered cancer navigation platform for family caregivers. Translates pathology reports, generates Doctor Prep Sheets, matches clinical trials, and supports insurance appeals.',
  url: 'https://www.oncokind.com',
  offers: [
    { '@type': 'Offer', name: 'Free', price: '0', priceCurrency: 'USD' },
    { '@type': 'Offer', name: 'Caregiver Pro', price: '19', priceCurrency: 'USD', billingIncrement: 'P1M' },
    { '@type': 'Offer', name: 'Advocate Plan', price: '49', priceCurrency: 'USD', billingIncrement: 'P1M' },
  ],
  operatingSystem: 'Web, iOS (PWA), Android (PWA)',
  author: { '@type': 'Person', name: 'Mike Nielson' },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLanguageFromCookies();
  const brandTheme = await getBrandTheme();
  return (
    <html lang={lang} className={`${lora.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" href="/icons/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="flex min-h-screen flex-col bg-[var(--color-bg-page)] text-accent"
        style={brandTheme.cssVariables as CSSProperties}
      >
        <a
          href="#main-content"
          className="skip-link sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[130] focus:rounded-full focus:bg-[var(--color-primary-900)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <PwaRegister />
        <AnalyticsScripts />
        <div id="main-content" tabIndex={-1} className="contents">
          {children}
        </div>
        <CookieConsentBanner />
        <TrustFooter />
      </body>
    </html>
  );
}
