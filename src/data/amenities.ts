import type { Locale } from '../i18n/locales';
import type { IconName } from '../components/icons';

export interface Amenity {
  icon: IconName;
  label: Record<Locale, string>;
  /** evidenziato (animali, parcheggio): mostrato per primo e con colore d'accento */
  highlight?: boolean;
}

export const AMENITIES: Amenity[] = [
  {
    icon: 'paw',
    highlight: true,
    label: {
      it: 'Animali ammessi, senza supplemento',
      en: 'Pets welcome, no extra charge',
      de: 'Haustiere willkommen, ohne Aufpreis',
      pl: 'Zwierzęta mile widziane, bez dopłat',
      ru: 'Можно с животными, без доплаты',
    },
  },
  {
    icon: 'parking',
    highlight: true,
    label: {
      it: 'Parcheggio privato gratuito',
      en: 'Free private parking',
      de: 'Kostenloser Privatparkplatz',
      pl: 'Bezpłatny prywatny parking',
      ru: 'Бесплатная частная парковка',
    },
  },
  {
    icon: 'door',
    label: {
      it: 'Ingresso indipendente',
      en: 'Independent entrance',
      de: 'Eigener Eingang',
      pl: 'Osobne wejście',
      ru: 'Отдельный вход',
    },
  },
  {
    icon: 'bed',
    label: {
      it: 'Camera matrimoniale e camera con 2 letti singoli',
      en: 'Double bedroom and twin bedroom',
      de: 'Doppelzimmer und Zweibettzimmer',
      pl: 'Sypialnia małżeńska i sypialnia z 2 łóżkami',
      ru: 'Спальня с двуспальной кроватью и спальня с двумя кроватями',
    },
  },
  {
    icon: 'kitchen',
    label: {
      it: 'Cucina abitabile attrezzata con forno e frigorifero',
      en: 'Fully equipped eat-in kitchen with oven and fridge',
      de: 'Voll ausgestattete Wohnküche mit Backofen und Kühlschrank',
      pl: 'Wyposażona kuchnia z jadalnią, piekarnikiem i lodówką',
      ru: 'Оборудованная кухня-столовая с духовкой и холодильником',
    },
  },
  {
    icon: 'coffee',
    label: {
      it: 'Macchina da caffè',
      en: 'Coffee machine',
      de: 'Kaffeemaschine',
      pl: 'Ekspres do kawy',
      ru: 'Кофемашина',
    },
  },
  {
    icon: 'shower',
    label: {
      it: 'Doccia idromassaggio',
      en: 'Hydromassage shower',
      de: 'Hydromassage-Dusche',
      pl: 'Prysznic z hydromasażem',
      ru: 'Душ с гидромассажем',
    },
  },
  {
    icon: 'linen',
    label: {
      it: 'Biancheria da letto e asciugamani inclusi',
      en: 'Bed linen and towels included',
      de: 'Bettwäsche und Handtücher inklusive',
      pl: 'Pościel i ręczniki w cenie',
      ru: 'Постельное бельё и полотенца включены',
    },
  },
  {
    icon: 'sparkles',
    label: {
      it: 'Set di cortesia',
      en: 'Complimentary toiletries',
      de: 'Pflegeprodukte',
      pl: 'Zestaw kosmetyków',
      ru: 'Туалетные принадлежности',
    },
  },
  {
    icon: 'tv',
    label: {
      it: '3 Smart TV',
      en: '3 Smart TVs',
      de: '3 Smart-TVs',
      pl: '3 telewizory Smart TV',
      ru: '3 телевизора Smart TV',
    },
  },
  {
    icon: 'wifi',
    label: {
      it: 'Wi-Fi gratuito',
      en: 'Free Wi-Fi',
      de: 'Kostenloses WLAN',
      pl: 'Bezpłatne Wi-Fi',
      ru: 'Бесплатный Wi-Fi',
    },
  },
  {
    icon: 'ski',
    label: {
      it: 'Deposito sci e bici in cantina',
      en: 'Ski and bike storage in the cellar',
      de: 'Ski- und Fahrradkeller',
      pl: 'Przechowalnia nart i rowerów w piwnicy',
      ru: 'Хранение лыж и велосипедов в подвале',
    },
  },
  {
    icon: 'cablecar',
    label: {
      it: 'A pochi passi dagli impianti di risalita',
      en: 'A short walk from the ski lifts',
      de: 'Wenige Schritte von den Liften',
      pl: 'Kilka kroków od wyciągów',
      ru: 'В нескольких шагах от подъёмников',
    },
  },
  {
    icon: 'mountain',
    label: {
      it: 'Vista sul paese e sulle montagne',
      en: 'Views over the village and mountains',
      de: 'Blick auf Dorf und Berge',
      pl: 'Widok na wioskę i góry',
      ru: 'Вид на деревню и горы',
    },
  },
  {
    icon: 'key',
    label: {
      it: 'Self check-in',
      en: 'Self check-in',
      de: 'Self-Check-in',
      pl: 'Samodzielne zameldowanie',
      ru: 'Самостоятельное заселение',
    },
  },
  {
    icon: 'nosmoking',
    label: {
      it: 'Appartamento non fumatori',
      en: 'Non-smoking apartment',
      de: 'Nichtraucherwohnung',
      pl: 'Apartament dla niepalących',
      ru: 'Для некурящих',
    },
  },
];
