import { SiteHeader } from '@/components/layout/SiteHeader';
import { pageMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

export const metadata = pageMetadata({
  title: 'Account',
  description: 'Sign in or create an OncoKind account.',
  path: '/login',
  noindex: true,
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  );
}
