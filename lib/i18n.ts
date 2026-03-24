import en from '@/locales/en.json';
import es from '@/locales/es.json';
import zhCN from '@/locales/zh-CN.json';
import tl from '@/locales/tl.json';

export const SUPPORTED_LANGUAGES = ['en', 'es', 'zh-CN', 'tl'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

type Dictionary = typeof en;

const dictionaries: Record<SupportedLanguage, Dictionary> = {
  en,
  es,
  'zh-CN': zhCN,
  tl,
};

export function normalizeLanguage(value?: string | null): SupportedLanguage {
  if (!value) return 'en';
  if (value.startsWith('es')) return 'es';
  if (value.startsWith('zh')) return 'zh-CN';
  if (value.startsWith('tl')) return 'tl';
  return 'en';
}

export function getDictionary(lang: SupportedLanguage): Dictionary {
  return dictionaries[lang];
}
