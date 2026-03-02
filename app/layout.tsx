import type { Metadata, Viewport } from 'next';
import './globals.css';
import { TrustFooter } from '@/components/layout/TrustFooter';
import { PwaRegister } from '@/components/PwaRegister';

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
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <PwaRegister />
        {children}
        <TrustFooter />
      </body>
    </html>
  );
}
