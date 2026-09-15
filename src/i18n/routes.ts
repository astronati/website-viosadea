// Tabella delle pagine: chiave -> slug localizzato per lingua.
// È l'unica fonte per i link interni, il selettore lingua, hreflang e sitemap.
// Importato anche da astro.config.mjs: niente import di moduli Astro qui.
import { DEFAULT_LOCALE, LOCALES, type Locale } from './locales.ts';

export const ROUTES = {
  home: { it: '', en: '', de: '', pl: '', ru: '' },
  apartment: {
    it: 'appartamento',
    en: 'apartment',
    de: 'ferienwohnung',
    pl: 'apartament',
    ru: 'apartamenty',
  },
  gallery: { it: 'galleria', en: 'gallery', de: 'galerie', pl: 'galeria', ru: 'galereya' },
  location: {
    it: 'dove-siamo',
    en: 'location',
    de: 'lage',
    pl: 'lokalizacja',
    ru: 'raspolozhenie',
  },
  contact: { it: 'contatti', en: 'contact', de: 'kontakt', pl: 'kontakt', ru: 'kontakty' },
  privacy: {
    it: 'privacy',
    en: 'privacy',
    de: 'datenschutz',
    pl: 'prywatnosc',
    ru: 'konfidencialnost',
  },
} as const satisfies Record<string, Record<Locale, string>>;

export type PageKey = keyof typeof ROUTES;
export const PAGE_KEYS = Object.keys(ROUTES) as PageKey[];

/** Path assoluto di una pagina in una lingua, es. ('apartment','de') -> '/de/ferienwohnung/'. */
export function pathFor(key: PageKey, locale: Locale, hash?: string): string {
  const slug = ROUTES[key][locale];
  const prefix = locale === DEFAULT_LOCALE ? '' : `/${locale}`;
  const path = slug ? `${prefix}/${slug}/` : `${prefix}/`;
  return hash ? `${path}#${hash}` : path;
}

/** Parametro `path` per getStaticPaths di [...path].astro (undefined = root). */
export function paramFor(key: PageKey, locale: Locale): string | undefined {
  const p = pathFor(key, locale).replace(/^\/|\/$/g, '');
  return p || undefined;
}

/** Trova chiave e lingua a partire da un pathname ('/de/lage', '/de/lage/'). */
export function findRouteByPath(pathname: string): { key: PageKey; locale: Locale } | undefined {
  const clean = '/' + pathname.replace(/^\/+|\/+$/g, '');
  for (const key of PAGE_KEYS) {
    for (const locale of LOCALES) {
      if (pathFor(key, locale).replace(/\/$/, '') === clean.replace(/\/$/, '')) {
        return { key, locale };
      }
    }
  }
  return undefined;
}
