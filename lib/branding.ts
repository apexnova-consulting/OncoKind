import { cache } from 'react';
import { headers } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export type BrandTheme = {
  displayName: string;
  logoUrl: string | null;
  footerDisclaimer: string | null;
  isCustom: boolean;
  cssVariables: Record<string, string>;
};

const DEFAULT_PRIMARY = '#0d1b2a';
const DEFAULT_SECONDARY = '#1b2d42';
const DEFAULT_ACCENT = '#e8a838';

export const getBrandTheme = cache(async (): Promise<BrandTheme> => {
  const headerStore = await headers();
  const host = (headerStore.get('x-forwarded-host') ?? headerStore.get('host') ?? '').toLowerCase();
  const orgLookup = resolveOrganizationLookup(host);

  if (!orgLookup) {
    return buildTheme({
      display_name: 'OncoKind',
      logo_url: null,
      primary_color: DEFAULT_PRIMARY,
      secondary_color: DEFAULT_SECONDARY,
      accent_color: DEFAULT_ACCENT,
      footer_disclaimer: null,
    });
  }

  const supabase = await createServerSupabaseClient();
  const query = supabase
    .from('organizations')
    .select('display_name, logo_url, primary_color, secondary_color, accent_color, footer_disclaimer')
    .eq(orgLookup.key, orgLookup.value)
    .eq('is_active', true)
    .maybeSingle();

  const { data } = await query;
  if (!data) {
    return buildTheme({
      display_name: 'OncoKind',
      logo_url: null,
      primary_color: DEFAULT_PRIMARY,
      secondary_color: DEFAULT_SECONDARY,
      accent_color: DEFAULT_ACCENT,
      footer_disclaimer: null,
    });
  }

  return buildTheme(data);
});

function resolveOrganizationLookup(host: string) {
  const normalizedHost = host.split(':')[0];
  if (!normalizedHost || normalizedHost === 'localhost') return null;

  if (!normalizedHost.endsWith('oncokind.com')) {
    return { key: 'custom_domain' as const, value: normalizedHost };
  }

  const parts = normalizedHost.split('.');
  if (parts.length > 2) {
    const subdomain = parts[0];
    if (subdomain !== 'www' && subdomain !== 'app') {
      return { key: 'slug' as const, value: subdomain };
    }
  }

  return null;
}

function buildTheme(org: {
  display_name: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  footer_disclaimer: string | null;
}): BrandTheme {
  const primary = normalizeHex(org.primary_color, DEFAULT_PRIMARY);
  const secondary = normalizeHex(org.secondary_color, DEFAULT_SECONDARY);
  const accent = normalizeHex(org.accent_color, DEFAULT_ACCENT);

  return {
    displayName: org.display_name,
    logoUrl: org.logo_url,
    footerDisclaimer: org.footer_disclaimer,
    isCustom: org.display_name !== 'OncoKind',
    cssVariables: {
      '--brand-primary': primary,
      '--brand-secondary': secondary,
      '--brand-accent': accent,
      '--brand-logo-url': org.logo_url ?? '',
      '--brand-display-name': org.display_name,
      '--color-primary-900': primary,
      '--color-primary-800': shade(primary, -0.1),
      '--color-primary-700': shade(primary, 0.04),
      '--color-primary-600': shade(primary, 0.16),
      '--color-primary-500': shade(primary, 0.28),
      '--color-accent-400': accent,
      '--color-accent-500': shade(accent, -0.08),
      '--color-accent-600': shade(accent, -0.16),
      '--color-sage-600': secondary,
      '--color-sage-500': shade(secondary, 0.18),
      '--color-sage-400': shade(secondary, 0.32),
    },
  };
}

function normalizeHex(value: string | null | undefined, fallback: string) {
  if (!value || !/^#?[0-9a-f]{6}$/i.test(value)) return fallback;
  return value.startsWith('#') ? value : `#${value}`;
}

function shade(hex: string, amount: number) {
  const normalized = normalizeHex(hex, DEFAULT_PRIMARY).slice(1);
  const numeric = Number.parseInt(normalized, 16);
  const red = (numeric >> 16) & 255;
  const green = (numeric >> 8) & 255;
  const blue = numeric & 255;

  const adjust = (channel: number) =>
    Math.min(255, Math.max(0, Math.round(channel + (amount >= 0 ? (255 - channel) * amount : channel * amount))));

  return `#${[adjust(red), adjust(green), adjust(blue)]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`;
}
