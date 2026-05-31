import { SiteHeader } from '@/components/layout/SiteHeader';
import { WaitlistBanner } from '@/components/marketing/WaitlistBanner';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <WaitlistBanner />
      {children}
    </>
  );
}
