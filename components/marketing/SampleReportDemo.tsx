'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, FileText, FlaskConical, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const tabs = [
  { id: 'profile', label: 'Your Cancer Profile' },
  { id: 'prep', label: 'Your Doctor Prep Sheet' },
  { id: 'trials', label: 'Matched Clinical Trials' },
] as const;

type TabId = (typeof tabs)[number]['id'];

const biomarkers = [
  { label: 'PD-L1: 60%', tone: 'positive' },
  { label: 'EGFR: Negative', tone: 'neutral' },
  { label: 'ALK: Negative', tone: 'neutral' },
] as const;

const trialCards = [
  {
    title: 'KEYNOTE-789',
    meta: 'Phase III | Immunotherapy',
    summary: 'Pembrolizumab + Chemotherapy for Stage III NSCLC',
    why: 'PD-L1 ≥ 50%, Stage IIIA, no prior treatment',
    distance: '~12 miles — Memorial Cancer Center',
  },
  {
    title: 'CheckMate-816',
    meta: 'Phase III | Combination Therapy',
    summary: 'Nivolumab + Chemotherapy (Neoadjuvant)',
    why: 'Stage IIIA, resectable tumor, EGFR/ALK negative',
    distance: '~28 miles — University Medical Center',
  },
];

export function SampleReportDemo() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  const activeIndex = useMemo(
    () => tabs.findIndex((tab) => tab.id === activeTab),
    [activeTab]
  );

  function goNext() {
    setActiveTab(tabs[(activeIndex + 1) % tabs.length].id);
  }

  return (
    <section
      id="sample-demo"
      className="mt-12 scroll-mt-24 rounded-[calc(var(--radius-xl)+0.5rem)] border border-[var(--color-border-subtle)] bg-white p-6 shadow-[var(--shadow-lg)] sm:p-8"
    >
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[var(--radius-xl)] bg-[var(--color-primary-900)] p-6 text-[var(--color-text-inverse)]">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-accent-400)]">
            <Sparkles className="h-3.5 w-3.5" />
            Interactive sample report
          </p>
          <h2 className="mt-5 font-display text-3xl font-semibold text-white">
            See exactly what OncoKind creates before you sign up.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--color-surface-300)] sm:text-base">
            Fictional sample patient: Margaret T., 64. Newly diagnosed with Non-Small Cell Lung
            Cancer (NSCLC), Stage IIIA, pre-treatment.
          </p>
          <dl className="mt-6 space-y-4 text-sm text-[var(--color-surface-200)]">
            <div>
              <dt className="font-semibold text-white">Diagnosis</dt>
              <dd>Non-Small Cell Lung Cancer (NSCLC), Stage IIIA</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Key biomarkers</dt>
              <dd>PD-L1: 60% · EGFR: Negative · ALK: Negative</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Treatment status</dt>
              <dd>Newly diagnosed, pre-treatment</dd>
            </div>
          </dl>
        </div>

        <div>
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Sample report steps">
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
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                    selected
                      ? 'bg-[var(--color-primary-900)] text-white'
                      : 'bg-[var(--color-surface-100)] text-[var(--color-primary-700)] hover:bg-[var(--color-surface-200)]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-5 overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#fbf8f3_100%)] p-5 transition-all duration-300 sm:p-6">
            {activeTab === 'profile' ? (
              <div id="sample-panel-profile" role="tabpanel" className="space-y-5">
                <div className="rounded-[var(--radius-lg)] border border-[rgba(95,132,116,0.2)] bg-[rgba(95,132,116,0.08)] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-sage-600)]">
                        Your Cancer Profile
                      </p>
                      <h3 className="mt-2 font-display text-2xl font-semibold text-[var(--color-primary-900)]">
                        Margaret T., 64
                      </h3>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--color-primary-700)]">
                      Fictional case
                    </span>
                  </div>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Detail label="Diagnosis" value="Non-Small Cell Lung Cancer (NSCLC)" />
                    <Detail label="Stage" value="Stage IIIA" />
                    <Detail label="Treatment status" value="Newly diagnosed, pre-treatment" />
                    <Detail label="Next milestone" value="First oncology appointment" />
                  </div>
                  <div className="mt-5">
                    <p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-text-muted)]">
                      Key biomarkers
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {biomarkers.map((marker) => (
                        <span
                          key={marker.label}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            marker.tone === 'positive'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {marker.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <MiniCard title="What this means">
                    Stage IIIA means the cancer has reached nearby lymph nodes but not distant
                    organs.
                  </MiniCard>
                  <MiniCard title="Why PD-L1 matters">
                    A PD-L1 score of 60% may make immunotherapy an important part of the
                    conversation.
                  </MiniCard>
                  <MiniCard title="Why EGFR / ALK matter">
                    Negative results help narrow which targeted therapies are less likely to fit.
                  </MiniCard>
                </div>
              </div>
            ) : null}

            {activeTab === 'prep' ? (
              <div id="sample-panel-prep" role="tabpanel" className="space-y-4">
                <div className="relative rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-sm)]">
                  <span className="absolute right-5 top-5 rotate-[-8deg] text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[rgba(13,27,42,0.12)]">
                    Generated by OncoKind
                  </span>
                  <p className="text-sm font-semibold text-[var(--color-primary-900)]">
                    Doctor Prep Sheet — Oncology Appointment
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    Prepared by OncoKind · For educational use only
                  </p>

                  <div className="mt-5 grid gap-3 text-sm text-[var(--color-text-secondary)] sm:grid-cols-[170px_1fr]">
                    <PrepRow label="Cancer Type" value="Non-Small Cell Lung Cancer (NSCLC)" />
                    <PrepRow label="Stage" value="Stage IIIA" />
                    <PrepRow
                      label="What This Means"
                      value="The cancer has spread to nearby lymph nodes but has not reached distant organs. Stage IIIA is often treated with a combination of approaches."
                    />
                    <PrepRow
                      label="Key Biomarkers"
                      value="PD-L1: 60% -> This is good news. A high PD-L1 score means immunotherapy may be especially effective for you. EGFR: Negative -> Certain targeted therapies like Tagrisso would not apply here. ALK: Negative -> ALK inhibitors are not a current consideration."
                    />
                    <PrepRow label="Next Milestone" value="First oncology appointment" />
                  </div>

                  <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                    <section>
                      <h4 className="font-semibold text-[var(--color-primary-900)]">
                        Understanding Your Diagnosis
                      </h4>
                      <p className="mt-1">
                        Your pathology report confirms Non-Small Cell Lung Cancer (NSCLC),
                        specifically adenocarcinoma, at Stage IIIA. This means the tumor has
                        involved lymph nodes on the same side as the primary tumor.
                      </p>
                    </section>
                    <section>
                      <h4 className="font-semibold text-[var(--color-primary-900)]">
                        Questions to Ask Your Oncologist
                      </h4>
                      <ol className="mt-1 list-decimal space-y-1 pl-5">
                        <li>
                          Given my PD-L1 score of 60%, am I a candidate for immunotherapy such as
                          pembrolizumab/Keytruda?
                        </li>
                        <li>Should I be tested for ROS1, MET, or KRAS as well?</li>
                        <li>Is the goal of treatment curative, control, or palliative?</li>
                        <li>What clinical trials are available nearby for Stage IIIA NSCLC?</li>
                        <li>How will we monitor my response to treatment?</li>
                      </ol>
                    </section>
                    <section>
                      <h4 className="font-semibold text-[var(--color-primary-900)]">What to Bring</h4>
                      <ul className="mt-1 list-disc space-y-1 pl-5">
                        <li>This prep sheet, printed or on your phone</li>
                        <li>All imaging CDs or files (CT, PET scans)</li>
                        <li>List of current medications</li>
                        <li>Insurance card and photo ID</li>
                        <li>A trusted person to take notes</li>
                      </ul>
                    </section>
                    <section>
                      <h4 className="font-semibold text-[var(--color-primary-900)]">
                        Important Reminders
                      </h4>
                      <p className="mt-1">
                        You are the most important voice in this room. It is always okay to ask
                        your doctor to slow down, repeat something, or explain it differently.
                      </p>
                    </section>
                  </div>
                </div>
                <Button type="button" variant="outline" disabled title="Sign up to download your real report">
                  <FileText className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            ) : null}

            {activeTab === 'trials' ? (
              <div id="sample-panel-trials" role="tabpanel" className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-[rgba(95,132,116,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-sage-600)]">
                  <FlaskConical className="h-3.5 w-3.5" />
                  Based on your biomarkers and location
                </div>
                <div className="space-y-4">
                  {trialCards.map((trial) => (
                    <div
                      key={trial.title}
                      className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-sm)]"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-[var(--color-primary-900)]">
                            {trial.title}
                          </p>
                          <p className="text-xs uppercase tracking-[var(--tracking-widest)] text-[var(--color-text-muted)]">
                            {trial.meta}
                          </p>
                        </div>
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Enrolling
                        </span>
                      </div>
                      <p className="mt-3 font-medium text-[var(--color-primary-800)]">{trial.summary}</p>
                      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                        <span className="font-semibold text-[var(--color-primary-900)]">
                          You may qualify because:
                        </span>{' '}
                        {trial.why}
                      </p>
                      <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                        <span className="font-semibold text-[var(--color-primary-900)]">Distance:</span>{' '}
                        {trial.distance}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Button type="button" variant="outline" size="sm">
                          Learn More
                        </Button>
                        <Button type="button" size="sm">
                          Ask My Doctor About This
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
                  These are sample results for demonstration. Real trial matching is available
                  after uploading your report.
                </p>
              </div>
            ) : null}
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="outline" onClick={goNext}>
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/signup">Upload Your Report — It&apos;s Free</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/signup">Learn How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-white/70 bg-white/80 p-4">
      <p className="text-xs font-semibold uppercase tracking-[var(--tracking-widest)] text-[var(--color-text-muted)]">
        {label}
      </p>
      <p className="mt-1 font-medium text-[var(--color-primary-900)]">{value}</p>
    </div>
  );
}

function MiniCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-4">
      <p className="font-semibold text-[var(--color-primary-900)]">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">{children}</p>
    </div>
  );
}

function PrepRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <p className="font-semibold text-[var(--color-primary-900)]">{label}</p>
      <p>{value}</p>
    </>
  );
}
