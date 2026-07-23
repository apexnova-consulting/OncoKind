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
    label: 'HPV Status: Positive (p16+)',
    tone: 'positive',
    description:
      'HPV-positive vulvar cancer is associated with certain immunotherapy eligibility and can influence treatment planning. This is an important finding to discuss with the oncology team.',
  },
  {
    label: 'PD-L1 (CPS): ≥10 — Positive',
    tone: 'positive',
    description:
      'A CPS of 10 or higher may make your loved one eligible for pembrolizumab (immunotherapy). Your oncologist will evaluate whether this is part of the treatment plan.',
  },
  {
    label: 'BRCA1/2: Negative',
    tone: 'neutral',
    description:
      'No hereditary BRCA mutation detected. This affects some targeted therapy options, and your oncologist may recommend additional molecular testing.',
  },
] as const;

const trialCards = [
  {
    id: 'keynote-158',
    title: 'KEYNOTE-158',
    meta: 'Phase II',
    category: 'Immunotherapy',
    summary: 'Pembrolizumab for PD-L1 Positive Advanced Solid Tumors (incl. vulvar)',
    why: 'PD-L1 CPS ≥10, Stage IV, HPV-positive squamous cell carcinoma',
    distance: '~9 miles — Regional Cancer Center',
    status: 'Enrolling',
    detail:
      'This trial evaluates pembrolizumab in patients with PD-L1 positive solid tumors, including vulvar cancer. HPV-positive and high PD-L1 status are both relevant eligibility factors here.',
    doctorPrompt:
      'Given that the PD-L1 CPS is ≥10 and HPV status is positive, are we a candidate for pembrolizumab — either through a trial like KEYNOTE-158 or as standard of care?',
  },
  {
    id: 'gog-vul-01',
    title: 'Cisplatin + Paclitaxel + Pembrolizumab',
    meta: 'Phase II',
    category: 'Combination Therapy',
    summary: 'Chemotherapy Combined with Immunotherapy for Advanced Vulvar Cancer',
    why: 'Stage IV vulvar squamous cell carcinoma, PD-L1 positive, no prior systemic therapy',
    distance: '~22 miles — University Medical Center',
    status: 'Enrolling',
    detail:
      'This trial evaluates whether adding pembrolizumab to standard chemotherapy improves outcomes in advanced vulvar cancer. It is an example of the combination approach many oncologists are exploring for PD-L1 positive cases.',
    doctorPrompt:
      'Is there a clinical trial combining chemotherapy with pembrolizumab for Stage IV vulvar cancer that we should consider, given the PD-L1 CPS of ≥10?',
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
            Rosemarie N. — Vulvar Squamous Cell Carcinoma (VSCC), Stage IV, HPV: Positive (p16+),
            PD-L1 CPS: ≥10, BRCA1/2: Negative
          </p>
          <div className="mt-6 space-y-4 rounded-[var(--radius-lg)] border border-white/10 bg-white/5 p-5">
            <InfoRow label="Cancer Type" value="Non-Small Cell Lung Cancer (NSCLC)" />
            <InfoRow label="Stage" value="Stage IIIA" />
            <InfoRow label="Next Milestone" value="First oncology appointment" />
          </div>
        <p className="mt-6 text-sm leading-relaxed text-[var(--color-surface-300)]">
          Click through the profile, doctor prep sheet, and sample clinical trial matches to see
          how OncoKind turns a pathology report into something a caregiver can actually use.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-[var(--color-surface-400)]">
          Profile based on Rosemarie N. For educational illustration only.
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
  const sources = getCancerProfileSources('Vulvar Squamous Cell Carcinoma');
  return (
    <div className="space-y-5">
      <div className="rounded-[var(--radius-lg)] border border-[rgba(85,136,123,0.18)] bg-[rgba(99,164,145,0.08)] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-sage-600)]">
              Cancer Profile
            </p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-[var(--color-primary-900)]">
              Rosemarie N.
            </h3>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--color-primary-700)]">
            Sample profile
          </span>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-[180px_1fr]">
          <ProfileRow label="Cancer Type" value="Vulvar Squamous Cell Carcinoma (VSCC)" />
          <ProfileRow label="Stage" value="Stage IV" />
          <ProfileRow
            label="What This Means"
            value="Stage IV means the cancer has spread beyond the vulva. The care team will review imaging and other findings to determine the treatment plan. Many options remain on the table and your oncologist will walk through each one."
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
  const sources = getCancerProfileSources('Vulvar Squamous Cell Carcinoma');
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
            <h4 className="font-semibold text-[var(--color-primary-900)]">Understanding the Diagnosis</h4>
            <p className="mt-2">
              Stage IV vulvar squamous cell carcinoma means the cancer has spread beyond the vulva.
              The HPV-positive (p16+) status and PD-L1 CPS of ≥10 are important findings — they
              may open the door to immunotherapy options, including pembrolizumab, alongside
              standard chemotherapy. Your oncology team will review imaging and other details to
              build the full treatment plan.
            </p>
            <p className="mt-2">
              Treatment for Stage IV vulvar cancer often involves more than one specialist working
              together. Asking how each part of the plan fits together — and what the goal of
              treatment is — helps you walk in prepared.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-[var(--color-primary-900)]">Questions to Ask Your Oncologist</h4>
            <ol className="mt-2 list-decimal space-y-2 pl-5">
              <li>
                Given the PD-L1 CPS of ≥10 and HPV-positive status, is pembrolizumab
                (immunotherapy) part of the treatment plan — either alone or combined with
                chemotherapy?
              </li>
              <li>
                What chemotherapy regimen is being recommended, and what side effects should we
                watch for?
              </li>
              <li>
                What is the primary goal of treatment right now — to reduce the cancer, to manage
                symptoms, or something else?
              </li>
              <li>
                Are there clinical trials for Stage IV vulvar cancer that we should consider, given
                the PD-L1 and HPV findings?
              </li>
              <li>How will we know if the treatment is working, and how often will we check?</li>
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
