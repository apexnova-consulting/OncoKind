'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type CareStageId = 'diagnosis' | 'treatment-planning' | 'active-treatment' | 'monitoring';

interface StageData {
  id: CareStageId;
  label: string;
  icon: typeof FileText;
  status: 'completed' | 'current' | 'upcoming';
  summary?: string;
  biomarkers?: string[];
  nextSteps?: string[];
  treatmentOptions?: string[];
}

interface JourneyTimelineProps {
  stages: StageData[];
}

export function JourneyTimeline({ stages }: JourneyTimelineProps) {
  const [expanded, setExpanded] = useState<CareStageId | null>('treatment-planning');

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stages.map((stage, idx) => {
        const Icon = stage.icon;
        const isExpanded = expanded === stage.id;
        const statusColors =
          stage.status === 'completed'
            ? 'border-success/30 bg-success/5'
            : stage.status === 'current'
              ? 'border-primary/40 bg-primary/5 ring-1 ring-primary/20'
              : 'border-slate-200 bg-white';

        return (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex flex-col"
          >
            <div
              className={`flex min-h-[180px] flex-1 flex-col rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md ${statusColors}`}
            >
              <button
                type="button"
                onClick={() => setExpanded(isExpanded ? null : stage.id)}
                className="flex w-full items-start justify-between text-left"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                      stage.status === 'completed'
                        ? 'bg-success/20 text-success'
                        : stage.status === 'current'
                          ? 'bg-primary/20 text-primary'
                          : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {stage.status === 'completed' ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-accent">
                      {stage.label}
                    </h3>
                    {stage.summary && (
                      <p className="mt-0.5 text-sm text-slate-600">{stage.summary}</p>
                    )}
                    {stage.id === 'diagnosis' && stage.summary && (
                      <Button asChild size="sm" className="mt-3">
                        <Link href="/journey/ai-navigator">Learn More</Link>
                      </Button>
                    )}
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
                )}
              </button>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-6 space-y-4 border-t border-slate-200 pt-6">
                      {stage.biomarkers && stage.biomarkers.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500">
                            Key Biomarkers
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {stage.biomarkers.map((b) => (
                              <span
                                key={b}
                                className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary"
                              >
                                {b}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {stage.nextSteps && stage.nextSteps.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500">
                            Next Steps
                          </p>
                          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
                            {stage.nextSteps.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ul>
                          <Button asChild size="sm" className="mt-3">
                            <Link href="/journey/ai-navigator">View Plan</Link>
                          </Button>
                        </div>
                      )}
                      {stage.treatmentOptions && stage.treatmentOptions.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-slate-500">
                            Treatment Options
                          </p>
                          <ul className="mt-2 list-inside list-decimal space-y-1 text-sm text-slate-600">
                            {stage.treatmentOptions.map((opt, i) => (
                              <li key={i}>{opt}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {stage.status !== 'upcoming' && stage.id !== 'diagnosis' && (
                        <div className="flex gap-2">
                          <Button asChild size="sm">
                            <Link href="/journey/trials">View Clinical Trials</Link>
                          </Button>
                          <Button asChild variant="outline" size="sm">
                            <Link href="/journey/ai-navigator">Ask Navigator</Link>
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
