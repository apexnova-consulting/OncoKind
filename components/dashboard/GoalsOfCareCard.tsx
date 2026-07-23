'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DISMISS_KEY = 'oncokind_goc_dismissed_v1';

interface Props {
  /** True when server-side trigger logic detected Stage IV / 2nd-line / hospitalization */
  triggered: boolean;
}

export function GoalsOfCareCard({ triggered }: Props) {
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(DISMISS_KEY);
    setDismissed(stored === 'true');
  }, []);

  if (!mounted || dismissed || !triggered) return null;

  return (
    <div
      role="region"
      aria-label="Goals of Care — important conversation resource"
      className="relative rounded-xl border border-[#9FE1CB] bg-[#E1F5EE] p-5"
    >
      <button
        type="button"
        aria-label="Dismiss Goals of Care suggestion"
        onClick={() => {
          localStorage.setItem(DISMISS_KEY, 'true');
          setDismissed(true);
        }}
        className="absolute right-3 top-3 rounded-full p-1 text-[#0F6E56] hover:bg-[#9FE1CB]/30 transition-colors"
      >
        <X className="h-4 w-4" aria-hidden />
      </button>

      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0F6E56]">
          <Heart className="h-4 w-4 text-white" aria-hidden />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest text-[#0F6E56]">
            A resource for this stage of care
          </p>
          <h3 className="mt-1 text-base font-semibold text-[#1e2d2b]">
            Goals of Care Prep Sheet
          </h3>
          <p className="mt-1.5 text-sm leading-[1.7] text-[#5a6b68]">
            Based on your care journey, this is a good time to have a goals-of-care
            conversation with your oncology team. We&apos;ve prepared a gentle question list to
            help you start it — on your terms, at your pace.
          </p>
          <p className="mt-1 text-xs text-[#5a6b68]/80 italic">
            For educational support only. Not medical advice. Always consult your care team.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild size="sm" className="bg-[#0F6E56] hover:bg-[#085041] text-white">
              <Link href="/journey/goals-of-care" className="flex items-center gap-1.5">
                Open Prep Sheet
                <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-[#5a6b68] hover:text-[#1e2d2b]"
              onClick={() => {
                localStorage.setItem(DISMISS_KEY, 'true');
                setDismissed(true);
              }}
            >
              Not right now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
