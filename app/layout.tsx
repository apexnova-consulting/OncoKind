import type { Metadata, Viewport } from 'next';
import { Inter, Source_Sans_3 } from 'next/font/google';
import './globals.css';
import { TrustFooter } from '@/components/layout/TrustFooter';
import { PwaRegister } from '@/components/PwaRegister';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { getLanguageFromCookies } from '@/lib/i18n-server';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sourceSans = Source_Sans_3({ subsets: ['latin'], variable: '--font-source-sans' });

export const metadata: Metadata = {
  title: {
    default: 'OncoKind — Clarity for Families Navigating Cancer',
    template: '%s | OncoKind',
  },
  description:
    'AI-powered oncology clarity platform. Transform pathology reports into understandable insights and relevant clinical trial matches — for families and professional advocates.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'OncoKind',
  },
  formatDetection: { telephone: false, email: false },
};

export const viewport: Viewport = {
  themeColor: '#0284c7',
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
    <html lang={lang} className={`${inter.variable} ${sourceSans.variable}`}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen flex flex-col bg-[#f9fafb] pb-16 text-accent md:pb-0">
        <PwaRegister />
        {children}
        <TrustFooter />
        <MobileBottomNav />
      </body>
    </html>
  );
}
