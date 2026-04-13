'use client';

import { Globe } from 'lucide-react';
import { useEffect, useState } from 'react';
import { normalizeLanguage, type SupportedLanguage } from '@/lib/i18n';

const options: Array<{ id: SupportedLanguage; label: string }> = [
  { id: 'en', label: 'English' },
  { id: 'es', label: 'Spanish (Espanol)' },
  { id: 'zh-CN', label: 'Mandarin (中文)' },
  { id: 'tl', label: 'Tagalog' },
];

export function LanguageSelector() {
  const [lang, setLang] = useState<SupportedLanguage>('en');

  useEffect(() => {
    const fromCookie = document.cookie
      .split('; ')
      .find((c) => c.startsWith('oncokind_lang='))
      ?.split('=')[1];
    const fromNavigator = typeof navigator !== 'undefined' ? navigator.language : 'en';
    const resolved = normalizeLanguage(fromCookie || fromNavigator);
    setLang(resolved);
  }, []);

  function changeLanguage(next: SupportedLanguage) {
    setLang(next);
    document.cookie = `oncokind_lang=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;
    window.location.reload();
  }

  return (
    <label className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
      <Globe className="h-4 w-4 shrink-0 text-[var(--color-primary-600)]" aria-hidden />
      <span className="sr-only">Language</span>
      <select
        value={lang}
        onChange={(e) => changeLanguage(e.target.value as SupportedLanguage)}
        className="max-w-[13rem] cursor-pointer rounded-full border border-[var(--color-border)] bg-[var(--color-surface-100)] px-3 py-1.5 text-sm font-medium text-[var(--color-primary-800)] transition-colors hover:border-[var(--color-primary-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)] focus-visible:ring-offset-2"
        aria-label="Select language"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}
