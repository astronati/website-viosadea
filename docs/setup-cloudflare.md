# Primo setup — Cloudflare (una tantum)

Passi da fare **una volta sola**, in ordine, per portare online viosadea.com come
**Worker Cloudflare con static assets**. Dopo, i rilasci sono un comando o un push:
vedi [`deploy.md`](deploy.md).

Valori di questo progetto: Worker **`viosadea`**, dominio **`viosadea.com`**
(canonico `https://www.viosadea.com`), email richieste **`viosadea@gmail.com`**.

## Come funziona
- Le pagine sono **prerenderizzate** (statiche). Solo `/api/richiesta` (modulo
  contatti) gira on-demand nel Worker (`prerender = false`).
- L'adapter `@astrojs/cloudflare` genera a build time il config deployabile
  `dist/server/wrangler.json`, usato da tutti gli script.
- L'infrastruttura è config-as-code: [`../wrangler.jsonc`](../wrangler.jsonc)
  (Worker, domini, binding email, variabili) e [`../astro.config.mjs`](../astro.config.mjs).

| Configurazione | Dove | Tipo |
|---|---|---|
| `CONTACT_TO` destinatario richieste | `wrangler.jsonc` → `vars` | pubblica |
| `MAIL_FROM` mittente (`richieste@viosadea.com`) | `wrangler.jsonc` → `vars` + `allowed_sender_addresses` | pubblica |
| `TURNSTILE_SECRET` | `npm run cf:secret:turnstile` | **segreto** sul Worker |
| Site key Turnstile | `src/consts.ts` → `turnstileSiteKey` | pubblica |
| Token Web Analytics (opzionale) | `src/consts.ts` → `cfBeaconToken` | pubblica |
| Credenziali deploy | `.envrc` (locale) / secrets GitHub (CI) | **segreto** |

## Checklist

- [ ] 1. Account Cloudflare dedicato
- [ ] 2. Account ID + API token → `.envrc`
- [ ] 3. Primo deploy su `workers.dev`
- [ ] 4. Turnstile (anti-spam del modulo)
- [ ] 5. Dominio su Cloudflare (migrazione DNS da Netsons)
- [ ] 6. Email Sending + test del modulo
- [ ] 7. Collegamento del dominio al Worker
- [ ] 8. GitHub Actions
- [ ] 9. Web Analytics + Google Search Console

---

## 1. Account Cloudflare dedicato
Crea un account su <https://dash.cloudflare.com/sign-up> dedicato alla struttura
(es. con `viosadea@gmail.com`), come fatto per attidiati. Piano **Free**.

Nel dashboard: *Workers & Pages* → scegli il sottodominio `workers.dev` dell'account
(es. `viosadea`): il sito di prova sarà `https://viosadea.<sottodominio>.workers.dev`.

## 2. Account ID + API token → `.envrc`
- **Account ID**: dashboard → *Workers & Pages* → colonna di destra.
- **API token**: *My Profile → API Tokens → Create Token → Custom token*:
  - *Account* → **Workers Scripts: Edit**
  - *Account* → **Workers KV Storage: Edit** (l'adapter crea un KV `SESSION` al primo deploy)
  - *Account* → **Email Sending: Edit** (per `npm run cf:email:*`)
  - *Zone* → **Workers Routes: Edit**, **DNS: Edit** — *Zone Resources*: `viosadea.com`
    (se la zona non esiste ancora, aggiungi questi permessi modificando il token dopo lo step 5)

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
in `wrangler.jsonc` resta **commentato** finché la zona non è Active (step 5),
altrimenti il deploy fallisce.

```sh
nvm use
npm ci
npm run check        # type-check (anche traduzioni mancanti)
npm run deploy       # astro build && wrangler deploy --config dist/server/wrangler.json
```

Apri l'URL `workers.dev` stampato a fine deploy e rivedi il sito su telefono.
Fino allo step 6 il modulo contatti risponde con errore e invita a usare WhatsApp:
è previsto (l'invio email non è ancora attivo).

## 4. Turnstile (anti-spam del modulo)
1. Dashboard → **Turnstile → Add widget**: nome `viosadea`, modalità **Managed**,
   hostname: `viosadea.com`, `www.viosadea.com`, `viosadea.<sottodominio>.workers.dev`.
2. **Site key** → `turnstileSiteKey` in [`../src/consts.ts`](../src/consts.ts)
   (sostituisce la chiave di test `1x00000000000000000000AA`).
3. **Secret key** → sul Worker (una volta, persiste tra i deploy):
   ```sh
   npm run cf:secret:turnstile      # incolla il secret quando richiesto
   ```
4. `npm run deploy`.

In locale `.dev.vars` usa le chiavi di test "passa sempre" (`.dev.vars.example`).

## 5. Dominio su Cloudflare
Segui **[`dns-migration.md`](dns-migration.md)**: aggiunta della zona, verifica dei
record importati (la posta resta su Netsons), SPF, cambio nameserver da Netsons.
Attendi lo stato **Active** della zona prima di continuare.

## 6. Email Sending + test del modulo
Serve la zona Active su Cloudflare ("You must be using Cloudflare DNS").

```sh
npm run cf:email:enable     # wrangler email sending enable viosadea.com
npm run cf:email:dns        # mostra i record richiesti e il loro stato
```

(In alternativa: dashboard → *Compute & AI → Email Service → Email Sending →
Onboard Domain*.)

L'onboarding aggiunge record sul sottodominio **`cf-bounce.viosadea.com`** (MX per
i bounce, SPF, DKIM): **non tocca gli MX della radice**, la posta Netsons continua
a funzionare.

> ⚠️ **DMARC**: Cloudflare propone anche un TXT su `_dmarc.viosadea.com`, ma il
> dominio ne ha già uno (`v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com`).
> Deve esistercene **uno solo**: tieni quello esistente e non crearne un secondo
> (due record DMARC invalidano entrambi).

Test:
1. Invia una richiesta dal modulo su `workers.dev` (o sul dominio).
2. Deve arrivare a **viosadea@gmail.com** con oggetto `Richiesta gg/mm/aaaa → …`;
   "Rispondi" scrive direttamente all'ospite. La prima volta controlla lo spam e
   segna "Non è spam".
3. Se non arriva: `npm run cf:logs` e riprova — cerca le righe `[richiesta]`.

Per cambiare destinatario: `CONTACT_TO` in `wrangler.jsonc` → `npm run deploy`.
Gli account nuovi partono con una quota giornaliera prudente che cresce nel
tempo: ampiamente sufficiente per un modulo contatti.

## 7. Collegamento del dominio al Worker
1. In `wrangler.jsonc` **scommenta** il blocco `routes` (`www.viosadea.com` e
   `viosadea.com`) → `npm run deploy`.
   In alternativa dal dashboard: *Workers & Pages → viosadea → Settings → Domains &
   Routes → Add → Custom Domain*. Se chiede di sostituire record A/CNAME esistenti
   (il vecchio WordPress) → conferma.
2. Tocca **solo** apex e `www`. MX, `mail`, `cpanel`, TXT/DKIM/DMARC restano come sono.
3. **Redirect apex → www**: *Rules → Redirect Rules → template "Redirect from root
   to WWW"* (301, conserva path e query).
4. Verifiche finali: vedi [`dns-migration.md`](dns-migration.md) step 7.

## 8. GitHub Actions
Il workflow [`../.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)
deploya a ogni push su `main` (e con *Run workflow* manuale).

1. Su GitHub crea un repository **privato** vuoto (es. `viosadea`), senza README.
2. Dalla cartella del progetto:
   ```sh
   git add -A && git commit -m "Sito Astro Cèsa Viosadea"
   git remote add origin git@github.com:<utente>/viosadea.git
   git push -u origin main
   ```
3. *Repo → Settings → Secrets and variables → Actions → New repository secret*:
   | Secret | Valore |
   |---|---|
   | `CLOUDFLARE_API_TOKEN` | lo stesso token di `.envrc` |
   | `CLOUDFLARE_ACCOUNT_ID` | lo stesso Account ID |
4. *Actions → Deploy to Cloudflare → Run workflow* per il primo giro.

`TURNSTILE_SECRET` **non** va su GitHub: vive sul Worker (step 4).

## 9. Web Analytics + Google Search Console
- **Web Analytics** (senza cookie, nessun banner): dashboard → *Analytics & Logs →
  Web Analytics → Add a site* → `www.viosadea.com`. Con il sito sul dominio proxato
  l'iniezione è automatica.
- **Search Console**: la proprietà `viosadea.com` è già verificata via TXT
  (`google-site-verification`, conservato nella migrazione). *Sitemaps* → invia
  `sitemap-index.xml`. Poi aggiorna il link al sito su Booking.com, Airbnb e
  Google Business Profile.
