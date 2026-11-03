import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { pageMetadata } from '@/lib/seo';
import { CALENDLY_URL } from '@/lib/ok01';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = pageMetadata({
  title: 'Organizations',
  description: 'OncoKind for foundations and organizations. Book a call to talk about sponsoring families.',
  path: '/professional',
  noindex: true,
});

export default function ProfessionalPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-4xl font-semibold">Organizations</h1>
      <p className="mt-4 text-lg text-slate-600">
        Foundations and employers can sponsor Concierge cases for families. You see counts and status only, never medical details.
      </p>
      <Button asChild className="mt-8">
        <Link href={CALENDLY_URL}>Organizations: book a call</Link>
      </Button>
    </main>
  );
}
