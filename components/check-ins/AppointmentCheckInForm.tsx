'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

const preparednessOptions = [
  { value: 1, label: '😟 Not prepared' },
  { value: 2, label: '😐 Somewhat prepared' },
  { value: 3, label: '🙂 Prepared' },
  { value: 4, label: '😊 Very prepared' },
];

const prepSheetOptions = [
  { value: 'yes', label: 'Yes, definitely' },
  { value: 'somewhat', label: 'Somewhat' },
  { value: 'no', label: 'Not really' },
  { value: 'not_used', label: "I didn't use it" },
];

const trialsOptions = [
  { value: 'yes', label: 'Yes, I asked about them' },
  { value: 'forgot', label: 'No, I forgot' },
  { value: 'not_relevant', label: 'No trials were relevant' },
  { value: 'not_available', label: "I don't have trial matches yet" },
];

export function AppointmentCheckInForm({ appointmentId }: { appointmentId: string }) {
  const [preparednessScore, setPreparednessScore] = useState<number | null>(null);
  const [prepSheetHelped, setPrepSheetHelped] = useState('');
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [discussedTrials, setDiscussedTrials] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/check-ins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appointmentId,
          preparednessScore,
          prepSheetHelped,
          followUpQuestion,
          discussedTrials: discussedTrials || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? 'Unable to save your check-in right now.');
        return;
      }

      setSuccess(data.successMessage);
      setExplanation(data.followUpExplanation ?? null);
    } catch {
      setError('Unable to save your check-in right now.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-[var(--radius-xl)] bg-white p-6 shadow-[var(--shadow-md)]">
      <QuestionBlock title="How prepared did you feel walking into your appointment?" required>
        <OptionGrid
          options={preparednessOptions}
          selected={preparednessScore}
          onSelect={(value) => setPreparednessScore(Number(value))}
        />
      </QuestionBlock>

      <QuestionBlock title="Did your Doctor Prep Sheet help you ask better questions?" required>
        <OptionGrid options={prepSheetOptions} selected={prepSheetHelped} onSelect={setPrepSheetHelped} />
      </QuestionBlock>

      <QuestionBlock title="Is there anything your doctor said that you'd like help understanding?">
        <textarea
          value={followUpQuestion}
          onChange={(event) => setFollowUpQuestion(event.target.value.slice(0, 280))}
          maxLength={280}
          className="min-h-[120px] w-full rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm"
          placeholder="Optional. If you fill this in, OncoKind will try to explain it in plain English right after you submit."
        />
        <p className="mt-1 text-xs text-[var(--color-text-muted)]">{followUpQuestion.length}/280</p>
      </QuestionBlock>

      <QuestionBlock title="Did you discuss any of the clinical trials we matched for you?">
        <OptionGrid options={trialsOptions} selected={discussedTrials} onSelect={setDiscussedTrials} />
      </QuestionBlock>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
      {explanation ? (
        <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-100)] p-4">
          <p className="text-sm font-semibold text-[var(--color-primary-900)]">
            Here&apos;s what we found about what your doctor mentioned:
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{explanation}</p>
        </div>
      ) : null}

      <Button type="submit" disabled={saving}>
        {saving ? 'Saving…' : 'Save My Check-In'}
      </Button>
    </form>
  );
}

function QuestionBlock({
  title,
  required = false,
  children,
}: {
  title: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section>
      <p className="font-semibold text-[var(--color-primary-900)]">
        {title} {required ? <span className="text-[var(--color-accent-600)]">*</span> : null}
      </p>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function OptionGrid({
  options,
  selected,
  onSelect,
}: {
  options: Array<{ value: string | number; label: string }>;
  selected: string | number | null;
  onSelect: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const isSelected = selected === option.value;
        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onSelect(String(option.value))}
            className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors ${
              isSelected
                ? 'border-[var(--color-primary-900)] bg-[var(--color-primary-900)] text-white'
                : 'border-[var(--color-border)] bg-white text-[var(--color-primary-800)] hover:bg-[var(--color-surface-100)]'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
