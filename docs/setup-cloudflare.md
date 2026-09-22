# Primo setup — Cloudflare e Brevo (una tantum)

Passi da fare **una volta sola**, in ordine, per portare online viosadea.com come
**Worker Cloudflare con static assets**. Dopo, i rilasci sono un comando o un push:
vedi [`deploy.md`](deploy.md).

Valori di questo progetto: Worker **`viosadea`**, dominio **`viosadea.com`**
(canonico `https://www.viosadea.com`), email richieste **`viosadea@gmail.com`**.

## Come funziona
- Le pagine sono **prerenderizzate** (statiche). Solo `/api/richiesta` (modulo
  contatti) gira on-demand nel Worker (`prerender = false`).
- Il modulo è protetto da **Cloudflare Turnstile** e invia l'email con l'API
  transazionale di **Brevo** (piano gratuito).
- L'adapter `@astrojs/cloudflare` genera a build time il config deployabile
  `dist/server/wrangler.json`, usato da tutti gli script.
- Tutto funziona sul piano **Free** di Cloudflare.

| Configurazione | Dove | Tipo |
|---|---|---|
| `CONTACT_TO` destinatario richieste (`viosadea@gmail.com`) | `wrangler.jsonc` → `vars` | pubblica |
| `MAIL_FROM` mittente (`no-reply@viosadea.com`, mittente attivo su Brevo) | `wrangler.jsonc` → `vars` | pubblica |
| `BREVO_API_KEY` | `npm run cf:secret:brevo` | **segreto** sul Worker |
| `TURNSTILE_SECRET` | `npm run cf:secret:turnstile` | **segreto** sul Worker |
| Site key Turnstile | `src/consts.ts` → `turnstileSiteKey` | pubblica |
| Token Web Analytics (opzionale) | `src/consts.ts` → `cfBeaconToken` | pubblica |
| Credenziali deploy | `.envrc` (locale) / secrets GitHub (CI) | **segreto** |

## Checklist

- [x] 1. Account Cloudflare dedicato
- [x] 2. Account ID + API token → `.envrc`
- [x] 3. Primo deploy su `workers.dev`
- [x] 4. Turnstile (anti-spam del modulo)
- [x] 5. Brevo: API key e test del modulo
- [x] 6. Dominio su Cloudflare (migrazione DNS da Netsons)
- [x] 7. Collegamento del dominio al Worker
- [x] 8. GitHub Actions
- [ ] 9. Web Analytics + Google Search Console

> Setup completato il 22/09/2026: il sito è online su `https://www.viosadea.com`.
> Questi passi restano come riferimento (rifare l'account, rigenerare il token,
> capire com'è messo insieme il tutto). Configurazione corrente del DNS e della
> posta: [`dns-migration.md`](dns-migration.md).

Brevo (step 5) non dipende dal DNS: il modulo si può attivare e provare già su
`workers.dev`, prima della migrazione.

---

## 1. Account Cloudflare dedicato
Crea un account su <https://dash.cloudflare.com/sign-up> dedicato alla struttura
(es. con `viosadea@gmail.com`), come per attidiati. Piano **Free**.

Nel dashboard: *Workers & Pages* → scegli il sottodominio `workers.dev` dell'account
(es. `viosadea`): il sito di prova sarà `https://viosadea.<sottodominio>.workers.dev`.

## 2. Account ID + API token → `.envrc`
- **Account ID**: dashboard → *Workers & Pages* → colonna di destra.
- **API token**: *My Profile → API Tokens → Create Token → Custom token*:
  - *Account* → **Workers Scripts: Edit**
  - *Account* → **Workers KV Storage: Edit** (l'adapter crea un KV `SESSION` al primo deploy)
  - *Zone* → **Workers Routes: Edit**, **DNS: Edit** — *Zone Resources*: `viosadea.com`
    (se la zona non esiste ancora, aggiungi questi permessi modificando il token dopo lo step 6).
    Aggiungi anche *Zone* → **Dynamic Redirect: Edit** se vuoi gestire da API la
    Redirect Rule apex → www.

Salva le credenziali **solo** nel file locale `.envrc` (git-ignored):

```sh
cp .envrc.example .envrc     # poi compila CLOUDFLARE_ACCOUNT_ID e CLOUDFLARE_API_TOKEN
direnv allow                 # carica/scarica le variabili entrando/uscendo dalla cartella
                             # (senza hook direnv nella shell: `source .envrc` in ogni terminale)
npm run cf:whoami            # ⚠️ DEVE mostrare l'Account ID dell'account dedicato
```

> ⚠️ Se `.envrc` non è caricato, wrangler usa il login OAuth personale e
> **deploya sull'account sbagliato**. Controlla sempre `npm run cf:whoami`.
> Hook direnv per zsh (una volta): `echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc`.

## 3. Primo deploy su `workers.dev`
Il Worker **nasce con il primo deploy**, non va creato a mano. Il blocco `routes`
in `wrangler.jsonc` va tenuto **commentato** finché la zona non è Active (step 6),
altrimenti il deploy fallisce; oggi è attivo perché il dominio è collegato.

```sh
nvm use
npm ci
npm run check        # type-check (anche traduzioni mancanti)
npm run deploy       # astro build && wrangler deploy --config dist/server/wrangler.json
```

Apri l'URL `workers.dev` stampato a fine deploy e rivedi il sito su telefono.

> Dopo il cutover l'URL `workers.dev` è stato **disattivato**
> (`"workers_dev": false` e `"preview_urls": false` in `wrangler.jsonc`): il sito
> risponde solo sul dominio, così non esiste una copia pubblica indicizzabile. Per
> provare le modifiche prima di pubblicare si usa `npm run preview` (Worker locale).
> Per riattivarlo temporaneamente: rimetti `true` e `npm run deploy`.
Finché non completi lo step 5 il modulo contatti risponde con errore e invita a
usare WhatsApp: è previsto.

## 4. Turnstile (anti-spam del modulo)
1. Dashboard → **Turnstile → Add widget**: nome `viosadea`, modalità **Managed**,
   hostname: `viosadea.com`, `www.viosadea.com`, `viosadea.<sottodominio>.workers.dev`.
2. **Site key** → `turnstileSiteKey` in [`../src/consts.ts`](../src/consts.ts)
   (sostituisce la chiave di test `1x00000000000000000000AA`, che fa passare tutti).
3. **Secret key** → sul Worker (una volta, persiste tra i deploy):
   ```sh
   npm run cf:secret:turnstile      # incolla il secret quando richiesto
   ```
4. `npm run deploy`.

In locale `.dev.vars` usa le chiavi di test "passa sempre" (`.dev.vars.example`).

## 5. Brevo: API key e test del modulo
Il dominio `viosadea.com` risulta già collegato a un account Brevo (record
`brevo-code` e DKIM `mail._domainkey` nel DNS). Serve accedere a **quell'account**.

1. **Dominio autenticato**: Brevo → *Senders, Domains & Dedicated IPs → Domains*:
   `viosadea.com` deve risultare **Authenticated**. Se non lo è, segui la procedura
   di Brevo: aggiungerà/controllerà `brevo-code` e il DKIM. Se il DNS è già su
   Cloudflare, i record vanno inseriti lì.
   Il mittente `MAIL_FROM` (`no-reply@viosadea.com`) deve essere tra i mittenti
   attivi in *Senders, Domains & Dedicated IPs → Senders* (oggi ci sono
   `info@viosadea.com` e `no-reply@viosadea.com`). Per cambiarlo, aggiungilo prima lì.
2. **API key**: Brevo → *SMTP & API → API Keys → Generate a new API key* (nome
   `viosadea-worker`). Salvala sul Worker:
   ```sh
   npm run cf:secret:brevo          # incolla la chiave quando richiesto
   ```
3. ⚠️ **IP autorizzati**: Brevo può bloccare le chiamate API da IP sconosciuti e
   attiva il blocco da solo dopo 30 giorni senza IP nuovi. Il Worker Cloudflare
   **non ha IP fissi**, quindi il modulo smetterebbe di funzionare. In Brevo →
   *Settings → Security → Authorized IPs* lascia **disattivato** "Block unknown IP
   addresses". Se Brevo manda un'email di IP bloccato, disattivalo di nuovo.
4. **Test** (nessun nuovo deploy necessario: i segreti sono già sul Worker):
   - invia una richiesta dal modulo (`https://www.viosadea.com/contatti/`, oppure
     `workers.dev` prima del cutover);
   - deve arrivare a **viosadea@gmail.com** con oggetto `Richiesta gg/mm/aaaa → …`;
     "Rispondi" scrive direttamente all'ospite. La prima volta controlla lo spam.
   - Se non arriva: `npm run cf:logs`, riprova e cerca le righe `[richiesta]`
     (l'errore riporta codice e messaggio di Brevo, es. chiave errata o mittente non valido).
   - In Brevo → *Transactional → Logs* vedi ogni email inviata.

Limiti del piano gratuito Brevo: **300 email al giorno**, più che sufficienti per
un modulo contatti. Per cambiare destinatario: `CONTACT_TO` in `wrangler.jsonc` →
`npm run deploy`.

## 6. Dominio su Cloudflare
Fatto: la zona `viosadea.com` è Active su Cloudflare e i nameserver sono i suoi.
Stato dei record, posta e verifiche: **[`dns-migration.md`](dns-migration.md)**.

La posta in arrivo è gestita da **Cloudflare Email Routing** (catch-all →
`viosadea@gmail.com`), non più dalle caselle cPanel di Netsons: gli MX puntano a
`route1/2/3.mx.cloudflare.net` e non vanno cambiati.

## 7. Collegamento del dominio al Worker
Cloudflare **non** crea un Custom Domain su un nome che ha già un record DNS.
Procedura completa in [`dns-migration.md`](dns-migration.md) step 5, in breve:

1. *DNS → Records*: **elimina** il record A `viosadea.com` e il CNAME `www` (il
   vecchio WordPress). MX e TXT restano.
2. In `wrangler.jsonc` tieni attivo `routes` → `npm run deploy`
   (oppure dashboard: *Workers & Pages → viosadea → Settings → Domains & Routes →
   Add → Custom Domain* per `www.viosadea.com` e `viosadea.com`).
3. **Redirect apex → www** (unica cosa che il deploy non crea da solo):
   *Rules → Redirect Rules → Create rule* — Wildcard pattern
   `https://viosadea.com/*` → `https://www.viosadea.com/${1}`, 301, *Preserve query
   string* attivo.
4. Verifiche finali: [`dns-migration.md`](dns-migration.md) → "Verifiche rapide".

## 8. GitHub Actions
Il workflow [`../.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)
deploya a ogni push su `main` (e con *Run workflow* manuale). Repository:
`astronati/website-viosadea`.

1. *Repo → Settings → Secrets and variables → Actions → New repository secret*:
   | Secret | Valore |
   |---|---|
   | `CLOUDFLARE_API_TOKEN` | lo stesso token di `.envrc` |
   | `CLOUDFLARE_ACCOUNT_ID` | lo stesso Account ID |
2. *Actions → Deploy to Cloudflare → Run workflow* per il primo giro (o un push su `main`).

`BREVO_API_KEY` e `TURNSTILE_SECRET` **non** vanno su GitHub: vivono sul Worker.

## 9. Web Analytics + Google Search Console
- **Web Analytics** (senza cookie, nessun banner): dashboard → *Analytics & Logs →
  Web Analytics → Add a site* → `www.viosadea.com`.
- **Search Console**: la proprietà `viosadea.com` è già verificata via TXT
  (`google-site-verification`, conservato nella migrazione). *Sitemaps* → invia
  `sitemap-index.xml`. Poi aggiorna il link al sito su Booking.com, Airbnb e
  Google Business Profile.
