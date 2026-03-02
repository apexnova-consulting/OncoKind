import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const topic = (body.topic as string)?.trim() || 'cancer care';
    const key = process.env.ANTHROPIC_API_KEY;
    if (key) {
      const anthropic = new Anthropic({ apiKey: key });
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 256,
        messages: [
          {
            role: 'user',
            content: `Generate exactly 3 short questions a caregiver could ask an oncologist about: "${topic}". Return only a JSON array of 3 strings, no other text.`,
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
