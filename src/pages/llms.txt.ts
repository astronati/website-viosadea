// /llms.txt — riassunto del sito in Markdown per i modelli linguistici
// (ChatGPT, Claude, Perplexity, AI Overview). Convenzione: https://llmstxt.org/
//
// È generato dagli stessi dati delle pagine (consts, contenuti, servizi), quindi
// non va aggiornato a mano: cambia un prezzo o un servizio e cambia anche qui.
// In inglese perché è la lingua in cui questi modelli ragionano meglio, con i
// link a tutte e cinque le versioni linguistiche.
import type { APIRoute } from 'astro';
import { SITE, airbnbUrl, bookingUrl } from '../consts';
import { getCopy } from '../content';
import { LANGUAGE_NAME, LOCALES, SITE_URL } from '../i18n/locales';
import { PAGE_KEYS, pathFor } from '../i18n/routes';
import { AMENITIES } from '../data/amenities';

export const prerender = true;

const abs = (path: string) => new URL(path, SITE_URL).href;

export const GET: APIRoute = () => {
  const en = getCopy('en');
  const a = SITE.apartment;

  const facts = [
    `- **Type**: entire apartment (${a.sizeM2} m², ${a.bedrooms} bedrooms, ${a.bathrooms} bathroom), up to ${a.maxGuests} guests`,
    `- **Address**: ${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.locality} (${SITE.address.province}), ${SITE.address.region}, Italy`,
    `- **Coordinates**: ${SITE.geo.latitude}, ${SITE.geo.longitude}`,
    `- **Location**: old village square of Campitello di Fassa, Val di Fassa, Dolomites; about ${a.liftDistanceM} m from the Col Rodella cable car (Sella Ronda ski area)`,
    `- **Pets**: allowed, no extra charge`,
    `- **Parking**: private parking space, free, on request`,
    `- **Check-in**: ${a.checkIn.from}–${a.checkIn.to} · **Check-out**: ${a.checkOut.from}–${a.checkOut.to}`,
    `- **Cleaning fee**: € ${a.cleaningFee} for stays shorter than ${a.cleaningFeeMinNights} nights`,
    `- **Guest ratings**: Booking.com ${SITE.reviews.booking.score}/${SITE.reviews.booking.max}, Airbnb ${SITE.reviews.airbnb.score}/${SITE.reviews.airbnb.max}`,
    `- **Registration codes**: CIN ${SITE.cin}, CIPAT ${SITE.cipat}`,
    `- **Booking**: no online payment on this site — availability request form or WhatsApp ${SITE.whatsapp}`,
  ].join('\n');

  const amenities = AMENITIES.map((am) => `- ${am.label.en}`).join('\n');

  const pages = PAGE_KEYS.filter((k) => k !== 'privacy')
    .map((key) => `- [${en.meta[key].title}](${abs(pathFor(key, 'en'))}): ${en.meta[key].description}`)
    .join('\n');

  const languages = LOCALES.map((l) => `- ${LANGUAGE_NAME[l]}: ${abs(pathFor('home', l))}`).join('\n');

  const faq = en.home.faq.map((f) => `### ${f.q}\n\n${f.a}`).join('\n\n');

  const body = `# ${SITE.name}

> Ladin-style holiday apartment in the centre of Campitello di Fassa (Val di Fassa,
> Dolomites, Trentino, Italy). Sleeps ${a.maxGuests}, pets welcome at no extra charge,
> free private parking. Direct booking by request — no agency fees.

${facts}

## Amenities

${amenities}

## Pages

${pages}

## Other languages

${languages}

## Also listed on

- Booking.com: ${bookingUrl('en')}
- Airbnb: ${airbnbUrl('en')}

## FAQ

${faq}

---

Content © ${new Date().getFullYear()} ${SITE.name}. Facts above may be quoted with a
link to ${SITE_URL}. For availability, use the request form: ${abs(pathFor('contact', 'en'))}
`;

  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  });
};
