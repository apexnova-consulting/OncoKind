'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { CONSENT_COOKIE_NAME, decodeConsent } from '@/lib/consent';

function readConsent() {
  if (typeof document === 'undefined') return null;
  const value = document.cookie
    .split('; ')
    .find((entry) => entry.startsWith(`${CONSENT_COOKIE_NAME}=`))
    ?.split('=')[1];

  return decodeConsent(value ?? null);
}

export function AnalyticsScripts() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const syncConsent = () => {
      const consent = readConsent();
      setEnabled(Boolean(consent?.analytics));
    };

    syncConsent();
    window.addEventListener('oncokind-consent-updated', syncConsent);
    return () => window.removeEventListener('oncokind-consent-updated', syncConsent);
  }, []);

  if (!measurementId || !enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="oncokind-ga" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}');
        `}
      </Script>
    </>
  );
}
