import {
  ANTHROPIC_MODELS,
  createAnthropicClient,
  getAnthropicMaintenanceMessage,
} from '@/lib/anthropic';
import { LLM_DASH_RULE } from '@/lib/typography';
import { getPrompt, type PromptTask } from '@/lib/agents/prompts';

export type ModelCompleteInput = {
  task: PromptTask;
  userText: string;
  maxTokens?: number;
};

export type ModelCompleteResult = {
  text: string;
  provider: string;
  model: string;
  promptId: string;
  promptVersion: string;
  inputTokens: number;
  outputTokens: number;
};

export interface ModelProvider {
  complete(input: ModelCompleteInput): Promise<ModelCompleteResult>;
}

const TASK_MODELS: Record<PromptTask, string> = {
  extraction: process.env.AGENT_EXTRACTION_MODEL || ANTHROPIC_MODELS.light,
  rewording: process.env.AGENT_REWORDING_MODEL || ANTHROPIC_MODELS.heavy,
};

class AnthropicModelProvider implements ModelProvider {
  async complete(input: ModelCompleteInput): Promise<ModelCompleteResult> {
    const prompt = getPrompt(input.task);
    const client = createAnthropicClient();
    const model = TASK_MODELS[input.task];
    const message = await client.messages.create({
      model,
      max_tokens: input.maxTokens ?? 1200,
      system: `${prompt.system}\n\n${LLM_DASH_RULE}\nProviders must not train on this data.`,
      messages: [{ role: 'user', content: input.userText }],
    });
    const text = message.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('\n')
      .trim();
    return {
      text,
      provider: 'anthropic',
      model,
      promptId: prompt.id,
      promptVersion: prompt.version,
      inputTokens: message.usage.input_tokens,
      outputTokens: message.usage.output_tokens,
    };
  }
}

export function getModelProvider(): ModelProvider {
  return new AnthropicModelProvider();
}

export function modelUnavailableMessage(error: unknown): string {
  return getAnthropicMaintenanceMessage(error);
}
