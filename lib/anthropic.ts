import Anthropic from '@anthropic-ai/sdk';

export const ANTHROPIC_MODELS = {
  heavy: 'claude-3-5-sonnet-latest',
  light: 'claude-haiku-4-5',
} as const;

type CacheTtl = '5m' | '1h';

type CachedSystemBlock = {
  text: string;
  ttl?: CacheTtl;
};

export function createAnthropicClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }

  return new Anthropic({ apiKey });
}

export function buildCachedSystemBlocks(blocks: CachedSystemBlock[]) {
  return blocks.map((block, index) => ({
    type: 'text' as const,
    text: block.text,
    ...(index === blocks.length - 1
      ? {
          cache_control: {
            type: 'ephemeral' as const,
            ttl: block.ttl ?? '1h',
          },
        }
      : {}),
  })) as Anthropic.TextBlockParam[];
}

export function asAnthropicRequest(request: unknown) {
  return request as Anthropic.MessageCreateParamsNonStreaming;
}

export function getAnthropicErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return 'Unknown Anthropic error';
}

export function isAnthropicRateLimit(error: unknown) {
  if (!error || typeof error !== 'object') return false;
  const maybeError = error as { status?: number; message?: string };
  return (
    maybeError.status === 429 ||
    maybeError.status === 529 ||
    maybeError.message?.toLowerCase().includes('rate limit') === true ||
    maybeError.message?.toLowerCase().includes('too many requests') === true
  );
}

export function isAnthropicLowBalance(error: unknown) {
  const message = getAnthropicErrorMessage(error).toLowerCase();
  return (
    message.includes('credit balance is too low') ||
    message.includes('purchase credits') ||
    message.includes('plans & billing') ||
    message.includes('billing')
  );
}

export function isAnthropicHighDemand(error: unknown) {
  const message = getAnthropicErrorMessage(error).toLowerCase();
  return (
    isAnthropicRateLimit(error) ||
    message.includes('overloaded') ||
    message.includes('high demand') ||
    message.includes('temporarily unavailable') ||
    message.includes('capacity')
  );
}

export function getAnthropicMaintenanceMessage(error: unknown) {
  if (isAnthropicLowBalance(error)) {
    return 'OncoKind AI is temporarily in maintenance. Please try again shortly.';
  }

  if (isAnthropicHighDemand(error)) {
    return 'OncoKind AI is experiencing high demand right now. Please try again in a few minutes.';
  }

  return 'OncoKind AI is temporarily unavailable. Please try again shortly.';
}
