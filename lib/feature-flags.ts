export const FEATURE_FLAGS = {
  feature_first_72_hours: 'feature_first_72_hours',
  feature_oncokind_family: 'feature_oncokind_family',
  feature_complete_the_picture: 'feature_complete_the_picture',
  feature_access_agent: 'feature_access_agent',
  feature_voice_call_for_me: 'feature_voice_call_for_me',
  concierge_public_pages: 'concierge_public_pages',
  concierge_purchase: 'concierge_purchase',
  concierge_ops_console: 'concierge_ops_console',
  facility_database: 'facility_database',
  voice_internal_tool: 'voice_internal_tool',
  cp_reduced_mode: 'cp_reduced_mode',
  baa_ready: 'baa_ready',
  community_posting: 'community_posting',
  professional_self_serve: 'professional_self_serve',
  rare_womens_cancers_framing: 'rare_womens_cancers_framing',
  time_bound_pass: 'time_bound_pass',
  family_tier_merge: 'family_tier_merge',
  concierge_price_variant: 'concierge_price_variant',
  individual_advocate_plan: 'individual_advocate_plan',
  tool_freeze: 'tool_freeze',
} as const;

export type FeatureFlagName = keyof typeof FEATURE_FLAGS;

function envEnabled(value: string | undefined): boolean {
  return value === '1' || value === 'true' || value === 'on';
}

function envDisabled(value: string | undefined): boolean {
  return value === '0' || value === 'false' || value === 'off';
}

function envOnByDefault(keys: string[]): boolean {
  if (keys.some((key) => envDisabled(process.env[key]))) return false;
  if (keys.some((key) => envEnabled(process.env[key]))) return true;
  return true;
}

/**
 * Server and client flags. Concierge purchase and ops stay OFF until Section 12 gates.
 * Complete the Picture reduced mode defaults ON until clinical sign-off is recorded.
 */
export function isFeatureEnabled(flag: FeatureFlagName): boolean {
  if (envEnabled(process.env.FEATURE_AGENTS_KILL_SWITCH) || envEnabled(process.env.NEXT_PUBLIC_FEATURE_AGENTS_KILL_SWITCH)) {
    if (
      flag === 'feature_complete_the_picture' ||
      flag === 'feature_access_agent' ||
      flag === 'feature_voice_call_for_me'
    ) {
      return false;
    }
  }
  if (
    envEnabled(process.env.FEATURE_CONCIERGE_KILL_SWITCH) ||
    envEnabled(process.env.NEXT_PUBLIC_FEATURE_CONCIERGE_KILL_SWITCH)
  ) {
    if (
      flag === 'concierge_public_pages' ||
      flag === 'concierge_purchase' ||
      flag === 'concierge_ops_console' ||
      flag === 'facility_database'
    ) {
      return false;
    }
  }

  const pairs: Record<FeatureFlagName, string[]> = {
    feature_first_72_hours: ['FEATURE_FIRST_72_HOURS', 'NEXT_PUBLIC_FEATURE_FIRST_72_HOURS'],
    feature_oncokind_family: ['FEATURE_ONCOKIND_FAMILY', 'NEXT_PUBLIC_FEATURE_ONCOKIND_FAMILY'],
    feature_complete_the_picture: [
      'FEATURE_COMPLETE_THE_PICTURE',
      'NEXT_PUBLIC_FEATURE_COMPLETE_THE_PICTURE',
    ],
    feature_access_agent: ['FEATURE_ACCESS_AGENT', 'NEXT_PUBLIC_FEATURE_ACCESS_AGENT'],
    feature_voice_call_for_me: ['FEATURE_VOICE_CALL_FOR_ME', 'NEXT_PUBLIC_FEATURE_VOICE_CALL_FOR_ME'],
    concierge_public_pages: ['FEATURE_CONCIERGE_PUBLIC_PAGES', 'NEXT_PUBLIC_FEATURE_CONCIERGE_PUBLIC_PAGES'],
    concierge_purchase: ['FEATURE_CONCIERGE_PURCHASE', 'NEXT_PUBLIC_FEATURE_CONCIERGE_PURCHASE'],
    concierge_ops_console: ['FEATURE_CONCIERGE_OPS_CONSOLE', 'NEXT_PUBLIC_FEATURE_CONCIERGE_OPS_CONSOLE'],
    facility_database: ['FEATURE_FACILITY_DATABASE', 'NEXT_PUBLIC_FEATURE_FACILITY_DATABASE'],
    voice_internal_tool: ['FEATURE_VOICE_INTERNAL_TOOL', 'NEXT_PUBLIC_FEATURE_VOICE_INTERNAL_TOOL'],
    cp_reduced_mode: ['FEATURE_CTP_REDUCED_MODE', 'NEXT_PUBLIC_FEATURE_CTP_REDUCED_MODE'],
    baa_ready: ['FEATURE_BAA_READY', 'NEXT_PUBLIC_FEATURE_BAA_READY'],
    community_posting: ['FEATURE_COMMUNITY_POSTING', 'NEXT_PUBLIC_FEATURE_COMMUNITY_POSTING'],
    professional_self_serve: [
      'FEATURE_PROFESSIONAL_SELF_SERVE',
      'NEXT_PUBLIC_FEATURE_PROFESSIONAL_SELF_SERVE',
    ],
    rare_womens_cancers_framing: [
      'FEATURE_RARE_WOMENS_CANCERS',
      'NEXT_PUBLIC_FEATURE_RARE_WOMENS_CANCERS',
    ],
    time_bound_pass: ['FEATURE_TIME_BOUND_PASS', 'NEXT_PUBLIC_FEATURE_TIME_BOUND_PASS'],
    family_tier_merge: ['FEATURE_FAMILY_TIER_MERGE', 'NEXT_PUBLIC_FEATURE_FAMILY_TIER_MERGE'],
    concierge_price_variant: [
      'FEATURE_CONCIERGE_PRICE_VARIANT',
      'NEXT_PUBLIC_FEATURE_CONCIERGE_PRICE_VARIANT',
    ],
    individual_advocate_plan: [
      'FEATURE_INDIVIDUAL_ADVOCATE_PLAN',
      'NEXT_PUBLIC_FEATURE_INDIVIDUAL_ADVOCATE_PLAN',
    ],
    tool_freeze: ['FEATURE_TOOL_FREEZE', 'NEXT_PUBLIC_FEATURE_TOOL_FREEZE'],
  };

  if (flag === 'cp_reduced_mode') {
    return envOnByDefault(pairs[flag]);
  }
  if (flag === 'concierge_public_pages') {
    return envOnByDefault(pairs[flag]);
  }
  if (flag === 'tool_freeze') {
    return envOnByDefault(pairs[flag]);
  }

  return pairs[flag].some((key) => envEnabled(process.env[key]));
}

export function isVoiceKillSwitchOn(): boolean {
  return (
    envEnabled(process.env.FEATURE_VOICE_KILL_SWITCH) ||
    envEnabled(process.env.NEXT_PUBLIC_FEATURE_VOICE_KILL_SWITCH) ||
    envDisabled(process.env.FEATURE_VOICE_PRODUCTION_CALLS)
  );
}

export function isVoiceProductionCallingEnabled(): boolean {
  return envEnabled(process.env.FEATURE_VOICE_PRODUCTION_CALLS) && !isVoiceKillSwitchOn();
}

export function isCtpReducedMode(): boolean {
  return isFeatureEnabled('cp_reduced_mode');
}

export function isBaaReady(): boolean {
  return isFeatureEnabled('baa_ready');
}
