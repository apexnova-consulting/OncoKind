export type ConsentPreferences = {
  essential: true;
  analytics: boolean;
};

export const CONSENT_COOKIE_NAME = 'oncokind_consent';
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function encodeConsent(preferences: ConsentPreferences) {
  return encodeURIComponent(JSON.stringify(preferences));
}

export function decodeConsent(value?: string | null): ConsentPreferences | null {
  if (!value) return null;

  try {
    const parsed = JSON.parse(decodeURIComponent(value));
    if (parsed && typeof parsed.analytics === 'boolean') {
      return {
        essential: true,
        analytics: parsed.analytics,
      };
    }
  } catch {
    return null;
  }

  return null;
}
