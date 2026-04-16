import { NextRequest, NextResponse } from 'next/server';
import {
  ANTHROPIC_MODELS,
  asAnthropicRequest,
  createAnthropicClient,
  getAnthropicErrorMessage,
} from '@/lib/anthropic';
import { encryptJson } from '@/lib/encryption';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export const runtime = 'nodejs';
export const maxDuration = 60;

async function probeAnthropic() {
  const anthropic = createAnthropicClient();
  const request = asAnthropicRequest({
    model: ANTHROPIC_MODELS.light,
    max_tokens: 8,
    messages: [{ role: 'user', content: 'Reply with OK' }],
  });
  const response = await anthropic.messages.create(request);

  const textBlock = response.content.find((block) => block.type === 'text');
  return textBlock && 'text' in textBlock ? textBlock.text : '';
}

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const probeAnthropicRequested = request.nextUrl.searchParams.get('probe') === 'anthropic';

  let encryptionOk = false;
  let encryptionError: string | null = null;
  try {
    encryptJson({ ok: true, checkedAt: new Date().toISOString() });
    encryptionOk = true;
  } catch (error) {
    encryptionError = getAnthropicErrorMessage(error);
  }

  let anthropicProbe:
    | {
        attempted: false;
        ok: false;
        error: null;
        responsePreview: null;
      }
    | {
        attempted: true;
        ok: boolean;
        error: string | null;
        responsePreview: string | null;
      } = {
    attempted: false,
    ok: false,
    error: null,
    responsePreview: null,
  };

  if (probeAnthropicRequested) {
    try {
      const responsePreview = await probeAnthropic();
      anthropicProbe = {
        attempted: true,
        ok: true,
        error: null,
        responsePreview: responsePreview.slice(0, 32),
      };
    } catch (error) {
      anthropicProbe = {
        attempted: true,
        ok: false,
        error: getAnthropicErrorMessage(error),
        responsePreview: null,
      };
    }
  }

  return NextResponse.json({
    deployment: {
      nodeEnv: process.env.NODE_ENV ?? null,
      vercelEnv: process.env.VERCEL_ENV ?? null,
      vercelUrl: process.env.VERCEL_URL ?? null,
    },
    env: {
      anthropicConfigured: Boolean(process.env.ANTHROPIC_API_KEY),
      encryptionConfigured: Boolean(process.env.ENCRYPTION_KEY),
      supabaseUrlConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
      supabaseAnonConfigured: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    },
    encryptionProbe: {
      ok: encryptionOk,
      error: encryptionError,
    },
    anthropicProbe,
    checkedAt: new Date().toISOString(),
    userId: user.id,
  });
}
