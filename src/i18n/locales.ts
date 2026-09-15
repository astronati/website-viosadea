// Lingue del sito. File senza dipendenze: è importato anche da astro.config.mjs.

export const SITE_URL = 'https://www.viosadea.com';

export const LOCALES = ['it', 'en', 'de', 'pl', 'ru'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'it';

export const HREFLANG: Record<Locale, string> = {
  it: 'it-IT',
  en: 'en',
  de: 'de',
  pl: 'pl-PL',
  ru: 'ru',
};

export const OG_LOCALE: Record<Locale, string> = {
  it: 'it_IT',
  en: 'en_GB',
  de: 'de_DE',
  pl: 'pl_PL',
  ru: 'ru_RU',
};

/** Nome della lingua scritto nella lingua stessa (per il selettore). */
export const LANGUAGE_NAME: Record<Locale, string> = {
  it: 'Italiano',
  en: 'English',
  de: 'Deutsch',
  pl: 'Polski',
  ru: 'Русский',
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}
