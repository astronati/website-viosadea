// Dati della struttura: unica fonte per footer, JSON-LD, link esterni e form.
// I valori marcati TODO vanno confermati con il proprietario.

export { SITE_URL, LOCALES, DEFAULT_LOCALE, type Locale } from './i18n/locales';

export const SITE = {
  name: 'Cèsa Viosadea',
  url: 'https://www.viosadea.com',

  // Codici obbligatori per le locazioni turistiche (da mostrare sul sito)
  cin: 'IT022036C228YUKA2Z',
  cipat: '022036-AT-010746',

  address: {
    street: 'Piaz Veie 19', // TODO: confermare se pubblicare l'indirizzo completo
    postalCode: '38031',
    locality: 'Campitello di Fassa',
    region: 'Trentino-Alto Adige',
    province: 'TN',
    country: 'IT',
  },
  // Coordinate di Piaz Veie (la piazza vecchia), da OpenStreetMap.
  // TODO: se si vuole il punto esatto del portone, prenderlo da Google Maps.
  geo: { latitude: 46.4774, longitude: 11.7406 },

  whatsapp: '+393936773323',

  apartment: {
    sizeM2: 75,
    maxGuests: 4,
    bedrooms: 2,
    bathrooms: 1,
    checkIn: { from: '16:00', to: '20:00' },
    checkOut: { from: '08:00', to: '10:00' },
    cleaningFee: 80, // TODO: € per soggiorni sotto le 7 notti, confermare
    cleaningFeeMinNights: 7,
    liftDistanceM: 150, // TODO: confermare distanza dalla funivia Col Rodella
  },

  reviews: {
    booking: { score: 9.4, max: 10 },
    airbnb: { score: 4.86, max: 5 },
  },

  booking: {
    base: 'https://www.booking.com/hotel/it/cesa-viosadea-campitello-di-fassa',
    // suffisso lingua della pagina Booking.com
    lang: { it: 'it', en: 'en-gb', de: 'de', pl: 'pl', ru: 'ru' },
  },
  airbnb: 'https://www.airbnb.com/rooms/643139657613097973',

  // Altre pagine ufficiali della struttura: finiscono in `sameAs` nei dati
  // strutturati, così motori di ricerca e AI capiscono che parlano della stessa
  // struttura (la ragione sociale sui portali locali è "Caristi Rosa").
  listings: [
    'https://www.fassa.com/en/accommodation/caristi-rosa-cesa-viosadea',
    'https://www.dolomitisuperski.com/en/plan-and-book/accommodation/Val-di-Fassa/CARISTI-ROSA-CESA-VIOSADEA',
  ],

  // Cloudflare Web Analytics (senza cookie, nessun banner da mostrare).
  // L'installazione automatica del dashboard non funziona sui siti serviti da un
  // Worker: lo snippet va incluso da noi, con il token del sito (site tag).
  cfBeaconToken: 'b6d568f06330474ea17d23ff4755f33a',

  // Site key pubblica del widget Turnstile "viosadea" (modalità Managed).
  // Il secret corrispondente è un segreto del Worker: npm run cf:secret:turnstile.
  turnstileSiteKey: '0x4AAAAAAE4Jo2jb3LMUrla5',
} as const;

export function bookingUrl(locale: keyof typeof SITE.booking.lang): string {
  return `${SITE.booking.base}.${SITE.booking.lang[locale]}.html`;
}

export function airbnbUrl(locale: string): string {
  return `${SITE.airbnb}?locale=${locale}`;
}

/** Link WhatsApp con messaggio precompilato. */
export function whatsappUrl(text?: string): string {
  const num = SITE.whatsapp.replace(/\D/g, '');
  return text ? `https://wa.me/${num}?text=${encodeURIComponent(text)}` : `https://wa.me/${num}`;
}
