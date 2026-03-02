import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { scrubPII } from '@/lib/medical-utils';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'nodejs';
export const maxDuration = 60;

const CLARITY_PROMPT = `Act as a compassionate oncology navigator. Summarize this pathology report for a 11:30 PM kitchen-table caregiver. Focus on clarity, not jargon. Return a JSON object with: "summary" (plain-language 2–4 sentences), "keyFindings" (array of short strings), "suggestedQuestions" (array of 3 questions to ask the oncologist).`;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const filePath = body.filePath as string | undefined;
    if (!filePath) {
      return NextResponse.json(
        { error: 'Missing filePath (Supabase Storage path)' },
        { status: 400 }
      );
    }

    const { data: fileData, error: downloadError } = await supabase.storage
      .from('reports')
      .download(filePath);

    if (downloadError || !fileData) {
      return NextResponse.json(
        { error: 'Failed to download PDF from storage' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await fileData.arrayBuffer());
    const rawText = await extractTextFromPdf(buffer);
    if (!rawText?.trim()) {
      return NextResponse.json(
        { error: 'Could not extract text from PDF' },
        { status: 400 }
      );
    }

    const scrubbedText = scrubPII(rawText);
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `${CLARITY_PROMPT}\n\n---\n\n${scrubbedText.slice(0, 50000)}`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === 'text');
    const text = textBlock && 'text' in textBlock ? textBlock.text : '';
    let json: { summary?: string; keyFindings?: string[]; suggestedQuestions?: string[] } = {};
    try {
      const extracted = text.replace(/```json\s?/g, '').replace(/```\s?/g, '').trim();
      json = JSON.parse(extracted) as typeof json;
    } catch {
      json = { summary: text || 'Summary could not be parsed.', keyFindings: [], suggestedQuestions: [] };
    }

    const fileName = filePath.split('/').pop() ?? 'report.pdf';
    const { error: insertErr } = await supabase.from('medical_reports').insert({
      user_id: user.id,
      file_name: fileName,
      file_path: filePath,
      metadata: json,
      raw_extracted_text: null,
    });
    if (insertErr) console.error('Failed to save report:', insertErr);

    return NextResponse.json(json);
  } catch (err) {
    console.error('process-report error:', err);
    return NextResponse.json(
      { error: 'Processing failed. Please try again or use a different PDF.' },
      { status: 500 }
    );
  }
}

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = (await import('pdf-parse')).default;
    const data = await pdfParse(buffer);
    return typeof data?.text === 'string' ? data.text : '';
  } catch {
    return '';
  }
}
