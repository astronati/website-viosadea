// @ts-check
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

import { SITE_URL, LOCALES, HREFLANG } from './src/i18n/locales.ts';
import { findRouteByPath, pathFor } from './src/i18n/routes.ts';

const root = dirname(fileURLToPath(import.meta.url));

// Data (ISO 8601) dell'ultimo commit che ha toccato uno dei file sorgente di una
// pagina. Le pagine sono generate da un'unica rotta dinamica, quindi il contenuto
// vive nei file di copy per lingua (src/content/pages/<lang>.ts) e nei dati.
const lastmodCache = new Map();
/** @param {string[]} files */
function gitLastmod(files) {
  const key = files.join('|');
  if (lastmodCache.has(key)) return lastmodCache.get(key);
  let iso;
  try {
    iso =
      execFileSync('git', ['log', '-1', '--format=%cI', '--', ...files], {
        cwd: root,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      }).trim() || new Date().toISOString();
  } catch {
    iso = new Date().toISOString();
  }
  lastmodCache.set(key, iso);
  return iso;
}

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  // Pagine prerenderizzate; solo /api/richiesta gira on-demand nel Worker
  // (`prerender = false`), quindi il config deployabile è dist/server/wrangler.json.
  output: 'static',
  adapter: cloudflare({
    // Immagini ottimizzate a build time con sharp (AVIF/WebP responsive):
    // nessun binding Cloudflare Images da provisionare.
    imageService: 'compile',
  }),
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      // Gli slug sono localizzati (/appartamento, /de/ferienwohnung…), quindi le
      // alternate hreflang si calcolano dalla tabella delle rotte e non dal prefisso.
      // Fuori dalla sitemap: la 404 e le porte d'ingresso /go/<canale>/, che sono
      // pagine tecniche di conteggio (src/data/channels.ts) e stanno in noindex.
      filter: (page) => {
        const { pathname } = new URL(page);
        return !pathname.startsWith('/404') && !pathname.startsWith('/go/');
      },
      serialize(item) {
        const match = findRouteByPath(new URL(item.url).pathname);
        if (match) {
          item.links = LOCALES.map((l) => ({
            lang: HREFLANG[l],
            url: new URL(pathFor(match.key, l), SITE_URL).href,
          }));
          item.lastmod = gitLastmod([
            join('src/content/pages', `${match.locale}.ts`),
            'src/pages/[...path].astro',
          ]);
        }
        return item;
      },
    }),
  ],
  image: {
    responsiveStyles: true,
  },
});
