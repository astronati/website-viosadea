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
    file: 'soggiorno/soggiorno-arco.jpg',
    room: 'soggiorno',
    alt: {
      it: 'Soggiorno visto attraverso l’arco, con scala in legno e finestra sul paese',
      en: 'Living room seen through the archway, with wooden staircase and window onto the village',
      de: 'Wohnzimmer durch den Rundbogen gesehen, mit Holztreppe und Fenster zum Dorf',
      pl: 'Salon widziany przez łuk, z drewnianymi schodami i oknem na wioskę',
      ru: 'Гостиная через арку: деревянная лестница и окно на деревню',
    },
  },
  {
    file: 'cucina/cucina-pranzo-2.jpg',
    room: 'cucina',
    alt: {
      it: 'Zona pranzo della cucina con panca angolare e finestra con tende',
      en: 'Kitchen dining area with corner bench and curtained window',
      de: 'Essbereich der Küche mit Eckbank und Fenster mit Gardinen',
      pl: 'Część jadalna kuchni z narożną ławą i oknem z firankami',
      ru: 'Обеденная зона кухни с угловой скамьёй и окном с занавесками',
    },
  },
  {
    file: 'camera-matrimoniale/matrimoniale-mansarda.jpg',
    room: 'camera-matrimoniale',
    alt: {
      it: 'Letto matrimoniale sotto il soffitto in legno, con Smart TV e panche decorate',
      en: 'Double bed under the wooden ceiling, with Smart TV and decorated benches',
      de: 'Doppelbett unter der Holzdecke, mit Smart-TV und verzierten Bänken',
      pl: 'Łóżko małżeńskie pod drewnianym sufitem, ze Smart TV i zdobionymi ławami',
      ru: 'Двуспальная кровать под деревянным потолком, Smart TV и декоративные скамьи',
    },
  },
  {
    file: 'soggiorno/soggiorno-scala-2.jpg',
    room: 'soggiorno',
    alt: {
      it: 'Soggiorno con divano letto, scala in legno verso il sottotetto e finestra con tende a quadri',
      en: 'Living room with sofa bed, wooden staircase to the attic and window with checked curtains',
      de: 'Wohnzimmer mit Schlafsofa, Holztreppe zum Dachgeschoss und Fenster mit karierten Vorhängen',
      pl: 'Salon z rozkładaną sofą, drewnianymi schodami na poddasze i oknem z zasłonami w kratę',
      ru: 'Гостиная с диваном-кроватью, деревянной лестницей в мансарду и окном с клетчатыми занавесками',
    },
  },
  {
    file: 'camera-matrimoniale/matrimoniale-letto.jpg',
    room: 'camera-matrimoniale',
    alt: {
      it: 'Camera matrimoniale mansardata con travi in legno e quadro delle Dolomiti',
      en: 'Attic double bedroom with wooden beams and a Dolomites print',
      de: 'Doppelzimmer im Dachgeschoss mit Holzbalken und Dolomitenbild',
      pl: 'Sypialnia małżeńska na poddaszu z drewnianymi belkami i obrazem Dolomitów',
      ru: 'Спальня с двуспальной кроватью в мансарде с деревянными балками и картиной Доломитов',
    },
  },
  {
    file: 'soppalco/soppalco-panche.jpg',
    room: 'soppalco',
    alt: {
      it: 'Angolo nel sottotetto con panche in legno decorate a cervi',
      en: 'Attic corner with wooden benches decorated with deer',
      de: 'Ecke im Dachgeschoss mit Holzbänken im Hirschdekor',
      pl: 'Kącik na poddaszu z drewnianymi ławami w jelenie',
      ru: 'Уголок в мансарде с деревянными скамьями с оленями',
    },
  },
  {
    file: 'cameretta/cameretta-letti-singoli.jpg',
    room: 'cameretta',
    alt: {
      it: 'Seconda camera con due letti singoli separati e quadro delle Dolomiti',
      en: 'Second bedroom with two separate single beds and a Dolomites print',
      de: 'Zweites Schlafzimmer mit zwei getrennten Einzelbetten und Dolomitenbild',
      pl: 'Druga sypialnia z dwoma osobnymi łóżkami pojedynczymi i obrazem Dolomitów',
      ru: 'Вторая спальня с двумя раздельными односпальными кроватями и картиной Доломитов',
    },
  },
  {
    file: 'cameretta/cameretta-letto-2.jpg',
    room: 'cameretta',
    alt: {
      it: 'La seconda camera vista dalla porta, con soffitto in legno',
      en: 'The second bedroom seen from the door, with wooden ceiling',
      de: 'Das zweite Schlafzimmer von der Tür aus, mit Holzdecke',
      pl: 'Druga sypialnia widziana od drzwi, z drewnianym sufitem',
      ru: 'Вторая спальня со стороны двери, с деревянным потолком',
    },
  },
  {
    file: 'bagno/bagno-doccia-2.jpg',
    room: 'bagno',
    alt: {
      it: 'Bagno con doccia in cristallo, lavabo in appoggio su mensola in legno e specchio',
      en: 'Bathroom with glass shower, vessel washbasin on a wooden shelf and mirror',
      de: 'Bad mit Glasdusche, Aufsatzwaschbecken auf Holzablage und Spiegel',
      pl: 'Łazienka z kabiną prysznicową, umywalką nablatową na drewnianej półce i lustrem',
      ru: 'Ванная с душевой кабиной, накладной раковиной на деревянной полке и зеркалом',
    },
  },
  {
    file: 'soggiorno/soggiorno-divano.jpg',
    room: 'soggiorno',
    alt: {
      it: 'Divano angolare con cuscini ladini e quadro delle Dolomiti al tramonto',
      en: 'Corner sofa with Ladin cushions and a painting of the Dolomites at sunset',
      de: 'Ecksofa mit ladinischen Kissen und Bild der Dolomiten im Abendrot',
      pl: 'Narożna sofa z ladyńskimi poduszkami i obrazem Dolomitów o zachodzie słońca',
      ru: 'Угловой диван с ладинскими подушками и картиной Доломитов на закате',
    },
  },
  {
    file: 'soggiorno/soggiorno-finestra.jpg',
    room: 'soggiorno',
    alt: {
      it: 'Finestra del soggiorno con tendina di pizzo e cuscini sul davanzale',
      en: 'Living-room window with lace curtain and cushions on the sill',
      de: 'Wohnzimmerfenster mit Spitzengardine und Kissen auf der Fensterbank',
      pl: 'Okno w salonie z koronkową firanką i poduszkami na parapecie',
      ru: 'Окно гостиной с кружевной занавеской и подушками на подоконнике',
    },
  },
  {
    file: 'bagno/bagno-lavabo-2.jpg',
    room: 'bagno',
    alt: {
      it: 'Bagno con lavabo in appoggio, WC e bidet',
      en: 'Bathroom with vessel washbasin, WC and bidet',
      de: 'Bad mit Aufsatzwaschbecken, WC und Bidet',
      pl: 'Łazienka z umywalką nablatową, WC i bidetem',
      ru: 'Ванная с накладной раковиной, унитазом и биде',
    },
  },
  {
    file: 'cameretta/cameretta-letto-3.jpg',
    room: 'cameretta',
    alt: {
      it: 'Letti con cuscini a tema cervo e comodino in legno',
      en: 'Beds with deer-themed cushions and a wooden bedside table',
      de: 'Betten mit Hirsch-Kissen und Nachttisch aus Holz',
      pl: 'Łóżka z poduszkami w jelenie i drewnianą szafką nocną',
      ru: 'Кровати с подушками с оленями и деревянная прикроватная тумбочка',
    },
  },
  {
    file: 'cucina/ingresso-cucina.jpg',
    room: 'cucina',
    alt: {
      it: 'Dall’ingresso verso la cucina, oltre la porta in legno con l’insegna Cèsa Viosadea',
      en: 'From the entrance towards the kitchen, past the wooden door with the Cèsa Viosadea sign',
      de: 'Vom Eingang zur Küche, vorbei an der Holztür mit dem Cèsa-Viosadea-Schild',
      pl: 'Od wejścia w stronę kuchni, za drewnianymi drzwiami z szyldem Cèsa Viosadea',
      ru: 'Вид из прихожей на кухню, за деревянной дверью с табличкой Cèsa Viosadea',
    },
  },
  {
    file: 'cucina/cucina-arco.jpg',
    room: 'cucina',
    alt: {
      it: 'La cucina in legno vista attraverso l’arco',
      en: 'The wooden kitchen seen through the archway',
      de: 'Die Holzküche durch den Rundbogen gesehen',
      pl: 'Drewniana kuchnia widziana przez łuk',
      ru: 'Деревянная кухня через арку',
    },
  },
  {
    file: 'soggiorno/soggiorno-scala-3.jpg',
    room: 'soggiorno',
    alt: {
      it: 'Scala in legno e zona divano del soggiorno illuminata dal sole',
      en: 'Wooden staircase and sunlit sofa area in the living room',
      de: 'Holztreppe und sonnige Sofaecke im Wohnzimmer',
      pl: 'Drewniane schody i nasłoneczniony kącik z sofą w salonie',
      ru: 'Деревянная лестница и залитая солнцем зона с диваном в гостиной',
    },
  },
  {
    file: 'soppalco/soppalco-scala.jpg',
    room: 'soppalco',
    alt: {
      it: 'Sottotetto con ringhiera in legno e cassapanca',
      en: 'Attic with wooden railing and chest',
      de: 'Dachgeschoss mit Holzgeländer und Truhe',
      pl: 'Poddasze z drewnianą balustradą i skrzynią',
      ru: 'Мансарда с деревянными перилами и сундуком',
    },
  },
  {
    file: 'bagno/bagno-mensola.jpg',
    room: 'bagno',
    alt: {
      it: 'Mobile in legno antico con asciugamani e set di cortesia',
      en: 'Reclaimed-wood cabinet with towels and toiletries',
      de: 'Schrank aus Altholz mit Handtüchern und Pflegeprodukten',
      pl: 'Szafka ze starego drewna z ręcznikami i kosmetykami',
      ru: 'Шкафчик из старого дерева с полотенцами и туалетными принадлежностями',
    },
  },
  {
    file: 'dettagli/ingresso-specchio-2.jpg',
    room: 'dettagli',
    alt: {
      it: 'Ingresso con specchio in legno e arco verso il soggiorno',
      en: 'Entrance with wooden mirror and archway to the living room',
      de: 'Eingang mit Holzspiegel und Rundbogen zum Wohnzimmer',
      pl: 'Wejście z drewnianym lustrem i łukiem do salonu',
      ru: 'Прихожая с деревянным зеркалом и аркой в гостиную',
    },
  },
  {
    file: 'dettagli/ingresso-specchio-3.jpg',
    room: 'dettagli',
    alt: {
      it: 'Specchio in legno all’ingresso, con la scala del soggiorno sullo sfondo',
      en: 'Wooden mirror in the entrance, with the living-room staircase behind',
      de: 'Holzspiegel im Eingang, im Hintergrund die Treppe des Wohnzimmers',
      pl: 'Drewniane lustro przy wejściu, w tle schody w salonie',
      ru: 'Деревянное зеркало в прихожей, на заднем плане лестница гостиной',
    },
  },
  {
    file: 'dettagli/porta-targa.jpg',
    room: 'dettagli',
    alt: {
      it: 'Insegna Cèsa Viosadea sulla porta in legno e vetro',
      en: 'Cèsa Viosadea sign on the wood-and-glass door',
      de: 'Cèsa-Viosadea-Schild an der Tür aus Holz und Glas',
      pl: 'Szyld Cèsa Viosadea na drzwiach z drewna i szkła',
      ru: 'Табличка Cèsa Viosadea на деревянной двери со стеклом',
    },
  },
  {
    file: 'dettagli/cuore.jpg',
    room: 'dettagli',
    alt: {
      it: 'Appendiabiti a cuore in legno antico',
      en: 'Heart-shaped coat hook in reclaimed wood',
      de: 'Herzförmige Garderobe aus Altholz',
      pl: 'Wieszak w kształcie serca ze starego drewna',
      ru: 'Вешалка в форме сердца из старого дерева',
    },
  },
  {
    file: 'dettagli/tendine.jpg',
    room: 'dettagli',
    alt: {
      it: 'Tendine con cuori a quadri alle finestre',
      en: 'Curtains with checked hearts at the windows',
      de: 'Gardinen mit karierten Herzen an den Fenstern',
      pl: 'Firanki z sercami w kratę w oknach',
      ru: 'Занавески с клетчатыми сердечками на окнах',
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
    file: 'esterno/chiesetta-dolomiti.jpg',
    room: 'esterno',
    alt: {
      it: 'Chiesetta affrescata con le Dolomiti sullo sfondo, in Val di Fassa',
      en: 'Frescoed chapel with the Dolomites behind, in Val di Fassa',
      de: 'Freskierte Kirche mit den Dolomiten im Hintergrund, im Fassatal',
      pl: 'Kościółek z freskami na tle Dolomitów w Val di Fassa',
      ru: 'Расписанная фресками церковь на фоне Доломитов, Валь-ди-Фасса',
    },
  },
  {
    file: 'panorama/dolomiti-bosco.jpg',
    room: 'panorama',
    alt: {
      it: 'Le Dolomiti sopra i boschi e i masi della Val di Fassa',
      en: 'The Dolomites above the forests and farmhouses of Val di Fassa',
      de: 'Die Dolomiten über den Wäldern und Höfen des Fassatals',
      pl: 'Dolomity nad lasami i gospodarstwami Val di Fassa',
      ru: 'Доломиты над лесами и хуторами Валь-ди-Фасса',
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

/** Foto per percorso file (es. 'cucina/cucina-pranzo-2.jpg'). */
export function photo(file: string): Photo {
  const p = PHOTOS.find((x) => x.file === file);
  if (!p) throw new Error(`Foto non registrata in gallery.ts: ${file}`);
  return p;
}

export function photosByRoom(room: RoomId): Photo[] {
  return PHOTOS.filter((p) => p.room === room);
}
