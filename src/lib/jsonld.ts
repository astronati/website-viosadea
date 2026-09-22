// Dati strutturati schema.org (JSON-LD) per SEO e motori generativi.
import { SITE, airbnbUrl, bookingUrl } from '../consts';
import { HREFLANG, LOCALES, SITE_URL, type Locale } from '../i18n/locales';
import { pathFor, type PageKey } from '../i18n/routes';
import type { FAQItem } from '../content/types';

const abs = (path: string) => new URL(path, SITE_URL).href;

/** L'appartamento come VacationRental: sempre presente in home e pagina appartamento. */
export function rentalJsonLd(locale: Locale, description: string, images: string[]) {
  const a = SITE.apartment;
  return {
    '@context': 'https://schema.org',
    '@type': 'VacationRental',
    '@id': `${SITE_URL}/#rental`,
    name: SITE.name,
    description,
    url: abs(pathFor('home', locale)),
    image: images.map(abs),
    inLanguage: HREFLANG[locale],
    identifier: [
      { '@type': 'PropertyValue', name: 'CIN', value: SITE.cin },
      { '@type': 'PropertyValue', name: 'CIPAT', value: SITE.cipat },
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      postalCode: SITE.address.postalCode,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      addressCountry: SITE.address.country,
    },
    geo: { '@type': 'GeoCoordinates', latitude: SITE.geo.latitude, longitude: SITE.geo.longitude },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${SITE.geo.latitude},${SITE.geo.longitude}`,
    containedInPlace: {
      '@type': 'Place',
      name: 'Val di Fassa, Dolomiti',
      address: {
        '@type': 'PostalAddress',
        addressLocality: SITE.address.locality,
        addressRegion: SITE.address.region,
        addressCountry: SITE.address.country,
      },
    },
    telephone: SITE.whatsapp,
    // Le lingue in cui rispondiamo alle richieste: se lo chiedono a un'AI, lo sa.
    knowsLanguage: LOCALES.map((l) => HREFLANG[l]),
    checkinTime: a.checkIn.from,
    checkoutTime: a.checkOut.to,
    petsAllowed: true,
    numberOfRooms: a.bedrooms,
    tourBookingPage: bookingUrl(locale),
    containsPlace: {
      '@type': 'Accommodation',
      additionalType: 'EntirePlace',
      numberOfBedrooms: a.bedrooms,
      numberOfBathroomsTotal: a.bathrooms,
      occupancy: { '@type': 'QuantitativeValue', value: a.maxGuests },
      floorSize: { '@type': 'QuantitativeValue', value: a.sizeM2, unitCode: 'MTK' },
      bed: [
        { '@type': 'BedDetails', numberOfBeds: 1, typeOfBed: 'Double' },
        { '@type': 'BedDetails', numberOfBeds: 2, typeOfBed: 'Single' },
      ],
      amenityFeature: [
        { name: 'petsAllowed', value: true },
        { name: 'parkingType', value: 'Free' },
        { name: 'wifi', value: true },
        { name: 'kitchen', value: true },
        { name: 'ovenStove', value: true },
        { name: 'tv', value: true },
        { name: 'heating', value: true },
        { name: 'selfCheckinCheckout', value: true },
        { name: 'smokingAllowed', value: false },
      ].map((f) => ({ '@type': 'LocationFeatureSpecification', ...f })),
    },
    sameAs: [bookingUrl(locale), airbnbUrl(locale), ...SITE.listings],
  };
}

export function faqJsonLd(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function breadcrumbJsonLd(locale: Locale, crumbs: { key: PageKey; name: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(pathFor(c.key, locale)),
    })),
  };
}
