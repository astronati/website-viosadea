// Sitemap delle immagini: dice a Google quali foto stanno nella galleria e come
// si chiamano. @astrojs/sitemap non le include, quindi è un file a parte,
// dichiarato in public/robots.txt accanto alla sitemap principale.
//
// Le URL sono quelle delle immagini ottimizzate a build time (AVIF/WebP e JPG
// di fallback): si usa la versione grande generata da getImage.
import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { PHOTOS } from '../data/gallery';
import { LOCALES, SITE_URL, type Locale } from '../i18n/locales';
import { pathFor } from '../i18n/routes';

export const prerender = true;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]!);

export const GET: APIRoute = async () => {
  // Una sola ottimizzazione per foto, riusata in tutte le lingue.
  const images = await Promise.all(
    PHOTOS.map(async (p) => ({
      photo: p,
      url: new URL((await getImage({ src: p.src, width: 1600, format: 'jpg' })).src, SITE_URL).href,
    })),
  );

  const urlEntry = (locale: Locale) => {
    const loc = new URL(pathFor('gallery', locale), SITE_URL).href;
    const entries = images
      .map(
        ({ photo, url }) => `    <image:image>
      <image:loc>${esc(url)}</image:loc>
      <image:title>${esc(photo.alt[locale])}</image:title>
    </image:image>`,
      )
      .join('\n');
    return `  <url>\n    <loc>${loc}</loc>\n${entries}\n  </url>`;
  };

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${LOCALES.map(urlEntry).join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
};
