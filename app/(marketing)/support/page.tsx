import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Support',
  description:
    'Contact OncoKind support for privacy requests, account help, and product questions. We respond to all messages within 24 hours.',
};

export default function SupportPage() {
  return (
    <main className="bg-[var(--color-bg-page)] px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-[var(--max-width-content)] space-y-8">
        <section className="rounded-[var(--radius-xl)] bg-white p-8 shadow-[var(--shadow-md)] sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
            Support
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-[var(--color-primary-900)] sm:text-5xl">
            We respond to all messages within 24 hours.
          </h1>
          <p className="mt-5 text-base leading-relaxed text-[var(--color-text-secondary)]">
            If you need help with your account, a privacy request, billing, or a question about how
            OncoKind works, contact us directly. We monitor support requests closely and will get back
            to you as quickly as we can.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <a href="mailto:support@oncokind.com">Email support@oncokind.com</a>
            </Button>
            <Button asChild variant="outline">
              <a href="https://status.oncokind.com" target="_blank" rel="noreferrer">
                View System Status
              </a>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
