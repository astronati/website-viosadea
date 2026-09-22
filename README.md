# Cèsa Viosadea — sito web

Sito di [Cèsa Viosadea](https://www.viosadea.com), appartamento in stile ladino a
Campitello di Fassa (Dolomiti). Sostituisce il vecchio WordPress.

- **Astro 7** (pagine statiche) su **Cloudflare Workers** — stessa architettura di `Projects/attidiati`
- **5 lingue**: italiano (`/`), inglese (`/en/`), tedesco (`/de/`), polacco (`/pl/`), russo (`/ru/`), con URL localizzati
- **Mobile first**, CSS puro, quasi zero JavaScript
- **Foto ottimizzate a build time** (AVIF + WebP responsive)
- **Modulo richieste** → Worker con Turnstile (anti-spam) + email via Brevo, più WhatsApp
- In evidenza: **animali ammessi senza supplemento** e **parcheggio privato gratuito**

## Comandi

```sh
nvm use
npm install
npm run dev       # sviluppo su http://localhost:4321 (per provare il modulo contatti usa preview)
npm run build     # build in dist/
npm run check     # type-check (chiavi di traduzione mancanti incluse)
npm run preview   # build + Worker locale (serve .dev.vars)
npm run deploy    # pubblica su Cloudflare (docs/deploy.md)
```

## Dove modificare cosa

| Cosa | File |
|---|---|
| Dati struttura (CIN, WhatsApp, orari, link Booking/Airbnb, voti) | `src/consts.ts` |
| Testi delle pagine, per lingua | `src/content/pages/{it,en,de,pl,ru}.ts` |
| Etichette brevi (menu, bottoni, form) | `src/i18n/ui.ts` |
| URL delle pagine per lingua | `src/i18n/routes.ts` |
| Elenco servizi | `src/data/amenities.ts` |
| Foto e testi alternativi | `src/data/gallery.ts` + `src/assets/photos/<stanza>/` |
| Colori e tipografia | `src/styles/global.css` |
| Destinatario e mittente delle richieste | `wrangler.jsonc` → `vars` |
| Redirect dei vecchi URL | `public/_redirects` |
| Riassunto per le AI (`/llms.txt`) | generato da `src/pages/llms.txt.ts` |
| Canali di provenienza (`/go/<canale>`) | `src/data/channels.ts` |

La struttura dei testi è tipizzata (`src/content/types.ts`): se una lingua non ha
una chiave, `npm run check` fallisce.

### Aggiungere una foto

1. Copia il JPG (anche grande: viene ottimizzato in automatico) in
   `src/assets/photos/<stanza>/`, es. `cucina/cucina-3.jpg`.
2. Aggiungi una voce in `src/data/gallery.ts` con `room` e `alt` nelle 5 lingue.
   L'ordine nell'array è l'ordine in galleria.

`npm run import:photos` riscarica le foto dal vecchio WordPress (script una tantum,
già eseguito; esclude duplicati e la vecchia cucina bianca).

## Mettere online

Il sito è **online su <https://www.viosadea.com>** dal 22/09/2026 (prima era
WordPress su Netsons, hosting poi disdetto).

Architettura: **Cloudflare Worker `viosadea`** (account Cloudflare dedicato, piano
Free), pagine statiche + `/api/richiesta` che invia le richieste a
**viosadea@gmail.com** tramite l'API di **Brevo** (piano gratuito), protetto da
Turnstile. La posta in arrivo `@viosadea.com` è inoltrata a `viosadea@gmail.com` da
**Cloudflare Email Routing**; il dominio resta registrato su Netsons.

### Primo rilascio (fatto) → [docs/setup-cloudflare.md](docs/setup-cloudflare.md)

1. [x] Account Cloudflare dedicato, API token → `.envrc` (`cp .envrc.example .envrc`)
2. [x] `npm run cf:whoami` (account giusto) → `npm run deploy` → anteprima su `workers.dev`
3. [x] Turnstile: site key in `src/consts.ts`, secret con `npm run cf:secret:turnstile`
4. [x] Brevo: API key con `npm run cf:secret:brevo`, "Block unknown IP addresses" disattivato, test del modulo
5. [x] DNS su Cloudflare, posta su Email Routing → [docs/dns-migration.md](docs/dns-migration.md)
6. [x] Dominio sul Worker (Custom Domain apex + www) + redirect apex → www
7. [x] Secrets GitHub (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`) per il deploy automatico
8. [x] Web Analytics e Search Console attivi; restano da aggiornare i link su Booking/Airbnb

### Rilasci successivi → [docs/deploy.md](docs/deploy.md)

```sh
npm run check && git add -A && git commit -m "…" && git push   # GitHub Actions pubblica
# oppure da terminale:
source .envrc && npm run cf:whoami && npm run deploy
```

⚠️ Ferma `npm run dev` prima di fare build/deploy in locale (vedi docs/deploy.md).

## Da confermare con il proprietario

Segnati con `TODO` nel codice:

- indirizzo completo e coordinate per la mappa (`src/consts.ts`)
- distanza esatta dalla funivia Col Rodella
- testo dell'informativa privacy (bozza da far validare)

## Documentazione

- [docs/setup-cloudflare.md](docs/setup-cloudflare.md) — primo setup: account, token, Turnstile, Brevo, dominio, GitHub
- [docs/deploy.md](docs/deploy.md) — rilasci di routine, verifiche, rollback, comandi
- [docs/dns-migration.md](docs/dns-migration.md) — DNS, posta e dominio: com'è configurato oggi e cosa fare se si rompe
- [docs/seo.md](docs/seo.md) — SEO e motori generativi: cosa fa il sito da solo e cosa va fatto sui servizi esterni
- [docs/analytics.md](docs/analytics.md) — visite e provenienza: i link `/go/<canale>` da distribuire
