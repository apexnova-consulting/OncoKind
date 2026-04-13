import type { Metadata, Viewport } from 'next';
import { DM_Sans, Lora } from 'next/font/google';
import './globals.css';
import { TrustFooter } from '@/components/layout/TrustFooter';
import { PwaRegister } from '@/components/PwaRegister';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
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

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.oncokind.com'),
  title: {
    default: 'OncoKind — Clarity for Families Navigating Cancer',
    template: '%s | OncoKind',
  },
  description:
    'AI-powered oncology clarity platform. Transform pathology reports into understandable insights and relevant clinical trial matches — for families and professional advocates.',
  openGraph: {
    type: 'website',
    title: 'OncoKind — Clarity for Families Navigating Cancer',
    description:
      'AI-powered oncology clarity platform. Transform pathology reports into understandable insights and relevant clinical trial matches — for families and professional advocates.',
    siteName: 'OncoKind',
    url: process.env.NEXT_PUBLIC_APP_URL || 'https://www.oncokind.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OncoKind — Clarity for Families Navigating Cancer',
    description:
      'AI-powered oncology clarity platform. Transform pathology reports into understandable insights and relevant clinical trial matches — for families and professional advocates.',
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
  themeColor: '#0d1b2a',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLanguageFromCookies();
  return (
    <html lang={lang} className={`${lora.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" href="/icons/icon-192.png" type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="flex min-h-screen flex-col bg-[var(--color-bg-page)] pb-16 text-accent md:pb-0">
        <PwaRegister />
        {children}
        <TrustFooter />
        <MobileBottomNav />
      </body>
    </html>
  );
}
