'use client';

import { motion } from 'framer-motion';
import {
  FileText,
  HelpCircle,
  ClipboardList,
  ArrowRight,
  FlaskConical,
} from 'lucide-react';
import type { PatientReportData } from '@/lib/patient-reports';
import Link from 'next/link';

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.3 },
  }),
};

interface DiagnosisCardsProps {
  report: PatientReportData;
}

export function DiagnosisCards({ report }: DiagnosisCardsProps) {
  const { biomarkers } = report;
  const cancerType = biomarkers.cancer_type_inferred ?? 'Cancer';
  const histology = biomarkers.histology ?? '—';
  const tnmStage = biomarkers.tnm_stage ?? '—';
  const biomarkerPairs = (biomarkers.names ?? []).map((name, i) => ({
    name,
    status: (biomarkers.statuses ?? [])[i] ?? '—',
  }));

  const cards = [
    {
      icon: FileText,
      title: 'Diagnosis',
      content: (
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Cancer type:</span> {cancerType}</p>
          <p><span className="font-medium">Histology:</span> {histology}</p>
          <p><span className="font-medium">Stage:</span> {tnmStage}</p>
        </div>
      ),
    },
    {
      icon: HelpCircle,
      title: 'What This Means',
      content: (
        <p className="text-sm text-slate-600">
          Your report has been analyzed. Discuss these findings with your oncologist to understand how they apply to your situation.
        </p>
      ),
    },
    {
      icon: ClipboardList,
      title: 'Treatment Options',
      content: (
        <p className="text-sm text-slate-600">
          Based on biomarkers and stage, your care team will recommend treatment options. Ask about clinical trials that may be relevant.
        </p>
      ),
    },
    {
      icon: ArrowRight,
      title: 'Next Steps',
      content: (
        <ul className="list-inside list-disc space-y-1 text-sm text-slate-600">
          <li>Prepare questions for your oncologist</li>
          <li>Review clinical trial matches</li>
          <li>Bring this summary to your next appointment</li>
        </ul>
      ),
    },
    {
      icon: FlaskConical,
      title: 'Clinical Trials',
      content: (
        <div>
          {biomarkerPairs.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-slate-500">Biomarkers</p>
              <div className="mt-1 flex flex-wrap gap-2">
                {biomarkerPairs.map(({ name, status }) => (
                  <span
                    key={name}
                    className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                  >
                    {name}: {status}
                  </span>
                ))}
              </div>
            </div>
          )}
          <Link
            href={`/journey/trials?reportId=${report.id}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            View trial matches →
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary" />
              <h2 className="font-heading font-semibold text-accent">{card.title}</h2>
            </div>
            <div className="mt-4">{card.content}</div>
          </motion.div>
        );
      })}
    </div>
  );
}
