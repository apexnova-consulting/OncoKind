'use client';

import Link from 'next/link';
import { track } from '@/lib/analytics';

export function HandleThisPrompt({
  entryPoint,
  centerName,
}: {
  entryPoint: 'access_agent' | 'trials' | 'second_opinion' | 'first_72';
  centerName?: string;
}) {
  const href = `/concierge${centerName ? `?center=${encodeURIComponent(centerName)}&from=${entryPoint}` : `?from=${entryPoint}`}`;
  return (
    <div className="rounded-2xl border border-[#cdd8d5] bg-[#E1F5EE] p-5">
      <p className="text-sm font-semibold text-[#085041]">Let us handle this</p>
      <p className="mt-1 text-sm text-[#1e2d2b]">
        OncoKind Concierge collects records, submits the packet to the center you choose, and tracks it until you are Case Ready.
      </p>
      <Link
        href={href}
        className="mt-3 inline-flex text-sm font-semibold text-[#0F6E56]"
        onClick={() => track('handle_this_prompt_clicked', { entry_point: entryPoint })}
      >
        Start a Concierge case
      </Link>
    </div>
  );
}
