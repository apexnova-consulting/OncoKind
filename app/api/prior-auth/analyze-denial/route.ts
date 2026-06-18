import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createAnthropicClient, ANTHROPIC_MODELS } from '@/lib/anthropic';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const maxDuration = 30;

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

  const { denial_text, case_id } = await request.json();
  if (!denial_text || denial_text.trim().length < 20) {
    return NextResponse.json(
      { error: 'Denial text required (minimum 20 characters)' },
      { status: 400 }
    );
  }

  const anthropic = createAnthropicClient();
  const response = await anthropic.messages.create({
    model: ANTHROPIC_MODELS.heavy,
    max_tokens: 800,
    system:
      'You are a healthcare regulatory specialist. Analyze insurance denial letters clearly and professionally. Never include prognosis, mortality, or survival data in your responses.',
    messages: [
      {
        role: 'user',
        content: `Analyze this insurance denial letter and provide:
1. **Denial Reason** (1-2 sentences in plain English — what is the actual reason for denial?)
2. **Denial Code** (if present in the letter — e.g. "CO-97", "PR-96", "STEP-THERAPY")
3. **Appeal Basis** (what is the strongest legal/clinical ground to appeal this denial?)
4. **Urgency Level** (Standard / Expedited — should this be appealed as urgent?)
5. **Key Missing Information** (what clinical documentation, if any, would strengthen an appeal?)
6. **Recommended Next Step** (one clear action sentence)

DENIAL LETTER TEXT:
${denial_text.substring(0, 3000)}

Respond in structured plain English. Do not include any survival statistics, prognosis, or mortality data.`,
      },
    ],
  });

  const analysis = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('\n');

  // Optionally associate the analysis with a case
  if (case_id) {
    await supabase
      .from('prior_auth_cases')
      .update({ ai_denial_analysis: analysis, updated_at: new Date().toISOString() })
      .eq('id', case_id)
      .eq('user_id', user.id);
  }

  return NextResponse.json({ analysis });
}
