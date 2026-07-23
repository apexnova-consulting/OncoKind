'use client';

import { useState, useTransition } from 'react';
import { Heart, Download, BookOpen, FileCheck, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/* ─────────────────────────────────────────────────────────────
   STATIC CONTENT — needs palliative care physician / oncology
   social worker review before general release per spec.
───────────────────────────────────────────────────────────── */

const DEFAULT_QUESTIONS = [
  {
    category: 'Understanding the current picture',
    questions: [
      'What does my loved one\'s care team recommend if this treatment stops working?',
      'What is the primary goal of the current treatment — to control, to reduce symptoms, or something else?',
      'What does "stable" mean for this stage and type of cancer?',
    ],
  },
  {
    category: 'Palliative and supportive care',
    questions: [
      'Is palliative care available to us now, alongside treatment — not instead of it?',
      'How is palliative care different from hospice? Can we use both at the same time?',
      'Who on the care team focuses on comfort, symptom management, and quality of life?',
    ],
  },
  {
    category: 'Planning ahead together',
    questions: [
      'What does my loved one want their care to look like if their health changes quickly?',
      'Who should make decisions if my loved one can\'t speak for themselves?',
      'Is now a good time to complete an advance directive or designate a healthcare proxy?',
    ],
  },
  {
    category: 'Practical next steps',
    questions: [
      'Are there support services — social workers, chaplains, counselors — available to our family now?',
      'What happens if we want to stop or pause the current treatment plan?',
      'How do we reach someone after hours if something changes at home?',
    ],
  },
];

const PALLIATIVE_EXPLAINER = {
  title: 'Palliative care vs. hospice — what\'s the difference?',
  points: [
    {
      label: 'Palliative care',
      text: 'Specialized medical care focused on comfort, symptom relief, and quality of life. It can start at any point during a cancer diagnosis — even during active treatment. It does not mean giving up. It means adding a layer of support.',
    },
    {
      label: 'Hospice',
      text: 'A specific type of palliative care for people who are no longer seeking curative treatment, typically with a life expectancy of six months or less. Hospice is a choice, not a requirement, and it provides intensive comfort-focused support.',
    },
    {
      label: 'The key difference',
      text: 'Palliative care runs alongside any treatment. Hospice replaces curative treatment. Both are deeply compassionate and evidence-based. Many families who access palliative care early report better quality of life — and sometimes longer life.',
    },
  ],
};

const ADVANCE_DIRECTIVE_ITEMS = [
  'Healthcare proxy / durable power of attorney for healthcare designated',
  'Advance directive or living will completed and signed',
  'POLST / MOLST form (if applicable for your state) discussed with care team',
  'Copies shared with: oncologist, primary care physician, hospital records',
  'Family members informed of document location',
  'Review scheduled annually or after any major health change',
];

/* ─────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────── */

interface Props {
  userId: string;
  /** Optional: personalised question list from AI generation */
  generatedQuestions?: typeof DEFAULT_QUESTIONS;
}

function SectionToggle({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-[#cdd8d5] bg-white overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-[#f7faf9] transition-colors"
        aria-expanded={open}
      >
        <span className="font-semibold text-[#1e2d2b]">{title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-[#0F6E56] shrink-0" aria-hidden />
        ) : (
          <ChevronDown className="h-4 w-4 text-[#0F6E56] shrink-0" aria-hidden />
        )}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

export function GoalsOfCarePrepSheet({ userId: _userId, generatedQuestions }: Props) {
  const [generating, startGenerate] = useTransition();
  const [aiQuestions, setAiQuestions] = useState<typeof DEFAULT_QUESTIONS | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);

  const questions = aiQuestions ?? generatedQuestions ?? DEFAULT_QUESTIONS;

  async function handleGenerate() {
    setGenerateError(null);
    startGenerate(async () => {
      try {
        const res = await fetch('/api/goals-of-care/generate', { method: 'POST' });
        if (!res.ok) throw new Error('Generation failed');
        const data = await res.json() as { questions?: typeof DEFAULT_QUESTIONS };
        if (data.questions) setAiQuestions(data.questions);
      } catch {
        setGenerateError('Could not generate personalized questions right now. The questions below are still a helpful starting point.');
      }
    });
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-3xl space-y-8">

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0F6E56]">
              <Heart className="h-4 w-4 text-white" aria-hidden />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0F6E56]">
              Goals of Care
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#1e2d2b]">Goals of Care Prep Sheet</h1>
          <p className="mt-2 text-[#5a6b68] leading-relaxed">
            This is a gentle guide to help you start one of the most important — and often
            overlooked — conversations in cancer care: what your loved one wants their care to
            look like, who speaks for them, and what support is available right now.
          </p>
          <p className="mt-2 text-xs text-[#5a6b68]/80 italic">
            For educational support only. Not medical advice. Always consult your oncology
            team before making any treatment decisions.
          </p>
        </div>

        {/* Personalize CTA */}
        <div className="rounded-xl border border-[#cdd8d5] bg-[#f7faf9] p-5">
          <p className="text-sm font-semibold text-[#1e2d2b]">
            Personalize this prep sheet
          </p>
          <p className="mt-1 text-sm text-[#5a6b68]">
            We can tailor these questions to your loved one&apos;s cancer type and stage using
            your uploaded report. The questions below are a useful starting point for any
            situation.
          </p>
          {generateError && (
            <p className="mt-2 text-xs text-amber-700 flex items-start gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 mt-0.5 shrink-0" aria-hidden />
              {generateError}
            </p>
          )}
          <Button
            type="button"
            size="sm"
            className="mt-3 bg-[#0F6E56] hover:bg-[#085041] text-white"
            onClick={handleGenerate}
            disabled={generating}
            aria-busy={generating}
          >
            {generating ? 'Personalizing…' : 'Personalize my prep sheet'}
          </Button>
        </div>

        {/* Question sections */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#1e2d2b] flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-[#0F6E56]" aria-hidden />
            Questions to bring to your care team
          </h2>
          {questions.map((section, i) => (
            <SectionToggle key={section.category} title={section.category} defaultOpen={i === 0}>
              <ol className="mt-3 space-y-3 list-decimal list-inside">
                {section.questions.map((q) => (
                  <li key={q} className="text-sm leading-[1.7] text-[#5a6b68]">
                    {q}
                  </li>
                ))}
              </ol>
            </SectionToggle>
          ))}
        </div>

        {/* Palliative care explainer */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#1e2d2b] flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-[#0F6E56]" aria-hidden />
            {PALLIATIVE_EXPLAINER.title}
          </h2>
          <div className="rounded-xl border border-[#cdd8d5] bg-white divide-y divide-[#cdd8d5]">
            {PALLIATIVE_EXPLAINER.points.map((point) => (
              <div key={point.label} className="px-5 py-4">
                <p className="text-sm font-semibold text-[#0F6E56]">{point.label}</p>
                <p className="mt-1 text-sm leading-[1.7] text-[#5a6b68]">{point.text}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#5a6b68]/80 italic">
            Sources: National Consensus Project for Quality Palliative Care · NCCN Clinical
            Practice Guidelines · American Cancer Society
          </p>
        </div>

        {/* Advance directive checklist */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#1e2d2b]">
            Important documents to have on file
          </h2>
          <p className="text-sm text-[#5a6b68]">
            These are not urgent requirements — they&apos;re practical documents that give your
            loved one a voice in their care and make things clearer for your family. Take them
            one at a time.
          </p>
          <div className="rounded-xl border border-[#cdd8d5] bg-white divide-y divide-[#cdd8d5]">
            {ADVANCE_DIRECTIVE_ITEMS.map((item) => (
              <label
                key={item}
                className="flex items-start gap-3 px-5 py-3.5 cursor-pointer hover:bg-[#f7faf9] transition-colors"
              >
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-[#cdd8d5] text-[#0F6E56] accent-[#0F6E56] shrink-0"
                  aria-label={item}
                />
                <span className="text-sm leading-[1.6] text-[#5a6b68]">{item}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-[#5a6b68]/80 italic">
            This checklist is for organizational reference only. Consult an attorney or your
            care team for guidance specific to your state and situation.
          </p>
        </div>

        {/* PDF Export placeholder */}
        <div className="flex flex-wrap gap-3 border-t border-[#cdd8d5] pt-6">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-[#cdd8d5] text-[#5a6b68]"
            onClick={() => window.print()}
          >
            <Download className="mr-2 h-4 w-4" aria-hidden />
            Print / Save as PDF
          </Button>
        </div>

        {/* Bottom disclaimer */}
        <div
          className={cn(
            'rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-xs leading-[1.7] text-amber-800'
          )}
          role="note"
        >
          <strong>Note for care teams:</strong> This prep sheet was generated by OncoKind
          as an educational preparation tool. It is not a clinical assessment and does not
          contain survival statistics, risk scores, or prognostic predictions. Every question
          has been designed to surface conversations, not conclusions.
        </div>
      </div>
    </div>
  );
}
