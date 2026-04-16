import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { normalizeLanguage } from '@/lib/i18n';

export const runtime = 'nodejs';
export const maxDuration = 120;

const NAVIGATOR_PROMPT = `You are a calm, empathetic AI Care Navigator for families navigating cancer care. Your role is to help caregivers:
- Understand diagnosis and next steps
- Prepare for oncology appointments
- Ask better questions to doctors
- Feel supported, not overwhelmed

Rules: No survival statistics. No fear-based language. Emphasize preparation and questions. Encourage oncologist discussion. Be concise (2-4 sentences typically).`;

function buildContextBlock(context: unknown) {
  if (!context || typeof context !== 'object') return '';
  const info = context as {
    diagnosis?: string;
    biomarkers?: string[];
    treatmentOptions?: string[];
    recommendedActions?: string[];
  };

  const lines = [
    info.diagnosis ? `Diagnosis: ${info.diagnosis}` : null,
    info.biomarkers?.length ? `Biomarkers: ${info.biomarkers.join(', ')}` : null,
    info.treatmentOptions?.length ? `Treatment options: ${info.treatmentOptions.join(', ')}` : null,
    info.recommendedActions?.length ? `Recommended actions: ${info.recommendedActions.join(', ')}` : null,
  ].filter(Boolean);

  return lines.length > 0 ? `\n\nPatient context:\n${lines.join('\n')}` : '';
}

async function createAnthropicMessage(prompt: string, maxTokens: number) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  const anthropic = new Anthropic({ apiKey: key });
  return anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  });
}

async function createAnthropicMessageWithTimeout(prompt: string, maxTokens: number) {
  return Promise.race([
    createAnthropicMessage(prompt, maxTokens),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI navigator timed out')), 20000)
    ),
  ]);
}

export async function POST(request: NextRequest) {
  try {
    const language = normalizeLanguage(request.cookies.get('oncokind_lang')?.value);
    const languageInstruction =
      language === 'es'
        ? 'Respond in Spanish.'
        : language === 'zh-CN'
          ? 'Respond in Simplified Chinese.'
          : language === 'tl'
            ? 'Respond in Tagalog.'
            : 'Respond in English.';

    const body = await request.json().catch(() => ({}));
    const question = (body.question as string)?.trim();
    const topic = (body.topic as string)?.trim();
    const contextBlock = buildContextBlock(body.contextualInfo);

    if (question) {
      try {
        const message = await createAnthropicMessageWithTimeout(
          `${NAVIGATOR_PROMPT}\n${languageInstruction}${contextBlock}\n\nCaregiver question: ${question}`,
          512
        );
        const textBlock = message.content.find((b) => b.type === 'text');
        const answer = textBlock && 'text' in textBlock ? textBlock.text : '';
        return NextResponse.json({ answer: answer || 'I couldn’t generate a response. Please try again.' });
      } catch (error) {
        console.error('[ai-navigator-chat]', error);
        return NextResponse.json({
          answer:
            'I’m having trouble reaching the care navigator model right now. Please try again in a moment.',
        });
      }
    }

    {
      const resolvedTopic = topic || 'cancer care';
      try {
        const message = await createAnthropicMessageWithTimeout(
          `${languageInstruction}${contextBlock} Generate exactly 3 short questions a caregiver could ask an oncologist about: "${resolvedTopic}". Return only a JSON array of 3 strings, no other text.`,
          256
        );
        const textBlock = message.content.find((b) => b.type === 'text');
        const text = textBlock && 'text' in textBlock ? textBlock.text : '';
        const parsed = JSON.parse(text.replace(/```json\s?/g, '').replace(/```/g, '').trim()) as string[];
        if (Array.isArray(parsed)) {
          return NextResponse.json({ questions: parsed.slice(0, 3) });
        }
      } catch (error) {
        console.error('[ai-navigator-questions]', error);
      }
    }
  } catch {
    // fallback below
  }
  return NextResponse.json({
    questions: [
      'What does this result mean for my treatment options?',
      'What are the next steps you recommend?',
      'Are there clinical trials I should consider?',
    ],
  });
}
