'use client';

import { Check, Clock, Square } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export type CareStage = 'diagnosis' | 'treatment-planning' | 'active-treatment' | 'monitoring';

export interface StageInfo {
  id: CareStage;
  label: string;
  status: 'completed' | 'current' | 'upcoming';
  keyActions?: string[];
  questionsForDoctor?: string[];
  estimatedTime?: string;
}

const STAGE_LABELS: Record<CareStage, string> = {
  diagnosis: 'Diagnosis',
  'treatment-planning': 'Treatment Planning',
  'active-treatment': 'Active Treatment',
  monitoring: 'Monitoring',
};

interface ProgressStripProps {
  currentStage: CareStage;
  completedStages?: CareStage[];
}

export function ProgressStrip({ currentStage, completedStages = [] }: ProgressStripProps) {
  const stages: CareStage[] = ['diagnosis', 'treatment-planning', 'active-treatment', 'monitoring'];
  const completedSet = new Set(completedStages);

  const getStageInfo = (stage: CareStage): StageInfo['status'] => {
    if (completedSet.has(stage) || (stages.indexOf(stage) < stages.indexOf(currentStage))) {
      return 'completed';
    }
    if (stage === currentStage) return 'current';
    return 'upcoming';
  };

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
      <div className="mx-auto max-w-4xl px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          {stages.map((stage, idx) => {
            const status = getStageInfo(stage);
            const isLast = idx === stages.length - 1;
            return (
              <div key={stage} className="flex flex-1 items-center">
                <div
                  className={`group relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    status === 'completed'
                      ? 'bg-success/10 text-success'
                      : status === 'current'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-slate-50 text-slate-400'
                  }`}
                >
                  {status === 'completed' ? (
                    <Check className="h-4 w-4 shrink-0" />
                  ) : status === 'current' ? (
                    <Clock className="h-4 w-4 shrink-0" />
                  ) : (
                    <Square className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span>{STAGE_LABELS[stage]}</span>
                  <AnimatePresence>
                    {status === 'current' && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-1/2 top-full z-50 mt-1 hidden w-64 -translate-x-1/2 rounded-lg border border-slate-200 bg-white p-3 shadow-lg group-hover:block"
                      >
                        <p className="text-xs font-semibold text-slate-700">Where you are</p>
                        <p className="mt-1 text-xs text-slate-600">
                          Focus on understanding your diagnosis and next steps.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {!isLast && (
                  <div className="mx-1 h-px w-4 shrink-0 bg-slate-200" aria-hidden />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
