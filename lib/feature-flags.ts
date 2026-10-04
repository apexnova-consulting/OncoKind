export const FEATURE_FLAGS = {
  feature_first_72_hours: 'feature_first_72_hours',
  feature_oncokind_family: 'feature_oncokind_family',
} as const;

export type FeatureFlagName = keyof typeof FEATURE_FLAGS;

function envEnabled(value: string | undefined): boolean {
  return value === '1' || value === 'true' || value === 'on';
}

/**
 * Server and client flags. Default OFF in production until clinical and legal
 * approval. Staging/preview should set FEATURE_* and NEXT_PUBLIC_FEATURE_* to 1.
 */
export function isFeatureEnabled(flag: FeatureFlagName): boolean {
  if (flag === 'feature_first_72_hours') {
    return (
      envEnabled(process.env.FEATURE_FIRST_72_HOURS) ||
      envEnabled(process.env.NEXT_PUBLIC_FEATURE_FIRST_72_HOURS)
    );
  }
  return (
    envEnabled(process.env.FEATURE_ONCOKIND_FAMILY) ||
    envEnabled(process.env.NEXT_PUBLIC_FEATURE_ONCOKIND_FAMILY)
  );
}
