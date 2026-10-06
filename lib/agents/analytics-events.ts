import type { FunnelEvent } from '@/lib/analytics';

export const AGENT_ANALYTICS_EVENTS = [
  'cp_upload_started',
  'cp_extraction_completed',
  'cp_results_viewed',
  'cp_question_status_changed',
  'cp_letter_generated',
  'cp_pdf_exported',
  'access_intake_completed',
  'access_estimate_viewed',
  'access_program_saved',
  'access_application_status_changed',
  'voice_call_requested',
  'voice_call_approved',
  'voice_call_completed',
  'upgrade_prompt_viewed',
  'upgrade_completed',
] as const;

export type AgentAnalyticsEvent = (typeof AGENT_ANALYTICS_EVENTS)[number];

export const AGENT_FUNNEL_COMPAT: Partial<Record<AgentAnalyticsEvent, FunnelEvent>> = {
  cp_upload_started: 'report_upload_started',
  cp_extraction_completed: 'profile_generated',
  cp_results_viewed: 'sample_demo_step_viewed',
  upgrade_prompt_viewed: 'checkout_started',
  upgrade_completed: 'subscription_started',
};
