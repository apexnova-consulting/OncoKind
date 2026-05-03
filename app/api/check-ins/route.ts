import { NextRequest, NextResponse } from 'next/server';
import {
  ANTHROPIC_MODELS,
  asAnthropicRequest,
  createAnthropicClient,
  getAnthropicMaintenanceMessage,
} from '@/lib/anthropic';
import { preparednessLabel } from '@/lib/check-ins';
import { createServerSupabaseClient } from '@/lib/supabase-server';

async function explainFollowUpQuestion(question: string) {
  try {
    const anthropic = createAnthropicClient();
    const response = await anthropic.messages.create(
      asAnthropicRequest({
        model: ANTHROPIC_MODELS.light,
        max_tokens: 220,
        system:
          'You are OncoKind. Explain unfamiliar oncology language in plain English for a caregiver. Be warm, clear, and concise. Do not diagnose. Remind the user to confirm details with their care team.',
        messages: [
          {
            role: 'user',
            content: `Please explain this doctor comment in plain English for a caregiver:\n\n${question}`,
          },
        ],
      })
    );

    const text = response.content
      .map((block) => ('text' in block ? block.text : ''))
      .join('\n')
      .trim();

    return text || null;
  } catch (error) {
    return getAnthropicMaintenanceMessage(error);
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const appointmentId = typeof body?.appointmentId === 'string' ? body.appointmentId : '';
  const preparednessScore = Number(body?.preparednessScore);
  const prepSheetHelped = typeof body?.prepSheetHelped === 'string' ? body.prepSheetHelped : '';
  const followUpQuestion = typeof body?.followUpQuestion === 'string' ? body.followUpQuestion.trim() : '';
  const discussedTrials = typeof body?.discussedTrials === 'string' ? body.discussedTrials : null;

  if (!appointmentId || !Number.isInteger(preparednessScore) || preparednessScore < 1 || preparednessScore > 4) {
    return NextResponse.json({ error: 'Please answer the required questions.' }, { status: 400 });
  }

  if (!['yes', 'somewhat', 'no', 'not_used'].includes(prepSheetHelped)) {
    return NextResponse.json({ error: 'Please answer the required questions.' }, { status: 400 });
  }

  const { data: appointment } = await supabase
    .from('prep_sheet_appointments')
    .select('id, appointment_at, report_title')
    .eq('id', appointmentId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (!appointment) {
    return NextResponse.json({ error: 'We could not find that appointment.' }, { status: 404 });
  }

  const followUpExplanation = followUpQuestion ? await explainFollowUpQuestion(followUpQuestion) : null;

  const { error } = await supabase.from('appointment_check_ins').insert({
    user_id: user.id,
    appointment_id: appointment.id,
    prep_sheet_id: appointment.id,
    preparedness_score: preparednessScore,
    prep_sheet_helped: prepSheetHelped,
    follow_up_question: followUpQuestion || null,
    follow_up_explanation: followUpExplanation,
    discussed_trials: discussedTrials,
  });

  if (error) {
    return NextResponse.json({ error: 'Unable to save your check-in right now.' }, { status: 500 });
  }

  await supabase.from('care_timeline_entries').insert({
    user_id: user.id,
    milestone_type: 'follow_up_appointment',
    title: 'Appointment Check-In Complete',
    notes: `${preparednessLabel(preparednessScore)} · Prep sheet ${
      prepSheetHelped === 'yes'
        ? 'helped'
        : prepSheetHelped === 'somewhat'
          ? 'helped somewhat'
          : prepSheetHelped === 'no'
            ? 'did not help'
            : 'was not used'
    }.`,
    prep_sheet_link: `/journey/check-in/${appointment.id}`,
    occurred_at: new Date().toISOString(),
  });

  return NextResponse.json({
    ok: true,
    followUpExplanation,
    successMessage:
      "Thank you for sharing. Your response helps OncoKind get better for every family that comes after you. We've added this to your care timeline.",
  });
}
