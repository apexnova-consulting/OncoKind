const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const UTM_COOKIE = 'ok_utm';
const UTM_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;

export type FunnelEvent =
  | 'landing_view'
  | 'sample_demo_step_viewed'
  | 'signup_started'
  | 'signup_completed'
  | 'report_upload_started'
  | 'report_upload_completed'
  | 'profile_generated'
  | 'prep_sheet_exported'
  | 'trial_matches_viewed'
  | 'checkout_started'
  | 'subscription_started'
  | 'demo_booked_click'
  | 'professional_page_view'
  | 'prior_auth_pro_view';

type Attribution = Partial<Record<(typeof UTM_KEYS)[number], string>>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function readCookie(name: string): string | null {
  if (!isBrowser()) return null;
  const match = document.cookie.split('; ').find((entry) => entry.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
}

function writeCookie(name: string, value: string) {
  if (!isBrowser()) return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${UTM_MAX_AGE_SECONDS}; SameSite=Lax`;
}

export function captureUtmFromLocation(): Attribution {
  if (!isBrowser()) return {};
  const params = new URLSearchParams(window.location.search);
  const captured: Attribution = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) captured[key] = value.slice(0, 80);
  }
  if (Object.keys(captured).length > 0) {
    writeCookie(UTM_COOKIE, JSON.stringify(captured));
  }
  return captured;
}

export function getStoredUtms(): Attribution {
  const raw = readCookie(UTM_COOKIE);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Attribution;
    const clean: Attribution = {};
    for (const key of UTM_KEYS) {
      if (typeof parsed[key] === 'string' && parsed[key]) {
        clean[key] = parsed[key]!.slice(0, 80);
      }
    }
    return clean;
  } catch {
    return {};
  }
}

function sanitizeProps(props?: Record<string, string | number | boolean | undefined>) {
  const allowed: Record<string, string | number | boolean> = {};
  if (!props) return allowed;
  for (const [key, value] of Object.entries(props)) {
    if (value === undefined || value === null || value === '') continue;
    if (key === 'email' || key === 'name' || key === 'diagnosis' || key === 'query') continue;
    if (typeof value === 'string' && value.length > 80) continue;
    allowed[key] = value;
  }
  return allowed;
}

export function identifyAnalyticsUser(userId: string | null | undefined) {
  if (!isBrowser() || !userId || !window.gtag) return;
  window.gtag('set', { user_id: userId });
  window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, { user_id: userId });
}

const pendingEvents: Array<{ event: FunnelEvent; payload: Record<string, string | number | boolean> }> = [];

export function track(event: FunnelEvent, props?: Record<string, string | number | boolean | undefined>) {
  if (!isBrowser()) return;
  const payload = {
    ...getStoredUtms(),
    ...sanitizeProps(props),
  };
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...payload });
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, payload);
    return;
  }
  pendingEvents.push({ event, payload });
}

export function flushQueuedAnalytics() {
  if (!isBrowser() || typeof window.gtag !== 'function') return;
  while (pendingEvents.length > 0) {
    const next = pendingEvents.shift();
    if (!next) break;
    window.gtag('event', next.event, next.payload);
  }
}
