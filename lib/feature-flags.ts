export const FEATURE_FLAGS = {
  feature_first_72_hours: 'feature_first_72_hours',
  feature_oncokind_family: 'feature_oncokind_family',
  feature_complete_the_picture: 'feature_complete_the_picture',
  feature_access_agent: 'feature_access_agent',
  feature_voice_call_for_me: 'feature_voice_call_for_me',
} as const;

export type FeatureFlagName = keyof typeof FEATURE_FLAGS;

function envEnabled(value: string | undefined): boolean {
  return value === '1' || value === 'true' || value === 'on';
}

function envDisabled(value: string | undefined): boolean {
  return value === '0' || value === 'false' || value === 'off';
}

/**
 * Server and client flags. Default OFF in production until clinical, legal,
 * and Section 11 release gates are recorded.
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

  const pairs: Record<FeatureFlagName, string[]> = {
    feature_first_72_hours: ['FEATURE_FIRST_72_HOURS', 'NEXT_PUBLIC_FEATURE_FIRST_72_HOURS'],
    feature_oncokind_family: ['FEATURE_ONCOKIND_FAMILY', 'NEXT_PUBLIC_FEATURE_ONCOKIND_FAMILY'],
    feature_complete_the_picture: [
      'FEATURE_COMPLETE_THE_PICTURE',
      'NEXT_PUBLIC_FEATURE_COMPLETE_THE_PICTURE',
    ],
    feature_access_agent: ['FEATURE_ACCESS_AGENT', 'NEXT_PUBLIC_FEATURE_ACCESS_AGENT'],
    feature_voice_call_for_me: ['FEATURE_VOICE_CALL_FOR_ME', 'NEXT_PUBLIC_FEATURE_VOICE_CALL_FOR_ME'],
  };

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
