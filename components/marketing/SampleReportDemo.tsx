'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckSquare, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MedicalDisclaimer, OutputSources } from '@/components/disclosures/OutputDisclosures';
import { getCancerProfileSources, getClinicalTrialSources } from '@/lib/disclosures';
import { ROSEMARIE_BIOMARKERS, ROSEMARIE_SAMPLE } from '@/lib/sample-rosemarie';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'profile', label: 'Cancer Profile' },
  { id: 'prep', label: 'Doctor Prep Sheet' },
  { id: 'trials', label: 'Clinical Trial Matches' },
] as const;

type TabId = (typeof tabs)[number]['id'];

export function SampleReportDemo() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const [expandedTrialId, setExpandedTrialId] = useState<string | null>(null);
  const [doctorQuestion, setDoctorQuestion] = useState<string | null>(null);

  const activeIndex = useMemo(() => tabs.findIndex((tab) => tab.id === activeTab), [activeTab]);
  const activeTabLabel = tabs[activeIndex]?.label ?? tabs[0].label;

  useEffect(() => {
    track('sample_demo_step_viewed', { step: activeIndex + 1 });
  }, [activeIndex]);

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
            {ROSEMARIE_SAMPLE.patientName}: {ROSEMARIE_SAMPLE.cancerType}, {ROSEMARIE_SAMPLE.stage}, HPV:{' '}
            {ROSEMARIE_SAMPLE.hpv.value}, PD-L1 CPS: ≥10, BRCA1/2: Negative
          </p>
          <div className="mt-6 space-y-4 rounded-[var(--radius-lg)] border border-white/10 bg-white/5 p-5">
            <InfoRow label="Cancer Type" value={ROSEMARIE_SAMPLE.cancerType} />
            <InfoRow label="Stage" value={ROSEMARIE_SAMPLE.stage} />
            <InfoRow label="Next Milestone" value={ROSEMARIE_SAMPLE.nextMilestone} />
          </div>
        <p className="mt-6 text-sm leading-relaxed text-[var(--color-surface-300)]">
          Click through the profile, doctor prep sheet, and sample clinical trial matches to see
          how OncoKind turns a pathology report into something a caregiver can actually use.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-[var(--color-surface-400)]">
          {ROSEMARIE_SAMPLE.illustrationNote}
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
            <Link href="/signup">Upload Your Report. It&apos;s Free</Link>
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
  const sources = getCancerProfileSources(ROSEMARIE_SAMPLE.cancerType);
  return (
    <div className="space-y-5">
      <div className="rounded-[var(--radius-lg)] border border-[rgba(85,136,123,0.18)] bg-[rgba(99,164,145,0.08)] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-sage-600)]">
              Cancer Profile
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-[var(--color-primary-900)]">
              {ROSEMARIE_SAMPLE.patientName}
            </h3>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--color-primary-700)]">
            Sample profile
          </span>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-[180px_1fr]">
          <ProfileRow label="Cancer Type" value={ROSEMARIE_SAMPLE.cancerType} />
          <ProfileRow label="Stage" value={ROSEMARIE_SAMPLE.stage} />
          <ProfileRow label="What This Means" value={ROSEMARIE_SAMPLE.whatThisMeans} />
          <div className="sm:col-span-2">
            <p className="text-sm font-semibold text-[var(--color-primary-900)]">Key Biomarkers</p>
            <div className="mt-3 space-y-3">
              {ROSEMARIE_BIOMARKERS.map((marker) => (
                <div
                  key={marker.label}
                  className="rounded-[var(--radius-md)] border border-white/80 bg-white/80 p-4"
                >
                  <span
                    className={cn(
                      'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                      'label' in marker && marker.label.includes('Negative')
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-emerald-100 text-emerald-700'
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
          <ProfileRow label="Next Milestone" value={ROSEMARIE_SAMPLE.nextMilestone} />
        </dl>
      </div>
      <OutputSources items={sources} />
      <MedicalDisclaimer />
    </div>
  );
}

function DoctorPrepPanel({ doctorQuestion }: { doctorQuestion: string | null }) {
  const sources = getCancerProfileSources(ROSEMARIE_SAMPLE.cancerType);
  return (
    <div className="space-y-4">
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)] sm:p-6">
        <p className="text-sm font-semibold text-[var(--color-primary-900)]">
          Doctor Prep Sheet: Oncology Appointment · Prepared by OncoKind
        </p>

        {doctorQuestion ? (
          <div className="mt-5 rounded-[var(--radius-md)] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-semibold">Suggested question to bring from the sample trial match</p>
            <p className="mt-1 leading-relaxed">{doctorQuestion}</p>
          </div>
        ) : null}

        <div className="mt-6 space-y-6 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          <section>
            <h4 className="font-semibold text-[var(--color-primary-900)]">Understanding the Diagnosis</h4>
            <p className="mt-2">{ROSEMARIE_SAMPLE.prepDiagnosis}</p>
            <p className="mt-2">
              Treatment for Stage IV vulvar cancer often involves more than one specialist working
              together. Asking how each part of the plan fits together, and what the goal of
              treatment is, helps you walk in prepared.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-[var(--color-primary-900)]">Questions to Ask Your Oncologist</h4>
            <ol className="mt-2 list-decimal space-y-2 pl-5">
              {ROSEMARIE_SAMPLE.prepQuestions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ol>
          </section>

          <section>
            <h4 className="font-semibold text-[var(--color-primary-900)]">What to Bring</h4>
            <ul className="mt-2 space-y-2">
              {['Imaging files', 'Medication list', 'Insurance card', 'Support person', 'This sheet'].map(
                (item) => (
                <li key={item} className="flex items-start gap-2">
                  <CheckSquare className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-sage-500)]" />
                  <span>{item}</span>
                </li>
                )
              )}
            </ul>
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
        {ROSEMARIE_SAMPLE.trials.map((trial) => {
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
