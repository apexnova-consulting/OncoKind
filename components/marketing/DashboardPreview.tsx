'use client';

import { CancerProfileSummaryCard } from '@/components/care/CancerProfileSummaryCard';

/**
 * Polished product preview for the homepage hero — stacked depth, slight rotation.
 * Static wrapper (no initial opacity:0) so LCP is not blocked on Framer Motion.
 */
export function DashboardPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md px-2">
      {/* Back card — timeline suggestion */}
      <div
        className="absolute left-4 right-0 top-6 z-0 h-[min(420px,70%)] rounded-[var(--radius-xl)] bg-[var(--color-primary-900)] opacity-90 shadow-[var(--shadow-lg)] motion-safe:max-lg:top-8 motion-safe:[transform:rotate(-2.5deg)_translateX(12px)] blur-[1.5px] motion-reduce:blur-none"
        aria-hidden
      >
        <div className="flex h-full flex-col justify-end p-6 text-[var(--color-surface-300)]">
          <p className="font-display text-sm italic opacity-80">Care timeline</p>
          <div className="mt-3 space-y-2 border-l-2 border-[var(--color-accent-500)]/40 pl-3 text-xs">
            <p>Diagnosis reviewed</p>
            <p>Prep sheet saved</p>
            <p>Next: oncology visit</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 motion-safe:[transform:rotate(1.5deg)]">
        <div className="rounded-[var(--radius-xl)] bg-white shadow-[var(--shadow-xl)] motion-safe:hover:-translate-y-0.5 motion-safe:transition-transform motion-safe:duration-300">
          <div className="p-4 sm:p-5">
            <CancerProfileSummaryCard
              type="Non-Small Cell Lung Cancer"
              stage="Stage IIIA"
              biomarkers={['PD-L1: 60%', 'EGFR: Negative']}
              recommendedNextSteps={[
                'Meet with oncologist',
                'Discuss immunotherapy',
                'Review clinical trials',
              ]}
              showCta={false}
              compact
            />
          </div>
        </div>
      </div>
    </div>
  );
}
