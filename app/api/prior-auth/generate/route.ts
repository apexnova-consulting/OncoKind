import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import Anthropic from '@anthropic-ai/sdk';
import { createAnthropicClient, ANTHROPIC_MODELS } from '@/lib/anthropic';
import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const maxDuration = 60;

// State step therapy laws — top 15 states by SNF volume
// Source: State Step Therapy Reform Laws as of 2026
const STATE_STEP_THERAPY_LAWS: Record<string, string> = {
  CA: 'California Health & Safety Code §1367.206 requires health plans to grant step therapy exceptions when the required drug is contraindicated, previously ineffective, or likely to cause an adverse reaction.',
  TX: 'Texas Insurance Code Chapter 1369 Subchapter J requires insurers to establish a step therapy exception process within 72 hours for urgent requests.',
  FL: 'Florida Statute §627.42392 requires health insurers to grant step therapy exceptions when the required drug is contraindicated or clinically inappropriate.',
  NY: 'New York Insurance Law §3217-g requires step therapy exception decisions within 72 hours (24 hours for urgent cases) and permits exceptions for previously tried medications.',
  PA: 'Pennsylvania Act 2018-146 requires health plans to provide a step therapy exception process and decide within 72 hours (24 hours urgent).',
  IL: 'Illinois Public Act 100-0718 requires insurers to grant step therapy exceptions when the preferred drug is contraindicated, clinically ineffective, or will cause an adverse reaction.',
  OH: 'Ohio Revised Code §3923.85 mandates step therapy exception processes with 72-hour standard and 24-hour urgent review timelines.',
  GA: 'Georgia Code §33-24-59.22 requires health benefit plans to establish step therapy exception criteria including previous drug failure.',
  NC: 'North Carolina General Statute §58-51-37 requires step therapy exception processes with decisions within 3 business days.',
  MI: 'Michigan Public Act 162 of 2018 requires health insurers to grant step therapy exceptions for contraindication, previous failure, or adverse reaction risk.',
  NJ: 'New Jersey P.L. 2018, c. 116 requires step therapy exception processes with 72-hour standard review and 24-hour urgent review.',
  VA: 'Virginia Code §38.2-3407.15:3 requires health carriers to establish step therapy exception criteria and processes.',
  WA: 'Washington RCW 48.43.730 requires health plans to establish step therapy exception processes with expedited 24-hour urgent review.',
  AZ: 'Arizona Revised Statutes §20-2631 requires health insurers to provide step therapy exception processes including for previously tried medications.',
  MA: 'Massachusetts General Law c. 176O §14 requires health benefit plans to provide step therapy exceptions when the drug is contraindicated or previously failed.',
  DEFAULT:
    'Under federal and most state insurance regulations, step therapy exception requests may be filed when the required medication has previously been tried and failed, is medically contraindicated, or would cause clinically significant adverse reactions. CMS guidelines support exception rights for Medicare Advantage plans under 42 CFR §422.568.',
};

function getStateLaw(state: string): string {
  return STATE_STEP_THERAPY_LAWS[state?.toUpperCase()] ?? STATE_STEP_THERAPY_LAWS['DEFAULT'];
}

interface DrugTrial {
  drug_name: string;
  reason_discontinued: string;
  was_ineffective: boolean;
  caused_adverse_reaction: boolean;
  contraindicated: boolean;
}

function buildPriorAuthPrompt(data: Record<string, unknown>): string {
  return `You are a healthcare regulatory specialist generating a formal Prior Authorization Request letter on behalf of a care facility. Generate a complete, professional prior authorization request document.

FACILITY AND PATIENT INFORMATION:
- Facility: ${data.facility_name || '[Facility Name]'}
- Facility NPI: ${data.facility_npi || '[NPI]'}
- Patient Identifier: ${data.patient_identifier || '[Patient Reference]'} (use this reference only — do not add or infer PHI)
- Prescribing Physician: ${data.prescribing_physician || '[Physician Name]'}

INSURANCE INFORMATION:
- Payer: ${data.payer_name || '[Insurance Company]'}
- Plan: ${data.plan_name || '[Plan Name]'}
- Member ID (last 4): ${data.member_id_masked || '[xxxx]'}

MEDICATION REQUESTED:
- Drug Name: ${data.medication_name}
- NDC/NDA: ${data.medication_nda_ndc || 'See attached prescription'}
- ICD-10 Diagnosis: ${data.diagnosis_code} — ${data.diagnosis_description}

CLINICAL CONTEXT PROVIDED BY FACILITY:
${data.clinical_notes || 'Standard prior authorization request for the above medication and diagnosis.'}

Generate a complete prior authorization request letter with:
1. A formal header addressed to the payer's Prior Authorization Department
2. Patient/member identification section
3. Clinical justification paragraph explaining the medical necessity of this specific medication for this diagnosis
4. Statement of medical necessity citing standard clinical guidelines (e.g., CMS, relevant specialty society guidelines where applicable)
5. Request for expedited review if clinically urgent (flag this if ${data.is_urgent ? 'YES — EXPEDITED REVIEW REQUIRED' : 'standard review timeline is acceptable'})
6. Attestation statement for the prescribing physician to sign
7. Required attachments checklist

CRITICAL RULES:
- Use formal, regulatory language that insurance reviewers are trained to approve
- Do not include survival statistics, prognosis data, or fear-based language
- Do not invent clinical details not provided — use placeholder brackets [ ] for missing information
- End with: "This request is submitted in accordance with [Payer Name]'s prior authorization requirements and applicable state and federal regulations."
- Keep the document under 600 words, structured and scannable`;
}

function buildStepTherapyPrompt(data: Record<string, unknown>): string {
  const stateLaw = getStateLaw(data.facility_state as string);
  const drugTrials = (data.drug_trials as DrugTrial[]) || [];
  const drugTrialText =
    drugTrials.length > 0
      ? drugTrials
          .map((d, i) => {
            const reasons = [
              d.was_ineffective ? 'Clinically ineffective' : '',
              d.caused_adverse_reaction ? 'Caused adverse reaction' : '',
              d.contraindicated ? 'Contraindicated' : '',
            ]
              .filter(Boolean)
              .join(', ');
            return `${i + 1}. ${d.drug_name}: ${reasons || 'See notes'} — ${d.reason_discontinued}`;
          })
          .join('\n')
      : (data.step_therapy_drugs_tried as string) || 'See attached clinical documentation';

  return `You are a healthcare regulatory specialist generating a Step Therapy Exception Request letter on behalf of a care facility. This is a formal appeal of a step therapy (fail-first) requirement.

FACILITY AND PATIENT INFORMATION:
- Facility: ${data.facility_name || '[Facility Name]'}
- Facility NPI: ${data.facility_npi || '[NPI]'}
- Patient Identifier: ${data.patient_identifier || '[Patient Reference]'}
- Prescribing Physician: ${data.prescribing_physician || '[Physician Name]'}
- Facility State: ${data.facility_state || '[State]'}

INSURANCE INFORMATION:
- Payer: ${data.payer_name || '[Insurance Company]'}
- Plan: ${data.plan_name || '[Plan Name]'}
- Member ID (last 4): ${data.member_id_masked || '[xxxx]'}

REQUESTED MEDICATION (currently denied under step therapy):
- Drug Name: ${data.medication_name}
- ICD-10 Diagnosis: ${data.diagnosis_code} — ${data.diagnosis_description}

PREVIOUSLY TRIED MEDICATIONS (step therapy history):
${drugTrialText}

APPLICABLE STATE LAW:
${stateLaw}

Generate a complete step therapy exception request letter with:
1. Formal header citing the specific step therapy requirement being appealed
2. Exception basis section — clearly state which exception criteria apply (previous failure, contraindication, adverse reaction risk, clinical urgency)
3. Documentation of previously tried medications with outcomes as listed above
4. Clinical justification for why the requested medication is medically necessary despite the step therapy requirement
5. Legal rights citation using the state law provided above — quote it precisely and cite it by statute number
6. Specific request: "We request an exception to the step therapy requirement pursuant to [state law citation] and ask for a determination within [72 hours / 24 hours if urgent]."
7. Attestation for prescribing physician signature
8. Required supporting documentation checklist

CRITICAL RULES:
- Cite the state law statute number explicitly
- Use assertive, rights-based language — this is a legal right, not a request for a favor
- Do not include survival statistics or prognosis data
- Reference CMS step therapy guidance (CMS-4182-F) for Medicare Advantage plans if applicable
- Use brackets [ ] for any information not provided`;
}

function buildContinuedStayPrompt(data: Record<string, unknown>): string {
  return `You are a healthcare regulatory specialist generating a Medical Necessity / Continued Stay Authorization letter for a care facility. This is a formal justification for continued inpatient, residential, or skilled nursing facility care.

FACILITY AND PATIENT INFORMATION:
- Facility: ${data.facility_name || '[Facility Name]'}
- Facility NPI: ${data.facility_npi || '[NPI]'}
- Facility Type: ${data.facility_type || 'Skilled Nursing Facility'}
- Patient Identifier: ${data.patient_identifier || '[Patient Reference]'}
- Treating Physician/Provider: ${data.prescribing_physician || '[Physician Name]'}
- Admission Date: ${data.admission_date || '[Admission Date]'}

INSURANCE / PAYER INFORMATION:
- Payer: ${data.payer_name || '[Insurance Company]'}
- Plan: ${data.plan_name || '[Plan Name]'}
- Authorization Number Being Extended: ${data.existing_auth_number || '[Auth Number]'}

PRIMARY DIAGNOSIS:
- ICD-10: ${data.diagnosis_code} — ${data.diagnosis_description}

CLINICAL JUSTIFICATION FOR CONTINUED STAY:
${data.clinical_notes || '[Clinical team to insert current functional status, goals, and why discharge is clinically contraindicated at this time]'}

FUNCTIONAL STATUS / GOALS:
${data.functional_status || '[Insert current ADL status, rehabilitation goals, and expected discharge timeline]'}

Generate a complete continued stay / medical necessity letter with:
1. Formal header referencing the existing authorization number and requesting extension
2. Summary of current clinical status and why the patient does not yet meet discharge criteria
3. Specific medical necessity criteria being met (reference InterQual or Milliman Care Guidelines language where applicable: "The patient currently meets criteria for [level of care] based on...")
4. Treatment goals and timeline: specific, measurable goals with target dates
5. Discharge planning status: what must occur before safe discharge is possible
6. Risk statement: clinical risks of premature discharge
7. Request for specific number of additional authorized days/weeks
8. Attending physician attestation block

CRITICAL RULES:
- Frame entirely around functional capability and care goals, not prognosis or survival
- Use InterQual/MCG-adjacent language ("meets criteria for skilled care," "requires 24-hour nursing supervision")
- Reference CMS Conditions of Participation for SNFs where applicable (42 CFR Part 483)
- Do not include mortality statistics or fear-based framing
- Keep tone clinical, objective, and professional`;
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  if (profile?.subscription_tier !== 'professional') {
    return NextResponse.json({ error: 'Professional tier required' }, { status: 403 });
  }

  const body = await request.json();
  const { case_id, case_type, ...caseData } = body;

  if (!case_id || !case_type) {
    return NextResponse.json({ error: 'case_id and case_type required' }, { status: 400 });
  }

  let prompt: string;
  switch (case_type) {
    case 'prior_auth':
      prompt = buildPriorAuthPrompt(caseData);
      break;
    case 'step_therapy':
      prompt = buildStepTherapyPrompt(caseData);
      break;
    case 'continued_stay':
      prompt = buildContinuedStayPrompt(caseData);
      break;
    default:
      return NextResponse.json({ error: 'Invalid case_type' }, { status: 400 });
  }

  try {
    const anthropic = createAnthropicClient();
    const response = await anthropic.messages.create({
      model: ANTHROPIC_MODELS.heavy,
      max_tokens: 2000,
      system: `You are a professional healthcare regulatory document specialist. You generate formal, legally-sound prior authorization and insurance appeal documents for healthcare facilities. Your outputs are used by licensed healthcare professionals and must be precise, professional, and citation-accurate. Never include survival statistics, prognosis data, or mortality figures in any document. Always use bracketed placeholders [ ] for information not provided to you.`,
      messages: [{ role: 'user', content: prompt }],
    });

    const generatedDocument = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('\n');

    // Hash for audit log — raw prompt and response content are never stored
    const promptHash = crypto.createHash('sha256').update(prompt).digest('hex');
    const responseHash = crypto.createHash('sha256').update(generatedDocument).digest('hex');

    // Write immutable audit log entry using service role
    const serviceClient = await createServiceRoleSupabaseClient();
    await serviceClient.from('ai_audit_log').insert({
      user_id: user.id,
      model: ANTHROPIC_MODELS.heavy,
      prompt_hash: promptHash,
      response_hash: responseHash,
      feature: `prior_auth_${case_type}`,
    });

    // Update the case record with the generated document and mark ready
    await supabase
      .from('prior_auth_cases')
      .update({
        ai_generated_document: generatedDocument,
        status: 'ready',
        updated_at: new Date().toISOString(),
        ...(case_type === 'step_therapy' && caseData.facility_state
          ? { state_law_citation: getStateLaw(caseData.facility_state as string) }
          : {}),
      })
      .eq('id', case_id)
      .eq('user_id', user.id);

    return NextResponse.json({ document: generatedDocument, case_id });
  } catch (error) {
    console.error('Prior auth generation error:', error);
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
