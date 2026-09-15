// Foto della struttura. Per aggiungerne una: copia il JPG in src/assets/photos/<stanza>/
// e aggiungi una riga qui (alt obbligatorio in tutte le lingue). L'ordine è quello
// di visualizzazione nella galleria. Le immagini vengono ottimizzate a build time.
import type { ImageMetadata } from 'astro';
import type { Locale } from '../i18n/locales';

export const ROOMS = [
  'esterno',
  'soggiorno',
  'cucina',
  'camera-matrimoniale',
  'cameretta',
  'bagno',
  'soppalco',
  'dettagli',
  'panorama',
] as const;
export type RoomId = (typeof ROOMS)[number];

interface PhotoEntry {
  file: string;
  room: RoomId;
  alt: Record<Locale, string>;
}

export interface Photo extends PhotoEntry {
  id: string;
  src: ImageMetadata;
}

const ENTRIES: PhotoEntry[] = [
  {
    file: 'esterno/esterno-1.jpg',
    room: 'esterno',
    alt: {
      it: 'La casa di Cèsa Viosadea con la scala esterna, nel centro di Campitello di Fassa',
      en: 'The Cèsa Viosadea house with its outdoor staircase in the centre of Campitello di Fassa',
      de: 'Das Haus der Cèsa Viosadea mit Außentreppe im Zentrum von Campitello di Fassa',
      pl: 'Dom Cèsa Viosadea z zewnętrznymi schodami w centrum Campitello di Fassa',
      ru: 'Дом Cèsa Viosadea с наружной лестницей в центре Кампителло-ди-Фасса',
    },
  },
  {
    file: 'soggiorno/soggiorno-scala.jpg',
    room: 'soggiorno',
    alt: {
      it: 'Soggiorno con divano, Smart TV e scala in legno verso il sottotetto',
      en: 'Living room with sofa, Smart TV and wooden staircase to the attic',
      de: 'Wohnzimmer mit Sofa, Smart-TV und Holztreppe zum Dachgeschoss',
      pl: 'Salon z sofą, Smart TV i drewnianymi schodami na poddasze',
      ru: 'Гостиная с диваном, Smart TV и деревянной лестницей в мансарду',
    },
  },
  {
    file: 'cucina/cucina-1.jpg',
    room: 'cucina',
    alt: {
      it: 'Cucina in legno naturale con piano cottura, forno e frigorifero',
      en: 'Natural wood kitchen with hob, oven and fridge',
      de: 'Küche aus Naturholz mit Kochfeld, Backofen und Kühlschrank',
      pl: 'Kuchnia z naturalnego drewna z płytą, piekarnikiem i lodówką',
      ru: 'Кухня из натурального дерева с варочной панелью, духовкой и холодильником',
    },
  },
  {
    file: 'camera-matrimoniale/matrimoniale-1.jpg',
    room: 'camera-matrimoniale',
    alt: {
      it: 'Camera matrimoniale mansardata con travi in legno',
      en: 'Attic double bedroom with wooden beams',
      de: 'Doppelzimmer im Dachgeschoss mit Holzbalken',
      pl: 'Sypialnia małżeńska na poddaszu z drewnianymi belkami',
      ru: 'Спальня с двуспальной кроватью под деревянными балками мансарды',
    },
  },
  {
    file: 'cameretta/cameretta-2.jpg',
    room: 'cameretta',
    alt: {
      it: 'Camera con due letti singoli e quadro delle Dolomiti',
      en: 'Twin bedroom with two single beds and a Dolomites print',
      de: 'Zweibettzimmer mit zwei Einzelbetten und Dolomitenbild',
      pl: 'Sypialnia z dwoma pojedynczymi łóżkami i obrazem Dolomitów',
      ru: 'Спальня с двумя односпальными кроватями и картиной Доломитов',
    },
  },
  {
    file: 'cucina/cucina-tavola.jpg',
    room: 'cucina',
    alt: {
      it: 'Tavola apparecchiata nella cucina abitabile',
      en: 'Table set in the eat-in kitchen',
      de: 'Gedeckter Tisch in der Wohnküche',
      pl: 'Nakryty stół w kuchni z jadalnią',
      ru: 'Накрытый стол на кухне-столовой',
    },
  },
  {
    file: 'soppalco/soppalco-2.jpg',
    room: 'soppalco',
    alt: {
      it: 'Angolo relax nel sottotetto con panche in legno e TV',
      en: 'Cosy attic corner with wooden benches and TV',
      de: 'Gemütliche Ecke im Dachgeschoss mit Holzbänken und TV',
      pl: 'Kącik wypoczynkowy na poddaszu z drewnianymi ławami i TV',
      ru: 'Уголок для отдыха в мансарде с деревянными скамьями и ТВ',
    },
  },
  {
    file: 'camera-matrimoniale/matrimoniale-3.jpg',
    room: 'camera-matrimoniale',
    alt: {
      it: 'Letto matrimoniale con armadio e comodini',
      en: 'Double bed with wardrobe and bedside tables',
      de: 'Doppelbett mit Kleiderschrank und Nachttischen',
      pl: 'Łóżko małżeńskie z szafą i szafkami nocnymi',
      ru: 'Двуспальная кровать со шкафом и прикроватными тумбочками',
    },
  },
  {
    file: 'cameretta/cameretta-1.jpg',
    room: 'cameretta',
    alt: {
      it: 'Camera doppia con i letti singoli accostati',
      en: 'Twin bedroom with the single beds pushed together',
      de: 'Zweibettzimmer mit zusammengestellten Einzelbetten',
      pl: 'Sypialnia z zsuniętymi łóżkami pojedynczymi',
      ru: 'Спальня с составленными вместе односпальными кроватями',
    },
  },
  {
    file: 'soggiorno/soggiorno-1.jpg',
    room: 'soggiorno',
    alt: {
      it: 'Soggiorno con finestre sul paese e mobili in stile ladino',
      en: 'Living room with windows onto the village and Ladin-style furniture',
      de: 'Wohnzimmer mit Blick aufs Dorf und Möbeln im ladinischen Stil',
      pl: 'Salon z oknami na wioskę i meblami w stylu ladyńskim',
      ru: 'Гостиная с окнами на деревню и мебелью в ладинском стиле',
    },
  },
  {
    file: 'cucina/cucina-2.jpg',
    room: 'cucina',
    alt: {
      it: 'Piano cottura e forno nella cucina attrezzata',
      en: 'Hob and oven in the equipped kitchen',
      de: 'Kochfeld und Backofen in der ausgestatteten Küche',
      pl: 'Płyta kuchenna i piekarnik w wyposażonej kuchni',
      ru: 'Варочная панель и духовка на оборудованной кухне',
    },
  },
  {
    file: 'camera-matrimoniale/matrimoniale-4.jpg',
    room: 'camera-matrimoniale',
    alt: {
      it: 'Camera matrimoniale luminosa con Smart TV',
      en: 'Bright double bedroom with Smart TV',
      de: 'Helles Doppelzimmer mit Smart-TV',
      pl: 'Jasna sypialnia małżeńska ze Smart TV',
      ru: 'Светлая спальня с двуспальной кроватью и Smart TV',
    },
  },
  {
    file: 'bagno/bagno-asciugamani.jpg',
    room: 'bagno',
    alt: {
      it: 'Asciugamani e set di cortesia pronti all’arrivo',
      en: 'Towels and toiletries ready for your arrival',
      de: 'Handtücher und Pflegeprodukte liegen bei Ankunft bereit',
      pl: 'Ręczniki i kosmetyki gotowe na przyjazd',
      ru: 'Полотенца и туалетные принадлежности к вашему приезду',
    },
  },
  {
    file: 'soppalco/soppalco-1.jpg',
    room: 'soppalco',
    alt: {
      it: 'Sottotetto con travi a vista e cassapanca in legno',
      en: 'Attic with exposed beams and a wooden chest',
      de: 'Dachgeschoss mit sichtbaren Balken und Holztruhe',
      pl: 'Poddasze z odsłoniętymi belkami i drewnianą skrzynią',
      ru: 'Мансарда с открытыми балками и деревянным сундуком',
    },
  },
  {
    file: 'camera-matrimoniale/matrimoniale-2.jpg',
    room: 'camera-matrimoniale',
    alt: {
      it: 'Camera matrimoniale con cassettiera e finestra',
      en: 'Double bedroom with chest of drawers and window',
      de: 'Doppelzimmer mit Kommode und Fenster',
      pl: 'Sypialnia małżeńska z komodą i oknem',
      ru: 'Спальня с комодом и окном',
    },
  },
  {
    file: 'soppalco/abbaino.jpg',
    room: 'soppalco',
    alt: {
      it: 'Finestra dell’abbaino con tende a quadri',
      en: 'Dormer window with checked curtains',
      de: 'Gaubenfenster mit karierten Vorhängen',
      pl: 'Okno w lukarnie z zasłonami w kratę',
      ru: 'Мансардное окно с клетчатыми занавесками',
    },
  },
  {
    file: 'dettagli/ingresso-specchio.jpg',
    room: 'dettagli',
    alt: {
      it: 'Ingresso con specchio in legno e insegna Cèsa Viosadea',
      en: 'Entrance with wooden mirror and Cèsa Viosadea sign',
      de: 'Eingang mit Holzspiegel und Cèsa-Viosadea-Schild',
      pl: 'Wejście z drewnianym lustrem i szyldem Cèsa Viosadea',
      ru: 'Прихожая с деревянным зеркалом и табличкой Cèsa Viosadea',
    },
  },
  {
    file: 'dettagli/gnomi.jpg',
    room: 'dettagli',
    alt: {
      it: 'Dettaglio d’arredo: lampada e gnomi di lana',
      en: 'Decor detail: lamp and wool gnomes',
      de: 'Dekodetail: Lampe und Wollwichtel',
      pl: 'Detal wystroju: lampa i wełniane skrzaty',
      ru: 'Деталь интерьера: лампа и шерстяные гномы',
    },
  },
  {
    file: 'esterno/esterno-2.jpg',
    room: 'esterno',
    alt: {
      it: 'Scala d’ingresso indipendente con fiori alla finestra',
      en: 'Independent entrance stairs with flowers at the window',
      de: 'Eigener Eingang über die Außentreppe mit Blumen am Fenster',
      pl: 'Niezależne wejście po schodach z kwiatami w oknie',
      ru: 'Отдельный вход по лестнице, цветы на окне',
    },
  },
  {
    file: 'dettagli/corridoio.jpg',
    room: 'dettagli',
    alt: {
      it: 'Disimpegno al piano superiore con scala in legno',
      en: 'Upstairs landing with wooden staircase',
      de: 'Flur im Obergeschoss mit Holztreppe',
      pl: 'Korytarz na piętrze z drewnianymi schodami',
      ru: 'Площадка второго этажа с деревянной лестницей',
    },
  },
  {
    file: 'dettagli/porta-ingresso.jpg',
    room: 'dettagli',
    alt: {
      it: 'Porte interne in stile tirolese',
      en: 'Tyrolean-style interior doors',
      de: 'Innentüren im Tiroler Stil',
      pl: 'Drzwi wewnętrzne w stylu tyrolskim',
      ru: 'Межкомнатные двери в тирольском стиле',
    },
  },
  {
    file: 'esterno/vista-piazza.jpg',
    room: 'esterno',
    alt: {
      it: 'Vista sulla piazza e sulla chiesa di Campitello',
      en: 'View over Campitello’s square and church',
      de: 'Blick auf den Dorfplatz und die Kirche von Campitello',
      pl: 'Widok na plac i kościół w Campitello',
      ru: 'Вид на площадь и церковь Кампителло',
    },
  },
  {
    file: 'esterno/posizione.jpg',
    room: 'esterno',
    alt: {
      it: 'Posizione della casa nel centro di Campitello di Fassa',
      en: 'Location of the house in the centre of Campitello di Fassa',
      de: 'Lage des Hauses im Zentrum von Campitello di Fassa',
      pl: 'Położenie domu w centrum Campitello di Fassa',
      ru: 'Расположение дома в центре Кампителло-ди-Фасса',
    },
  },
  {
    file: 'panorama/sassolungo-sera.jpg',
    room: 'panorama',
    alt: {
      it: 'Le Dolomiti al tramonto viste da Campitello',
      en: 'The Dolomites at dusk seen from Campitello',
      de: 'Die Dolomiten in der Abenddämmerung, von Campitello aus gesehen',
      pl: 'Dolomity o zmierzchu widziane z Campitello',
      ru: 'Доломиты в сумерках, вид из Кампителло',
    },
  },
];

const modules = import.meta.glob<{ default: ImageMetadata }>('../assets/photos/**/*.jpg', {
  eager: true,
});

export const PHOTOS: Photo[] = ENTRIES.map((entry) => {
  const mod = modules[`../assets/photos/${entry.file}`];
  if (!mod) throw new Error(`Foto mancante: src/assets/photos/${entry.file}`);
  return { ...entry, id: entry.file.replace(/\.jpg$/, '').replace('/', '-'), src: mod.default };
});

/** Foto per percorso file (es. 'cucina/cucina-1.jpg'). */
export function photo(file: string): Photo {
  const p = PHOTOS.find((x) => x.file === file);
  if (!p) throw new Error(`Foto non registrata in gallery.ts: ${file}`);
  return p;
}

export function photosByRoom(room: RoomId): Photo[] {
  return PHOTOS.filter((p) => p.room === room);
}
