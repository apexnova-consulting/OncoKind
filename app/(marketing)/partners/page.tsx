import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { pageMetadata } from '@/lib/seo';
import { isAfter90FlagOn } from '@/lib/after-90/config';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = pageMetadata({
  title: 'Sponsor families',
  description:
    'Foundations, advocacy groups, and employers can sponsor OncoKind family seats and Concierge cases. Counts only. No names or diagnoses on organization dashboards.',
  path: '/partners',
});

export default function PartnersPage() {
  if (!isAfter90FlagOn('orgSponsorship')) notFound();
  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm font-semibold uppercase tracking-widest text-[#0F6E56]">Partners</p>
      <h1 className="mt-3 font-display text-4xl font-semibold text-[#1e2d2b]">Sponsor families</h1>
      <p className="mt-4 text-lg text-slate-600">
        Rare-cancer foundations, patient advocacy groups, independent advocate practices, and employers can buy an annual contract for sponsored family seats and optional Concierge cases. Families keep their own data. Your dashboard shows counts only, never names or diagnoses.
      </p>
      <Button asChild className="mt-8">
        <Link href="https://calendly.com/oncokind-support">Talk to us</Link>
      </Button>
    </main>
  );
}
