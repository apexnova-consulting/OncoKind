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
  };

  if (flag === 'cp_reduced_mode') {
    return envOnByDefault(pairs[flag]);
  }
  if (flag === 'concierge_public_pages') {
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
