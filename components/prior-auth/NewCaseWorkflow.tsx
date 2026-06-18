'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  FileText,
  Shield,
  BedDouble,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type CaseType = 'prior_auth' | 'step_therapy' | 'continued_stay';

const STEPS_BY_TYPE: Record<CaseType, string[]> = {
  prior_auth:    ['Case Type', 'Facility & Patient', 'Insurance', 'Medication & Diagnosis', 'Review'],
  step_therapy:  ['Case Type', 'Facility & Patient', 'Insurance', 'Medication & Drug History', 'State & Law', 'Review'],
  continued_stay: ['Case Type', 'Facility & Patient', 'Insurance', 'Diagnosis & Status', 'Review'],
};

interface DrugTrial {
  drug_name: string;
  reason_discontinued: string;
  was_ineffective: boolean;
  caused_adverse_reaction: boolean;
  contraindicated: boolean;
}

interface FormData {
  patient_identifier: string;
  facility_name: string;
  facility_npi: string;
  facility_state: string;
  facility_type: string;
  prescribing_physician: string;
  payer_name: string;
  payer_id: string;
  plan_name: string;
  member_id_masked: string;
  existing_auth_number: string;
  medication_name: string;
  medication_nda_ndc: string;
  diagnosis_code: string;
  diagnosis_description: string;
  clinical_notes: string;
  is_urgent: boolean;
  step_therapy_drugs_tried: string;
  admission_date: string;
  functional_status: string;
  drug_trials: DrugTrial[];
}

const STATE_LAW_LABELS: Record<string, string> = {
  CA: 'California H&S Code §1367.206',
  TX: 'Texas Insurance Code Ch. 1369',
  FL: 'Florida Statute §627.42392',
  NY: 'New York Insurance Law §3217-g',
  PA: 'Pennsylvania Act 2018-146',
  IL: 'Illinois Public Act 100-0718',
  OH: 'Ohio Revised Code §3923.85',
  GA: 'Georgia Code §33-24-59.22',
  NC: 'North Carolina G.S. §58-51-37',
  MI: 'Michigan Public Act 162 of 2018',
  NJ: 'New Jersey P.L. 2018, c. 116',
  VA: 'Virginia Code §38.2-3407.15:3',
  WA: 'Washington RCW 48.43.730',
  AZ: 'Arizona R.S. §20-2631',
  MA: 'Massachusetts G.L. c. 176O §14',
};

export function NewCaseWorkflow({ initialCaseType }: { initialCaseType?: CaseType }) {
  const router = useRouter();
  const [caseType, setCaseType] = useState<CaseType>(initialCaseType ?? 'prior_auth');
  const [step, setStep] = useState(initialCaseType ? 1 : 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    patient_identifier: '',
    facility_name: '',
    facility_npi: '',
    facility_state: '',
    facility_type: 'Skilled Nursing Facility',
    prescribing_physician: '',
    payer_name: '',
    payer_id: '',
    plan_name: '',
    member_id_masked: '',
    existing_auth_number: '',
    medication_name: '',
    medication_nda_ndc: '',
    diagnosis_code: '',
    diagnosis_description: '',
    clinical_notes: '',
    is_urgent: false,
    step_therapy_drugs_tried: '',
    admission_date: '',
    functional_status: '',
    drug_trials: [],
  });

  const steps = STEPS_BY_TYPE[caseType];

  function update<K extends keyof FormData>(field: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  function addDrugTrial() {
    setFormData((prev) => ({
      ...prev,
      drug_trials: [
        ...prev.drug_trials,
        { drug_name: '', reason_discontinued: '', was_ineffective: false, caused_adverse_reaction: false, contraindicated: false },
      ],
    }));
  }

  function updateDrugTrial(index: number, field: keyof DrugTrial, value: string | boolean) {
    setFormData((prev) => {
      const updated = [...prev.drug_trials];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, drug_trials: updated };
    });
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      // Step 1: create the case record
      const caseRes = await fetch('/api/prior-auth/cases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_type: caseType, ...formData }),
      });
      if (!caseRes.ok) throw new Error('Failed to create case');
      const { case: newCase } = await caseRes.json();

      // Step 2: generate the AI document
      const genRes = await fetch('/api/prior-auth/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ case_id: newCase.id, case_type: caseType, ...formData }),
      });
      if (!genRes.ok) throw new Error('Document generation failed');

      router.push(`/prior-auth/${newCase.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-[#1C2B2D] placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#6B8F71]';
  const labelClass = 'mb-1.5 block text-xs font-medium text-slate-600';
  const fieldGroupClass = 'space-y-4';

  const isFinalStep =
    (step === steps.length - 1);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      {/* Back button */}
      <button
        onClick={() =>
          step === 0 ? router.push('/prior-auth') : setStep((s) => s - 1)
        }
        className="mb-6 flex items-center gap-1 text-sm text-slate-500 transition-colors hover:text-[#1C2B2D]"
      >
        <ChevronLeft className="h-4 w-4" />
        {step === 0 ? 'Back to Dashboard' : 'Back'}
      </button>

      {/* Step indicator */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
        {steps.map((label, i) => (
          <div key={i} className="flex shrink-0 items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                i < step
                  ? 'bg-[#6B8F71] text-white'
                  : i === step
                  ? 'bg-[#1C2B2D] text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span
              className={`text-xs transition-colors ${
                i === step ? 'font-medium text-[#1C2B2D]' : 'text-slate-400'
              }`}
            >
              {label}
            </span>
            {i < steps.length - 1 && <div className="h-px w-6 shrink-0 bg-slate-200" />}
          </div>
        ))}
      </div>

      <Card className="border border-slate-200 bg-white p-6">
        {/* ── Step 0: Case Type ── */}
        {step === 0 && (
          <div>
            <h2 className="font-display mb-2 text-xl font-semibold text-[#1C2B2D]">
              Select Case Type
            </h2>
            <p className="mb-6 text-sm text-slate-500">
              What kind of authorization do you need to generate?
            </p>
            <div className="space-y-3">
              {(
                [
                  ['prior_auth',    FileText,  'Prior Authorization Request',        "New prescription requiring pre-approval, or a denied medication needing a fresh request"],
                  ['step_therapy',  Shield,    'Step Therapy Exception',             "\"Have you tried other meds?\" — Assert your patient's legal right to skip step therapy based on prior drug failures"],
                  ['continued_stay', BedDouble, 'Continued Stay / Medical Necessity', 'Justify continued inpatient, SNF, group home, or residential care when the insurer wants to discharge'],
                ] as const
              ).map(([type, Icon, label, desc]) => (
                <button
                  key={type}
                  onClick={() => { setCaseType(type); setStep(1); }}
                  className={`w-full rounded-xl border-2 p-4 text-left transition-all ${
                    caseType === type
                      ? 'border-[#6B8F71] bg-[#6B8F71]/5'
                      : 'border-slate-200 bg-white hover:border-[#6B8F71]/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      className={`mt-0.5 h-5 w-5 shrink-0 ${
                        caseType === type ? 'text-[#6B8F71]' : 'text-slate-400'
                      }`}
                    />
                    <div>
                      <div className="mb-0.5 text-sm font-semibold text-[#1C2B2D]">{label}</div>
                      <div className="text-xs leading-relaxed text-slate-500">{desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Step 1: Facility & Patient ── */}
        {step === 1 && (
          <div>
            <h2 className="font-display mb-2 text-xl font-semibold text-[#1C2B2D]">
              Facility & Patient
            </h2>
            <p className="mb-6 text-sm text-slate-500">
              Use a non-identifying reference for the patient (room number, initials, or internal
              ID). No PHI stored.
            </p>
            <div className={fieldGroupClass}>
              <div>
                <label className={labelClass}>Patient Identifier (non-PHI) *</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Room 14B, Patient A.J., or internal ID"
                  value={formData.patient_identifier}
                  onChange={(e) => update('patient_identifier', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Facility Name *</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Sunrise Skilled Nursing Center"
                  value={formData.facility_name}
                  onChange={(e) => update('facility_name', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Facility NPI</label>
                  <input
                    className={inputClass}
                    placeholder="10-digit NPI"
                    value={formData.facility_npi}
                    onChange={(e) => update('facility_npi', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Facility State *</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. PA, NJ, NY"
                    value={formData.facility_state}
                    maxLength={2}
                    onChange={(e) => update('facility_state', e.target.value.toUpperCase())}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Facility Type</label>
                <select
                  className={inputClass}
                  value={formData.facility_type}
                  onChange={(e) => update('facility_type', e.target.value)}
                >
                  <option>Skilled Nursing Facility</option>
                  <option>Group Home / Residential Care</option>
                  <option>Adult Day Program</option>
                  <option>Inpatient Rehabilitation Facility</option>
                  <option>Long-Term Acute Care Hospital</option>
                  <option>Assisted Living Facility</option>
                  <option>Independent Living</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Prescribing Physician</label>
                <input
                  className={inputClass}
                  placeholder="Dr. Jane Smith, MD"
                  value={formData.prescribing_physician}
                  onChange={(e) => update('prescribing_physician', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Insurance ── */}
        {step === 2 && (
          <div>
            <h2 className="font-display mb-2 text-xl font-semibold text-[#1C2B2D]">
              Insurance Information
            </h2>
            <p className="mb-6 text-sm text-slate-500">
              Enter the payer details from the denial letter or coverage card.
            </p>
            <div className={fieldGroupClass}>
              <div>
                <label className={labelClass}>Insurance Company / Payer Name *</label>
                <input
                  className={inputClass}
                  placeholder="e.g. UnitedHealthcare, Aetna, Humana"
                  value={formData.payer_name}
                  onChange={(e) => update('payer_name', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Plan Name</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Medicare Advantage HMO, Medicaid MCO"
                  value={formData.plan_name}
                  onChange={(e) => update('plan_name', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Payer ID / BIN</label>
                  <input
                    className={inputClass}
                    placeholder="Payer ID from EOB"
                    value={formData.payer_id}
                    onChange={(e) => update('payer_id', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Member ID (last 4 only)</label>
                  <input
                    className={inputClass}
                    placeholder="xxxx"
                    maxLength={4}
                    value={formData.member_id_masked}
                    onChange={(e) => update('member_id_masked', e.target.value)}
                  />
                </div>
              </div>
              {caseType === 'continued_stay' && (
                <div>
                  <label className={labelClass}>Existing Authorization Number</label>
                  <input
                    className={inputClass}
                    placeholder="Current auth # being extended"
                    value={formData.existing_auth_number}
                    onChange={(e) => update('existing_auth_number', e.target.value)}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Step 3: Medication & Diagnosis (prior_auth / step_therapy) ── */}
        {step === 3 && caseType !== 'continued_stay' && (
          <div>
            <h2 className="font-display mb-2 text-xl font-semibold text-[#1C2B2D]">
              Medication & Diagnosis
            </h2>
            <div className={fieldGroupClass}>
              <div>
                <label className={labelClass}>Medication Name *</label>
                <input
                  className={inputClass}
                  placeholder="e.g. Risperidone 1mg, Keytruda 200mg"
                  value={formData.medication_name}
                  onChange={(e) => update('medication_name', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>NDC / NDA Number</label>
                <input
                  className={inputClass}
                  placeholder="Optional — from prescription label"
                  value={formData.medication_nda_ndc}
                  onChange={(e) => update('medication_nda_ndc', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>ICD-10 Code *</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. F20.9, C34.10"
                    value={formData.diagnosis_code}
                    onChange={(e) => update('diagnosis_code', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Diagnosis Description *</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Schizophrenia, Lung Cancer"
                    value={formData.diagnosis_description}
                    onChange={(e) => update('diagnosis_description', e.target.value)}
                  />
                </div>
              </div>

              {/* Step therapy: previously tried drugs */}
              {caseType === 'step_therapy' && (
                <div>
                  <h3 className="mb-3 mt-2 text-sm font-semibold text-[#1C2B2D]">
                    Previously Tried Medications
                  </h3>
                  <p className="mb-3 text-xs text-slate-500">
                    Add each drug the patient already tried. This is your step therapy evidence.
                  </p>
                  {formData.drug_trials.map((trial, i) => (
                    <div
                      key={i}
                      className="mb-3 rounded-lg border border-slate-200 bg-slate-50 p-4"
                    >
                      <input
                        className={`${inputClass} mb-2`}
                        placeholder={`Drug #${i + 1} name (e.g. Haloperidol)`}
                        value={trial.drug_name}
                        onChange={(e) => updateDrugTrial(i, 'drug_name', e.target.value)}
                      />
                      <input
                        className={`${inputClass} mb-2`}
                        placeholder="Reason discontinued (e.g. ineffective after 4 weeks, caused tardive dyskinesia)"
                        value={trial.reason_discontinued}
                        onChange={(e) =>
                          updateDrugTrial(i, 'reason_discontinued', e.target.value)
                        }
                      />
                      <div className="flex flex-wrap gap-3">
                        {(
                          [
                            ['was_ineffective',        'Clinically ineffective'],
                            ['caused_adverse_reaction', 'Adverse reaction'],
                            ['contraindicated',         'Contraindicated'],
                          ] as const
                        ).map(([field, label]) => (
                          <label
                            key={field}
                            className="flex cursor-pointer items-center gap-1.5 text-xs text-slate-600"
                          >
                            <input
                              type="checkbox"
                              checked={trial[field]}
                              onChange={(e) => updateDrugTrial(i, field, e.target.checked)}
                              className="rounded border-slate-300 text-[#6B8F71] focus:ring-[#6B8F71]"
                            />
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addDrugTrial}
                    className="text-xs font-medium text-[#6B8F71] transition-colors hover:text-[#1C2B2D]"
                  >
                    + Add another medication
                  </button>
                </div>
              )}

              <div>
                <label className={labelClass}>Clinical Notes / Additional Context</label>
                <textarea
                  className={`${inputClass} h-24 resize-none`}
                  placeholder="Any additional clinical context for the authorization request..."
                  value={formData.clinical_notes}
                  onChange={(e) => update('clinical_notes', e.target.value)}
                />
              </div>
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.is_urgent}
                  onChange={(e) => update('is_urgent', e.target.checked)}
                  className="rounded border-slate-300 text-[#6B8F71] focus:ring-[#6B8F71]"
                />
                <span className="text-sm text-slate-600">
                  This is an urgent request (24–72 hour review required)
                </span>
              </label>
            </div>
          </div>
        )}

        {/* ── Step 3: Diagnosis & Status (continued_stay) ── */}
        {step === 3 && caseType === 'continued_stay' && (
          <div>
            <h2 className="font-display mb-2 text-xl font-semibold text-[#1C2B2D]">
              Diagnosis & Current Status
            </h2>
            <div className={fieldGroupClass}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>ICD-10 Code *</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. I63.9"
                    value={formData.diagnosis_code}
                    onChange={(e) => update('diagnosis_code', e.target.value)}
                  />
                </div>
                <div>
                  <label className={labelClass}>Diagnosis Description *</label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Ischemic stroke"
                    value={formData.diagnosis_description}
                    onChange={(e) => update('diagnosis_description', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>Admission Date</label>
                <input
                  type="date"
                  className={inputClass}
                  value={formData.admission_date}
                  onChange={(e) => update('admission_date', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Current Functional Status / Care Goals</label>
                <textarea
                  className={`${inputClass} h-24 resize-none`}
                  placeholder="Describe current ADL status, rehabilitation progress, therapy goals, and why the patient has not yet met discharge criteria..."
                  value={formData.functional_status}
                  onChange={(e) => update('functional_status', e.target.value)}
                />
              </div>
              <div>
                <label className={labelClass}>Clinical Notes / Discharge Barriers</label>
                <textarea
                  className={`${inputClass} h-20 resize-none`}
                  placeholder="What clinical barriers prevent safe discharge at this time? (e.g. wound care, IV medications, fall risk, 24-hour supervision needed)"
                  value={formData.clinical_notes}
                  onChange={(e) => update('clinical_notes', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: State & Law (step_therapy only) ── */}
        {step === 4 && caseType === 'step_therapy' && (
          <div>
            <h2 className="font-display mb-2 text-xl font-semibold text-[#1C2B2D]">
              State Law Selection
            </h2>
            <p className="mb-6 text-sm text-slate-500">
              48 states have step therapy reform laws. OncoKind will automatically cite the correct
              statute for your facility state.
            </p>
            <div className={fieldGroupClass}>
              <div className="rounded-lg border border-[#6B8F71]/20 bg-[#6B8F71]/10 p-4">
                <div className="mb-1 text-xs font-medium text-[#6B8F71]">
                  Auto-detected based on facility state:{' '}
                  {formData.facility_state || 'Not set'}
                </div>
                <div className="text-xs leading-relaxed text-slate-600">
                  {formData.facility_state
                    ? STATE_LAW_LABELS[formData.facility_state] ?? 'Federal CMS Step Therapy Guidance (CMS-4182-F)'
                    : 'Set your facility state in Step 1 for automatic law detection'}
                </div>
              </div>
              <div>
                <label className={labelClass}>Additional Legal Notes (optional)</label>
                <textarea
                  className={`${inputClass} h-20 resize-none`}
                  placeholder="Any additional legal context or prior auth tracking numbers from the original denial..."
                  value={formData.step_therapy_drugs_tried}
                  onChange={(e) => update('step_therapy_drugs_tried', e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Final Review Step ── */}
        {isFinalStep && (
          <div>
            <h2 className="font-display mb-2 text-xl font-semibold text-[#1C2B2D]">
              Review & Generate
            </h2>
            <p className="mb-6 text-sm text-slate-500">
              Review the details below and click Generate. The AI will produce a complete,
              ready-to-submit document.
            </p>
            <div className="mb-6 space-y-2">
              {(
                [
                  ['Case Type',   { prior_auth: 'Prior Authorization', step_therapy: 'Step Therapy Exception', continued_stay: 'Continued Stay Defense' }[caseType]],
                  ['Patient Ref', formData.patient_identifier || '—'],
                  ['Facility',    formData.facility_name || '—'],
                  ['State',       formData.facility_state || '—'],
                  ['Payer',       formData.payer_name || '—'],
                  ['Medication',  formData.medication_name || '—'],
                  ['Diagnosis',   `${formData.diagnosis_code} ${formData.diagnosis_description}`.trim() || '—'],
                  ['Urgent',      formData.is_urgent ? 'Yes — expedited review' : 'No'],
                ] as [string, string][]
              ).map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-slate-100 py-2 text-sm"
                >
                  <span className="text-slate-500">{label}</span>
                  <span className="max-w-xs truncate text-right font-medium text-[#1C2B2D]">
                    {value}
                  </span>
                </div>
              ))}
            </div>
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-xs text-amber-700">
                <strong>Important:</strong> The generated document is a professional starting
                point. Review all content, fill in any bracketed placeholders, and have the
                appropriate licensed professional sign before submission. This is AI-assisted
                drafting, not legal or medical advice.
              </p>
            </div>
            {error && <div className="mb-3 text-xs text-red-500">{error}</div>}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="text-sm text-slate-500 transition-colors hover:text-[#1C2B2D] disabled:opacity-30"
          >
            ← Previous
          </button>
          {!isFinalStep ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              className="bg-[#1C2B2D] px-6 text-white hover:bg-[#2d4042]"
              disabled={step === 0 && !caseType}
            >
              Continue <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              className="bg-[#6B8F71] px-6 text-white hover:bg-[#5a7a60]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating&hellip;
                </>
              ) : (
                'Generate Document →'
              )}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
