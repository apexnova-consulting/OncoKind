import { cookies } from 'next/headers';
import { getDictionary, normalizeLanguage, type SupportedLanguage } from '@/lib/i18n';

export async function getLanguageFromCookies(): Promise<SupportedLanguage> {
  const store = await cookies();
  const cookieLang = store.get('oncokind_lang')?.value;
  return normalizeLanguage(cookieLang);
}

export async function getDictionaryFromCookies() {
  const lang = await getLanguageFromCookies();
  return getDictionary(lang);
}
