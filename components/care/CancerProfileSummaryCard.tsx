'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FlaskConical, ListChecks } from 'lucide-react';

export interface CancerProfileSummaryCardProps {
  /** e.g. "Non-Small Cell Lung Cancer" */
  type: string;
  /** e.g. "Stage IIIA" */
  stage?: string;
  /** e.g. ["PD-L1: 60%", "EGFR: Negative"] */
  biomarkers?: string[];
  /** e.g. ["Discuss immunotherapy", "Review clinical trials"] */
  recommendedNextSteps?: string[];
  /** Show primary CTA (e.g. "View full journey") */
  showCta?: boolean;
  /** Compact mode for homepage preview */
  compact?: boolean;
}

export function CancerProfileSummaryCard({
  type,
  stage,
  biomarkers = [],
  recommendedNextSteps = [],
  showCta = true,
  compact = false,
}: CancerProfileSummaryCardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${
        compact ? 'p-4' : 'p-6'
      }`}
    >
      <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-slate-500">
        Cancer Profile
      </h3>
      <div className={compact ? 'mt-3 space-y-3' : 'mt-5 space-y-5'}>
        <div>
          <p className="text-xs font-medium text-slate-500">Type</p>
          <p className={`font-medium text-accent ${compact ? 'text-sm' : 'text-base'}`}>
            {type}
          </p>
        </div>
        {stage && (
          <div>
            <p className="text-xs font-medium text-slate-500">Stage</p>
            <p className={`font-medium text-accent ${compact ? 'text-sm' : 'text-base'}`}>
              {stage}
            </p>
          </div>
        )}
        {biomarkers.length > 0 && (
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <FlaskConical className="h-3.5 w-3.5" /> Key Biomarkers
            </p>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {biomarkers.map((b) => (
                <span
                  key={b}
                  className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}
        {recommendedNextSteps.length > 0 && (
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <ListChecks className="h-3.5 w-3.5" /> Recommended Next Steps
            </p>
            <ul className="mt-1.5 list-inside list-disc space-y-0.5 text-sm text-slate-700">
              {recommendedNextSteps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {showCta && !compact && (
        <Button asChild size="sm" className="mt-5">
          <Link href="/journey">View full journey</Link>
        </Button>
      )}
    </div>
  );
}
