'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CommunityUpgradeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/45 px-4">
      <div className="w-full max-w-md rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-xl)]">
        <p className="text-sm font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-600)]">
          Community posting
        </p>
        <h3 className="mt-3 font-display text-2xl font-semibold text-[var(--color-primary-900)]">
          Posting in the community is available on the Advocate Plan.
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          Free members can browse every conversation. Upgrade when you&apos;re ready to ask
          questions, reply to others, and send support.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild className="sm:flex-1">
            <Link href="/pricing?plan=advocate">$49/month Advocate Plan</Link>
          </Button>
          <Button type="button" variant="outline" className="sm:flex-1" onClick={onClose}>
            Read More Posts
          </Button>
        </div>
      </div>
    </div>
  );
}
