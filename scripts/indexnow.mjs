// Segnala a Bing (e quindi a Copilot/ChatGPT search, che ne usano l'indice) e a
// Yandex le pagine del sito appena pubblicate, con il protocollo IndexNow.
// Google non partecipa a IndexNow: lì la sitemap in Search Console fa il lavoro.
//
// Si lancia dopo il deploy (`npm run indexnow`, o lo step nel workflow GitHub) e
// legge le URL dalla sitemap generata in dist/client.
//
// La chiave è pubblica per definizione: sta in public/<chiave>.txt, che deve
// essere raggiungibile su https://www.viosadea.com/<chiave>.txt.
import { readdir, readFile } from 'node:fs/promises';

const HOST = 'www.viosadea.com';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

const key = (await readdir('public')).find((f) => /^[0-9a-f]{32}\.txt$/.test(f))?.replace(/\.txt$/, '');
if (!key) {
  console.error('Chiave IndexNow non trovata: manca public/<32 esadecimali>.txt');
  process.exit(1);
}

const sitemap = await readFile('dist/client/sitemap-0.xml', 'utf8');
const urlList = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urlList.length === 0) {
  console.error('Nessuna URL nella sitemap: build mancante?');
  process.exit(1);
}

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: HOST,
    key,
    keyLocation: `https://${HOST}/${key}.txt`,
    urlList,
  }),
});

// 200 = accettato, 202 = accettato ma chiave da validare. Un errore qui non deve
// far fallire il deploy: il sito è già online.
console.log(`IndexNow: ${res.status} ${res.statusText} — ${urlList.length} URL segnalate`);
if (!res.ok) console.log(await res.text().catch(() => ''));
