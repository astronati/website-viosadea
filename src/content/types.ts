// Struttura dei testi di pagina. Ogni lingua (src/content/pages/<lang>.ts)
// deve rispettarla per intero: una chiave mancante fa fallire il type-check.
import type { PageKey } from '../i18n/routes';
import type { RoomId } from '../data/gallery';

export interface FAQItem {
  q: string;
  a: string;
}

export interface PageCopy {
  meta: Record<PageKey, { title: string; description: string }>;

  home: {
    heroEyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    introEyebrow: string;
    introTitle: string;
    introText: string[];
    welcomeEyebrow: string;
    welcomeTitle: string;
    petsTitle: string;
    petsText: string;
    parkingTitle: string;
    parkingText: string;
    storageTitle: string;
    storageText: string;
    roomsEyebrow: string;
    roomsTitle: string;
    locationEyebrow: string;
    locationTitle: string;
    locationText: string;
    faqTitle: string;
    faq: FAQItem[];
    finalTitle: string;
    finalText: string;
  };

  apartment: {
    eyebrow: string;
    title: string;
    subtitle: string;
    intro: string[];
    roomsTitle: string;
    rooms: { room: RoomId; title: string; text: string }[];
    amenitiesTitle: string;
    petsParkingTitle: string;
    petsText: string;
    parkingText: string;
    rulesTitle: string;
    rules: { label: string; value: string }[];
  };

  gallery: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };

  location: {
    eyebrow: string;
    title: string;
    subtitle: string;
    intro: string[];
    distancesTitle: string;
    distances: { place: string; distance: string }[];
    winterTitle: string;
    winterText: string;
    summerTitle: string;
    summerText: string;
    arrivalTitle: string;
    arrivalText: string;
  };

  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    formTitle: string;
    formText: string;
    directTitle: string;
    directText: string;
    portalsTitle: string;
    portalsText: string;
    goodToKnowTitle: string;
    goodToKnow: string[];
  };

  privacy: {
    title: string;
    updated: string;
    sections: { title: string; body: string[] }[];
  };
}
