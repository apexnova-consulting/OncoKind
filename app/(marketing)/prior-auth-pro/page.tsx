import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { pageMetadata } from '@/lib/seo';
import { CALENDLY_URL } from '@/lib/ok01';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = pageMetadata({
  title: 'Organizations',
  description: 'OncoKind for organizations. Book a call. No self-serve signup on this page.',
  path: '/prior-auth-pro',
  noindex: true,
});

export default function PriorAuthProPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-4xl font-semibold">Organizations</h1>
      <p className="mt-4 text-lg text-slate-600">
        Prior authorization tools for facilities are not on a self-serve plan this cycle. Book a call if you represent an organization.
      </p>
      <Button asChild className="mt-8">
        <Link href={CALENDLY_URL}>Organizations: book a call</Link>
      </Button>
    </main>
  );
}
