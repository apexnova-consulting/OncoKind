import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { pageMetadata } from '@/lib/seo';
import { CALENDLY_URL, PARTNERS_INTRO, caseReadyPriceLabel, caregiverProName } from '@/lib/ok01';
import { includedProDays } from '@/lib/ok01';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = pageMetadata({
  title: 'Sponsor families',
  description: PARTNERS_INTRO,
  path: '/partners',
});

export default function PartnersPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#0F6E56]">Partners</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-[#1e2d2b]">Sponsor families</h1>
      <p className="mt-4 text-lg text-slate-600">{PARTNERS_INTRO}</p>
      <p className="mt-4 text-sm text-slate-600">
        Per-case sponsorship amount is the active Case Ready price: {caseReadyPriceLabel()}. A sponsored case includes {includedProDays()} days of {caregiverProName()}.
      </p>
      <Button asChild className="mt-8">
        <Link href={CALENDLY_URL}>Talk to us</Link>
      </Button>
    </main>
  );
}
