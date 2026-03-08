import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const NAVIGATOR_PROMPT = `You are a calm, empathetic AI Care Navigator for families navigating cancer care. Your role is to help caregivers:
- Understand diagnosis and next steps
- Prepare for oncology appointments
- Ask better questions to doctors
- Feel supported, not overwhelmed

Rules: No survival statistics. No fear-based language. Emphasize preparation and questions. Encourage oncologist discussion. Be concise (2-4 sentences typically).`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const question = (body.question as string)?.trim();
    const topic = (body.topic as string)?.trim();

    if (question) {
      const key = process.env.ANTHROPIC_API_KEY;
      if (key) {
        const anthropic = new Anthropic({ apiKey: key });
        const message = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 512,
          messages: [
            { role: 'user', content: `${NAVIGATOR_PROMPT}\n\nCaregiver question: ${question}` },
          ],
        });
        const textBlock = message.content.find((b) => b.type === 'text');
        const answer = textBlock && 'text' in textBlock ? textBlock.text : '';
        return NextResponse.json({ answer: answer || 'I couldn’t generate a response. Please try again.' });
      }
      return NextResponse.json({
        answer: 'AI support is not configured. Please try again later.',
      });
    }

    {
      const key = process.env.ANTHROPIC_API_KEY;
      const resolvedTopic = topic || 'cancer care';
      if (key) {
        const anthropic = new Anthropic({ apiKey: key });
        const message = await anthropic.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 256,
          messages: [
            {
              role: 'user',
              content: `Generate exactly 3 short questions a caregiver could ask an oncologist about: "${resolvedTopic}". Return only a JSON array of 3 strings, no other text.`,
            },
          ],
        });
        const textBlock = message.content.find((b) => b.type === 'text');
        const text = textBlock && 'text' in textBlock ? textBlock.text : '';
        const parsed = JSON.parse(text.replace(/```json\s?/g, '').replace(/```/g, '').trim()) as string[];
        if (Array.isArray(parsed)) {
          return NextResponse.json({ questions: parsed.slice(0, 3) });
        }
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
