// One-off: scarica le foto dalla media library del vecchio WordPress
// (www.viosadea.com) e le normalizza in src/assets/photos/<stanza>/.
//
// - usa l'originale (senza "-scaled") quando WordPress lo espone
// - ruota secondo EXIF, rimuove EXIF/GPS, lato lungo max 2400px, JPEG q90
// - scrive src/assets/photos/manifest.json per la revisione
//
// Uso: npm run import:photos  (idempotente: le foto già presenti vengono saltate)
import { mkdir, writeFile, access, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://www.viosadea.com/wp-json/wp/v2/media?per_page=100';
const OUT = join(root, 'src/assets/photos');
const CACHE = join(root, '.photo-cache');
const MAX_SIDE = 2400;

// file WordPress (basename senza estensione e senza -scaled) -> destinazione.
// Le foto con nome generico (5140, IMG_2026…) sono state classificate a vista.
const MAP = {
  'Esterno-2': 'esterno/esterno-1',
  'Esterno-1': 'esterno/esterno-2',
  '5140': 'esterno/vista-piazza',
  '5143': 'esterno/posizione',
  '5156': 'panorama/sassolungo-sera',
  'salotto-cesa-viosadea': 'soggiorno/soggiorno-1',
  'ingresso-cesa-viosadea': 'soggiorno/soggiorno-scala',
  IMG_20260430_124151: 'cucina/cucina-tavola',
  IMG_20260430_124219: 'cucina/cucina-1',
  IMG_20260430_124319: 'cucina/cucina-2',
  'Camera-1': 'camera-matrimoniale/matrimoniale-1',
  'Camera-2': 'camera-matrimoniale/matrimoniale-2',
  'Camera-4': 'camera-matrimoniale/matrimoniale-3',
  'Camera-5': 'camera-matrimoniale/matrimoniale-4',
  'Cameretta-1': 'cameretta/cameretta-1',
  'Cameretta-2': 'cameretta/cameretta-2',
  'asciugamani-cesa-viosadea-campitello-di-fassa': 'bagno/bagno-asciugamani',
  IMG_20260311_182042: 'soppalco/soppalco-1',
  IMG_20260312_151521: 'soppalco/soppalco-2',
  'Abbaino-1': 'soppalco/abbaino',
  'ingresso-viosadea-campitello-di-fassa': 'dettagli/ingresso-specchio',
  'particolare-cesa-viosadea-campitello-di-fassa': 'dettagli/gnomi',
  'porta-camera-matrimoniale-viosadea-campitello-di-fassa': 'dettagli/corridoio',
  '5280': 'dettagli/porta-ingresso',
};
// Duplicati, loghi e la vecchia cucina (bianca, rinnovata nel 2026: non più attuale)
const SKIP = new Set([
  '5317-copy',
  '5317',
  '5316',
  'viosadea-a-campitello-di-fassa',
  'cameretta-di-cesa-viosadea',
  'cameretta-viosadea-campitello-di-fassa',
  'cucina-cesa-viosadea-1',
  '2D8C8D50-9C8C-466C-9360-C97B7C760D91',
  'cesa-viosadea',
  'cropped-cesa-viosadea',
]);

const exists = (p) => access(p).then(() => true, () => false);

async function download(url) {
  const res = await fetch(url);
  if (!res.ok) return null;
  return Buffer.from(await res.arrayBuffer());
}

const media = await (await fetch(API)).json();
const manifest = [];

for (const item of media) {
  const url = item.source_url;
  const file = url.split('/').pop();
  const base = file.replace(/\.[a-z]+$/i, '').replace(/-scaled$/, '');

  if (item.mime_type === 'image/svg+xml') {
    const dest = join(root, 'src/assets/brand/logo.svg');
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, await download(url));
    manifest.push({ id: item.id, source: url, dest: 'src/assets/brand/logo.svg' });
    continue;
  }
  if (SKIP.has(base)) continue;

  const target = MAP[base];
  if (!target) {
    console.warn(`? ${file}: nessuna mappatura, aggiungila a MAP o SKIP`);
    continue;
  }
  const dest = join(OUT, `${target}.jpg`);
  if (await exists(dest)) {
    manifest.push({ id: item.id, source: url, dest: `src/assets/photos/${target}.jpg`, skipped: true });
    continue;
  }

  // originale non ridimensionato da WordPress, se disponibile
  const cached = join(CACHE, file);
  let buf = (await exists(cached)) ? await readFile(cached) : null;
  let used = url;
  if (!buf) {
    if (item.media_details?.original_image) {
      const origUrl = url.replace(file, item.media_details.original_image);
      buf = await download(origUrl);
      if (buf) used = origUrl;
    }
    buf ??= await download(url);
    if (!buf) {
      console.warn('✗ download fallito', url);
      continue;
    }
    await mkdir(CACHE, { recursive: true });
    await writeFile(cached, buf);
  }

  await mkdir(dirname(dest), { recursive: true });
  // .rotate() applica l'orientamento EXIF; sharp non copia i metadati (EXIF/GPS) di default
  const info = await sharp(buf)
    .rotate()
    .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(dest);

  manifest.push({
    id: item.id,
    source: used,
    dest: `src/assets/photos/${target}.jpg`,
    width: info.width,
    height: info.height,
    kb: Math.round(info.size / 1024),
  });
  console.log(`✓ ${target}.jpg  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}

await writeFile(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`\n${manifest.length} voci → src/assets/photos/manifest.json`);
