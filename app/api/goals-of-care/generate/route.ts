import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { createAnthropicClient, ANTHROPIC_MODELS, getAnthropicErrorMessage } from '@/lib/anthropic';
import { getPatientReport } from '@/lib/patient-reports';

export const runtime = 'nodejs';
export const maxDuration = 45;

const EMPATHY_FILTER_INSTRUCTION = `
You are generating goals-of-care conversation questions for an OncoKind caregiver.

CRITICAL EMPATHY FILTER RULES — these are non-negotiable:
- NEVER include survival statistics, mortality rates, 5-year survival figures, or any numeric prognosis data.
- NEVER use fear-based language (e.g. "dying", "terminal", "end-stage", "how long do I have").
- NEVER make deterministic or predictive statements about outcomes.
- ALWAYS frame questions around decisions, conversations, preferences, and support — never prognosis.
- ALWAYS use "your loved one" — never "the patient".
- Questions should feel like a knowledgeable, compassionate friend asking — not a clinical intake form.
- Every word must pass the Empathy Filter: replace fear with preparation, replace mortality with possibility and next steps.
`;

export async function POST() {
  if (process.env.NEXT_PUBLIC_GOALS_OF_CARE_ENABLED !== 'true') {
    return NextResponse.json({ error: 'Feature not enabled' }, { status: 403 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch latest report for context (optional — personalization)
  let cancerContext = 'No specific diagnosis on file.';
  try {
    const { data: reports } = await supabase
      .from('patient_reports')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (reports?.[0]?.id) {
      const report = await getPatientReport(reports[0].id, user.id);
      const parts = [
        report?.biomarkers?.cancer_type_inferred,
        report?.biomarkers?.tnm_stage ? `Stage ${report.biomarkers.tnm_stage}` : null,
        report?.biomarkers?.names?.slice(0, 3).join(', '),
      ].filter(Boolean);
      if (parts.length) cancerContext = parts.join(', ');
    }
  } catch {
    // proceed with generic questions
  }

  try {
    const client = createAnthropicClient();

    const prompt = `
${EMPATHY_FILTER_INSTRUCTION}

The caregiver's loved one has the following cancer context: ${cancerContext}

Generate a goals-of-care prep sheet with EXACTLY 4 sections.
Each section must have EXACTLY 3 questions.
Sections must cover: (1) Understanding the current picture, (2) Palliative and supportive care,
(3) Planning ahead together, (4) Practical next steps.

Tailor the questions to the cancer context when possible, but keep all questions
through the Empathy Filter — no statistics, no predictions, no fear language.

Respond ONLY with valid JSON in this exact structure:
[
  {
    "category": "Understanding the current picture",
    "questions": ["question 1", "question 2", "question 3"]
  },
  {
    "category": "Palliative and supportive care",
    "questions": ["question 1", "question 2", "question 3"]
  },
  {
    "category": "Planning ahead together",
    "questions": ["question 1", "question 2", "question 3"]
  },
  {
    "category": "Practical next steps",
    "questions": ["question 1", "question 2", "question 3"]
  }
]
`.trim();

    const response = await client.messages.create({
      model: ANTHROPIC_MODELS.light,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('Invalid AI response format');

    const questions = JSON.parse(jsonMatch[0]) as Array<{
      category: string;
      questions: string[];
    }>;

    // Validate structure
    if (!Array.isArray(questions) || questions.length !== 4) {
      throw new Error('Unexpected question structure');
    }

    return NextResponse.json({ questions });
  } catch (err) {
    console.error('[goals-of-care/generate]', getAnthropicErrorMessage(err));
    return NextResponse.json(
      { error: 'Could not generate personalized questions. Please use the default questions below.' },
      { status: 500 }
    );
  }
}
