'use client';

import { Globe } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { normalizeLanguage, type SupportedLanguage } from '@/lib/i18n';

const DISPLAY: Record<SupportedLanguage, string> = {
  en: 'English',
  es: 'Español',
  'zh-CN': '中文',
  tl: 'Tagalog',
};

const optionOrder: SupportedLanguage[] = ['en', 'es', 'zh-CN', 'tl'];

export function LanguageSelector() {
  const [lang, setLang] = useState<SupportedLanguage>('en');
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fromCookie = document.cookie
      .split('; ')
      .find((c) => c.startsWith('oncokind_lang='))
      ?.split('=')[1];
    const fromNavigator = typeof navigator !== 'undefined' ? navigator.language : 'en';
    const resolved = normalizeLanguage(fromCookie || fromNavigator);
    setLang(resolved);
  }, []);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: MouseEvent | TouchEvent) {
      const root = rootRef.current;
      if (root && !root.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('touchstart', handleOutside);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('touchstart', handleOutside);
    };
  }, [open]);

  const toggle = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen((v) => !v);
  }, []);

  function changeLanguage(next: SupportedLanguage) {
    setLang(next);
    setOpen(false);
    document.cookie = `oncokind_lang=${next}; path=/; max-age=31536000; samesite=lax`;
    document.documentElement.lang = next;
    window.location.reload();
  }

  return (
    <div ref={rootRef} className="relative inline-flex items-center">
      <button
        type="button"
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-100)] px-3 py-1.5 text-sm font-medium text-[var(--color-primary-800)] transition-colors hover:border-[var(--color-primary-600)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-400)] focus-visible:ring-offset-2"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
        onClick={toggle}
        onTouchEnd={toggle}
      >
        <Globe className="h-4 w-4 shrink-0 text-[var(--color-primary-600)]" aria-hidden />
        <span>English</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-[calc(100%+6px)] z-[200] min-w-[10rem] max-w-[90vw] rounded-lg border border-[var(--color-border)] bg-white py-1 shadow-lg"
        >
          {optionOrder.map((id) => (
            <li key={id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={id === lang}
                className="block w-full px-4 py-2 text-left text-sm text-[var(--color-primary-900)] hover:bg-[var(--color-surface-100)]"
                onClick={() => changeLanguage(id)}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  changeLanguage(id);
                }}
              >
                {DISPLAY[id]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
