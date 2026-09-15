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
  // TODO: coordinate indicative del centro di Campitello, verificare sulla mappa
  geo: { latitude: 46.4756, longitude: 11.7404 },

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
    booking: { score: 9.3, max: 10 },
    airbnb: { score: 4.86, max: 5 },
  },

  booking: {
    base: 'https://www.booking.com/hotel/it/cesa-viosadea-campitello-di-fassa',
    // suffisso lingua della pagina Booking.com
    lang: { it: 'it', en: 'en-gb', de: 'de', pl: 'pl', ru: 'ru' },
  },
  airbnb: 'https://www.airbnb.com/rooms/643139657613097973',

  // Cloudflare Web Analytics (cookieless). Se il sito è proxato da Cloudflare si
  // può attivare dal dashboard senza token; altrimenti incolla qui il token.
  cfBeaconToken: '',

  // Site key pubblica del widget Turnstile. Quella di test "passa sempre":
  // sostituirla con la chiave reale creata nel dashboard (docs/deploy.md).
  turnstileSiteKey: '1x00000000000000000000AA',
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
