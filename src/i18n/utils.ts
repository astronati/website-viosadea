import { ui, type UIKey } from './ui';
import { DEFAULT_LOCALE, HREFLANG, LOCALES, SITE_URL, type Locale } from './locales';
import { pathFor, type PageKey } from './routes';

export { pathFor, type PageKey, type Locale, type UIKey };

/** Funzione di traduzione legata a una lingua; `{n}` e simili vengono sostituiti. */
export function useTranslations(locale: Locale) {
  return function t(key: UIKey, vars?: Record<string, string | number>): string {
    let s = ui[locale][key] ?? ui[DEFAULT_LOCALE][key];
    if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
    return s;
  };
}

/** URL della stessa pagina in tutte le lingue (hreflang, selettore lingua). */
export function alternates(key: PageKey) {
  return LOCALES.map((locale) => ({
    locale,
    hreflang: HREFLANG[locale],
    path: pathFor(key, locale),
    href: new URL(pathFor(key, locale), SITE_URL).href,
  }));
}

/** Numero formattato secondo la lingua (9,3 in it/de/pl/ru, 9.3 in en). */
export function formatNumber(n: number, locale: Locale): string {
  return new Intl.NumberFormat(HREFLANG[locale]).format(n);
}
