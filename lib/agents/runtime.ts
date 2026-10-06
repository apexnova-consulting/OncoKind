export const AGENT_RUN_STATES = [
  'created',
  'redacting',
  'extracting',
  'evaluating',
  'awaiting_user',
  'approved',
  'executing',
  'completed',
  'failed',
  'cancelled',
] as const;

export type AgentRunState = (typeof AGENT_RUN_STATES)[number];
export type AgentKind = 'complete_the_picture' | 'access' | 'voice';

export const ALLOWED_TRANSITIONS: Record<AgentRunState, AgentRunState[]> = {
  created: ['redacting', 'cancelled', 'failed'],
  redacting: ['extracting', 'failed', 'cancelled'],
  extracting: ['evaluating', 'awaiting_user', 'failed', 'cancelled'],
  evaluating: ['awaiting_user', 'completed', 'failed', 'cancelled'],
  awaiting_user: ['approved', 'cancelled', 'failed'],
  approved: ['executing', 'cancelled', 'failed'],
  executing: ['completed', 'failed', 'cancelled'],
  completed: [],
  failed: [],
  cancelled: [],
};

export function canTransition(from: AgentRunState, to: AgentRunState): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function assertTransition(from: AgentRunState, to: AgentRunState): void {
  if (!canTransition(from, to)) {
    throw new Error(`Illegal agent run transition from ${from} to ${to}`);
  }
}

export type ToolName =
  | 'redact_document'
  | 'extract_report_fields'
  | 'evaluate_rules'
  | 'render_questions'
  | 'generate_letter'
  | 'search_trials_locations'
  | 'estimate_travel_cost'
  | 'match_programs'
  | 'build_application_packet'
  | 'place_voice_call';

export const SENSITIVE_TOOLS: ToolName[] = ['generate_letter', 'place_voice_call', 'build_application_packet'];

export function requiresApproval(tool: ToolName): boolean {
  return SENSITIVE_TOOLS.includes(tool);
}

export type AgentRunEvent = {
  at: string;
  from: AgentRunState | null;
  to: AgentRunState;
  tool?: ToolName;
  note?: string;
};

export function createIdempotencyKey(parts: Array<string | number | null | undefined>): string {
  return parts
    .map((part) => String(part ?? ''))
    .join(':')
    .slice(0, 180);
}
