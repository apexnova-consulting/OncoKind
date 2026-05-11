'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CONSENT_COOKIE_NAME, CONSENT_MAX_AGE_SECONDS, type ConsentPreferences, decodeConsent, encodeConsent } from '@/lib/consent';

function readConsentCookie() {
  if (typeof document === 'undefined') return null;
  const value = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE_NAME}=`))
    ?.split('=')[1];

  return decodeConsent(value ?? null);
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const consent = readConsentCookie();
    if (!consent) {
      setVisible(true);
      return;
    }

    setAnalytics(consent.analytics);
  }, []);

  function saveConsent(preferences: ConsentPreferences) {
    document.cookie = `${CONSENT_COOKIE_NAME}=${encodeConsent(preferences)}; path=/; max-age=${CONSENT_MAX_AGE_SECONDS}; samesite=lax`;
    setAnalytics(preferences.analytics);
    setVisible(false);
    setShowPreferences(false);
    window.dispatchEvent(new Event('oncokind-consent-updated'));
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[120] mx-auto max-w-3xl rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-xl)]">
      <p className="font-semibold text-[var(--color-primary-900)]">Cookie preferences</p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
        We use essential cookies to keep OncoKind secure and working properly. Optional analytics
        cookies only run if you allow them.
      </p>

      {showPreferences ? (
        <div className="mt-4 rounded-[var(--radius-lg)] bg-[var(--color-surface-100)] p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--color-primary-900)]">Essential cookies</p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Required for session handling, authentication, language selection, and security.
              </p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[var(--color-primary-700)]">
              Always on
            </span>
          </div>
          <div className="mt-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-[var(--color-primary-900)]">Analytics cookies</p>
              <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                Used to understand site usage only after consent is given.
              </p>
            </div>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary-800)]">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(event) => setAnalytics(event.target.checked)}
                className="h-4 w-4 rounded border-[var(--color-border)]"
              />
              Allow analytics
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="button" onClick={() => saveConsent({ essential: true, analytics })}>
              Save preferences
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowPreferences(false)}>
              Back
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="button" onClick={() => saveConsent({ essential: true, analytics: true })}>
          Accept All
        </Button>
        <Button type="button" variant="outline" onClick={() => saveConsent({ essential: true, analytics: false })}>
          Essential Only
        </Button>
        <Button type="button" variant="outline" onClick={() => setShowPreferences(true)}>
          Manage Preferences
        </Button>
      </div>
    </div>
  );
}
