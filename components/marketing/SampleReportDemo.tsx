'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckSquare, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MedicalDisclaimer, OutputSources } from '@/components/disclosures/OutputDisclosures';
import { getCancerProfileSources, getClinicalTrialSources } from '@/lib/disclosures';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'profile', label: 'Cancer Profile' },
  { id: 'prep', label: 'Doctor Prep Sheet' },
  { id: 'trials', label: 'Clinical Trial Matches' },
] as const;

type TabId = (typeof tabs)[number]['id'];

const biomarkerCards = [
  {
    label: 'PD-L1: 60%',
    tone: 'positive',
    description:
      'A high PD-L1 score means immunotherapy may be especially effective. This is an important finding.',
  },
  {
    label: 'EGFR: Negative',
    tone: 'neutral',
    description:
      'Certain targeted therapies would not apply here. Your oncologist will focus on other options.',
  },
  {
    label: 'ALK: Negative',
    tone: 'neutral',
    description: 'ALK inhibitors are not a current consideration.',
  },
] as const;

const trialCards = [
  {
    id: 'keynote-789',
    title: 'KEYNOTE-789',
    meta: 'Phase III',
    category: 'Immunotherapy',
    summary: 'Pembrolizumab + Chemotherapy for Stage III NSCLC',
    why: 'PD-L1 ≥ 50%, Stage IIIA, no prior treatment',
    distance: '~12 miles — Memorial Cancer Center',
    status: 'Enrolling',
    detail:
      'This sample match highlights why PD-L1 expression and stage matter together. It gives caregivers a concrete trial name to ask about during the first oncology visit.',
    doctorPrompt:
      'Can we talk about whether KEYNOTE-789 or a similar pembrolizumab-based trial is relevant for my stage, PD-L1 score, and treatment plan?',
  },
  {
    id: 'checkmate-816',
    title: 'CheckMate-816',
    meta: 'Phase III',
    category: 'Combination Therapy',
    summary: 'Nivolumab + Chemotherapy (Neoadjuvant)',
    why: 'Stage IIIA, resectable tumor, EGFR/ALK negative',
    distance: '~28 miles — University Medical Center',
    status: 'Enrolling',
    detail:
      'This example shows how resectability and biomarker exclusions can affect trial fit. It is the kind of plain-language context families need before meeting with the care team.',
    doctorPrompt:
      'Is CheckMate-816, or another neoadjuvant immunotherapy option, something we should consider because the tumor may be resectable and EGFR / ALK are negative?',
  },
] as const;

export function SampleReportDemo() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [expandedTrialId, setExpandedTrialId] = useState<string | null>(null);
  const [doctorQuestion, setDoctorQuestion] = useState<string | null>(null);

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.id === activeTab), [activeTab]);
  const activeTabLabel = tabs[activeIndex]?.label ?? tabs[0].label;

  function goToTab(index: number) {
    if (index < 0 || index >= tabs.length) return;
    setActiveTab(tabs[index].id);
  }

  function goNext() {
    goToTab((activeIndex + 1) % tabs.length);
  }

  function goBack() {
    goToTab((activeIndex - 1 + tabs.length) % tabs.length);
  }

  function askDoctorAboutTrial(question: string) {
    setDoctorQuestion(question);
    setActiveTab('prep');
  }

  return (
    <section
      id="sample-demo"
      className="mt-12 scroll-mt-24 rounded-[calc(var(--radius-xl)+0.5rem)] border border-[var(--color-border-subtle)] bg-white p-5 shadow-[var(--shadow-lg)] sm:p-8"
    >
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
        <aside className="rounded-[var(--radius-xl)] bg-[linear-gradient(180deg,#102235_0%,#17314a_100%)] p-6 text-[var(--color-text-inverse)]">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-400)]">
            <Sparkles className="h-3.5 w-3.5" />
            Interactive sample demo
          </p>
          <h2 className="mt-5 font-display text-3xl font-semibold text-white">
            Try a sample caregiver report before you sign up.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-surface-300)] sm:text-base">
            Margaret T., 64 — Non-Small Cell Lung Cancer (NSCLC), Stage IIIA, PD-L1: 60%, EGFR:
            Negative, ALK: Negative
          </p>
          <div className="mt-6 space-y-4 rounded-[var(--radius-lg)] border border-white/10 bg-white/5 p-5">
            <InfoRow label="Cancer Type" value="Non-Small Cell Lung Cancer (NSCLC)" />
            <InfoRow label="Stage" value="Stage IIIA" />
            <InfoRow label="Next Milestone" value="First oncology appointment" />
          </div>
          <p className="mt-6 text-sm leading-relaxed text-[var(--color-surface-300)]">
            Click through the profile, doctor prep sheet, and sample clinical trial matches to see
            how OncoKind turns a report into something a caregiver can actually use.
          </p>
        </aside>

        <div>
          <div className="hidden flex-wrap gap-2 sm:flex" role="tablist" aria-label="Sample demo tabs">
            {tabs.map((tab) => {
              const selected = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={`sample-panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                    selected
                      ? 'bg-[var(--color-primary-900)] text-white shadow-[var(--shadow-sm)]'
                      : 'bg-[var(--color-surface-100)] text-[var(--color-primary-700)] hover:bg-[var(--color-surface-200)]'
                  )}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mb-4 flex items-center justify-between gap-3 sm:hidden">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--color-border)] px-4 py-2 text-sm font-semibold text-[var(--color-primary-800)] transition-colors hover:bg-[var(--color-surface-100)]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-text-muted)]">
                Step {activeIndex + 1} of {tabs.length}
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--color-primary-900)]">{activeTabLabel}</p>
            </div>
            <button
              type="button"
              onClick={goNext}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--color-primary-900)] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-800)]"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#fbf8f3_100%)] p-4 sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                id={`sample-panel-${activeTab}`}
                role="tabpanel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.24, ease: 'easeOut' }}
              >
                {activeTab === 'profile' ? <CancerProfilePanel /> : null}
                {activeTab === 'prep' ? <DoctorPrepPanel doctorQuestion={doctorQuestion} /> : null}
                {activeTab === 'trials' ? (
                  <TrialMatchesPanel
                    expandedTrialId={expandedTrialId}
                    onLearnMore={(trialId) =>
                      setExpandedTrialId((current) => (current === trialId ? null : trialId))
                    }
                    onAskDoctor={askDoctorAboutTrial}
                  />
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-5 hidden items-center justify-between gap-3 sm:flex">
            <Button type="button" variant="outline" onClick={goBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button type="button" onClick={goNext}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 rounded-[var(--radius-xl)] bg-[var(--color-surface-100)] px-5 py-6 text-center sm:px-8">
        <p className="text-base font-semibold text-[var(--color-primary-900)]">
          This is what OncoKind creates from your actual report.
        </p>
        <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/signup">Upload Your Report — It&apos;s Free</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/features/doctor-prep-sheet">Learn How It Works</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function CancerProfilePanel() {
  const sources = getCancerProfileSources('Non-Small Cell Lung Cancer');
  return (
    <div className="space-y-5">
      <div className="rounded-[var(--radius-lg)] border border-[rgba(85,136,123,0.18)] bg-[rgba(99,164,145,0.08)] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-sage-600)]">
              Cancer Profile
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-[var(--color-primary-900)]">
              Margaret T., 64
            </h3>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--color-primary-700)]">
            Fictional sample patient
          </span>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-[180px_1fr]">
          <ProfileRow label="Cancer Type" value="Non-Small Cell Lung Cancer (NSCLC)" />
          <ProfileRow label="Stage" value="Stage IIIA" />
          <ProfileRow
            label="What This Means"
            value="The cancer has spread to nearby lymph nodes but has not reached distant organs. Stage IIIA is often treated with a combination of approaches."
          />
          <div className="sm:col-span-2">
            <p className="text-sm font-semibold text-[var(--color-primary-900)]">Key Biomarkers</p>
            <div className="mt-3 space-y-3">
              {biomarkerCards.map((marker) => (
                <div
                  key={marker.label}
                  className="rounded-[var(--radius-md)] border border-white/80 bg-white/80 p-4"
                >
                  <span
                    className={cn(
                      'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                      marker.tone === 'positive'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-700'
                    )}
                  >
                    {marker.label}
                  </span>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    {marker.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <ProfileRow label="Next Milestone" value="First oncology appointment" />
        </dl>
      </div>
      <OutputSources items={sources} />
      <MedicalDisclaimer />
    </div>
  );
}

function DoctorPrepPanel({ doctorQuestion }: { doctorQuestion: string | null }) {
  const sources = getCancerProfileSources('Non-Small Cell Lung Cancer');
  return (
    <div className="space-y-4">
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <p className="text-sm font-semibold text-[var(--color-primary-900)]">
          Doctor Prep Sheet — Oncology Appointment · Prepared by OncoKind
        </p>

        {doctorQuestion ? (
          <div className="mt-5 rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Suggested question to bring from the sample trial match</p>
            <p className="mt-1 leading-relaxed">{doctorQuestion}</p>
          </div>
        ) : null}

        <div className="mt-6 space-y-6 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          <section>
            <h4 className="font-semibold text-[var(--color-primary-900)]">Understanding Your Diagnosis</h4>
            <p className="mt-2">
              Stage IIIA NSCLC means the cancer is still in the chest, but it has spread beyond
              the original tumor to nearby lymph nodes. It has not reached distant organs, which is
              why your care team may talk about a combination of treatments such as chemotherapy,
              radiation, immunotherapy, or surgery depending on the full picture.
            </p>
            <p className="mt-2">
              This stage often requires careful planning across more than one specialist. Asking how
              each part of the treatment plan fits together can help you feel more grounded before
              decisions are made.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-[var(--color-primary-900)]">Questions to Ask Your Oncologist</h4>
            <ol className="mt-2 list-decimal space-y-2 pl-5">
              <li>
                Given my PD-L1 score of 60%, am I a candidate for immunotherapy such as
                pembrolizumab either alone or in combination?
              </li>
              <li>Should I be tested for additional biomarkers like ROS1, MET, or KRAS?</li>
              <li>What is the goal of treatment — curative, control, or palliative?</li>
              <li>
                What clinical trials are available for Stage IIIA NSCLC with high PD-L1 expression
                in this area?
              </li>
              <li>How will we monitor my response to treatment?</li>
            </ol>
          </section>

          <section>
            <h4 className="font-semibold text-[var(--color-primary-900)]">What to Bring</h4>
            <ul className="mt-2 space-y-2">
              {[
                'Imaging files',
                'Medication list',
                'Insurance card',
                'Support person',
                'This sheet',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-sage-500)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-[var(--color-primary-900)]">Important Reminder</h4>
            <p className="mt-2">
              If the conversation starts moving too fast, you can always ask your doctor to slow
              down, repeat something, or explain it another way. You do not have to understand
              everything at once to ask good questions.
            </p>
          </section>
        </div>
      </div>

      <span className="group relative inline-flex w-fit">
        <Button type="button" variant="outline" disabled className="pointer-events-none">
          <FileText className="mr-2 h-4 w-4" />
          Download PDF
        </Button>
        <span className="pointer-events-none absolute -top-11 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-[var(--color-primary-900)] px-3 py-2 text-xs font-medium text-white shadow-[var(--shadow-md)] group-hover:block">
          Sign up to download your personalized report
        </span>
      </span>
      <OutputSources items={sources} />
      <MedicalDisclaimer />
    </div>
  );
}

function TrialMatchesPanel({
  expandedTrialId,
  onLearnMore,
  onAskDoctor,
}: {
  expandedTrialId: string | null;
  onLearnMore: (trialId: string) => void;
  onAskDoctor: (question: string) => void;
}) {
  const sources = getClinicalTrialSources();
  return (
    <div className="space-y-4">
      <div className="inline-flex items-center rounded-full bg-[rgba(99,164,145,0.12)] px-3 py-1 text-xs font-semibold tracking-[var(--tracking-wide)] text-[var(--color-sage-700)]">
        🔬 Matched based on biomarkers and stage
      </div>

      <div className="space-y-4">
        {trialCards.map((trial) => {
          const expanded = expandedTrialId === trial.id;
          return (
            <article
              key={trial.id}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-[var(--color-primary-900)]">
                    {trial.title}{' '}
                    <span className="text-sm font-medium text-[var(--color-text-muted)]">
                      | {trial.meta} | {trial.category}
                    </span>
                  </p>
                  <p className="mt-2 font-medium text-[var(--color-primary-800)]">{trial.summary}</p>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {trial.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-[var(--color-text-secondary)]">
                <p>
                  <span className="font-semibold text-[var(--color-primary-900)]">
                    Why you may qualify:
                  </span>{' '}
                  {trial.why}
                </p>
                <p>
                  <span className="font-semibold text-[var(--color-primary-900)]">Distance:</span>{' '}
                  {trial.distance}
                </p>
                {expanded ? <p className="rounded-[var(--radius-md)] bg-[var(--color-surface-100)] p-3">{trial.detail}</p> : null}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Button type="button" variant="outline" size="sm" onClick={() => onLearnMore(trial.id)}>
                  Learn More
                </Button>
                <Button type="button" size="sm" onClick={() => onAskDoctor(trial.doctorPrompt)}>
                  Ask My Doctor About This
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <OutputSources items={sources} />
      <div className="space-y-2">
        <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
          These are sample results for demonstration only. Real trial matching is available after
          uploading your report.
        </p>
        <MedicalDisclaimer />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-surface-400)]">
        {label}
      </p>
      <p className="mt-1 text-sm text-white">{value}</p>
    </div>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-sm font-semibold text-[var(--color-primary-900)]">{label}</dt>
      <dd className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{value}</dd>
    </>
  );
}
