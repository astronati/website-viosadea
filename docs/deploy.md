# Rilasci — deploy del Worker

Come si pubblica una nuova versione **dopo** il [primo setup](setup-cloudflare.md).
Due percorsi, usabili entrambi, che eseguono lo stesso
`wrangler deploy --config dist/server/wrangler.json`:

1. **Push su `main` → GitHub Actions** — il rilascio canonico
   ([`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml)).
2. **Da terminale** — `npm run deploy`: per hotfix, anteprime, o se GitHub non è
   disponibile.

## Prima di rilasciare

```sh
nvm use
npm run check          # type-check: errori TS e chiavi di traduzione mancanti
npm run deploy:dry     # build completa + verifica del bundle, senza pubblicare
```

Anteprima del Worker buildato (modulo incluso, chiavi Turnstile di test):

```sh
cp -n .dev.vars.example .dev.vars
npm run preview        # http://localhost:8787
```

> ⚠️ **Ferma `npm run dev` prima di `build`/`preview`/`deploy`** (`npx astro dev stop`):
> la build riscrive la cache di Vite in `node_modules/.vite` e il dev server in
> esecuzione si rompe ("file does not exist in the optimize deps directory").
> Se succede: `npx astro dev stop && rm -rf node_modules/.vite && npm run dev`.

## Rilascio con GitHub (consigliato)

```sh
git add -A
git commit -m "Descrizione della modifica"
git push
```

Segui l'esito in *GitHub → Actions → Deploy to Cloudflare*. Ogni versione su
Cloudflare riporta lo SHA del commit (`--message "deploy <sha>"`).

## Rilascio da terminale

```sh
nvm use
source .envrc          # o direnv: le credenziali dell'account DEDICATO
npm run cf:whoami      # ⚠️ controlla l'Account ID prima di pubblicare
npm run deploy
```

## Dopo il rilascio
- Apri la home e una pagina interna in un'altra lingua.
- Invia una richiesta di prova dal modulo e verifica l'arrivo su viosadea@gmail.com.
- Log in tempo reale del Worker: `npm run cf:logs`.

## Versioni e rollback

```sh
npm run cf:deployments                  # elenco versioni pubblicate (con SHA)
npx wrangler rollback --name viosadea   # torna alla versione precedente
```

Oppure ripubblica da un commit buono: `git checkout <sha> && npm run deploy`
(poi `git checkout main`), o fai `git revert` e push.

## Comandi utili

| Comando | Cosa fa |
|---|---|
| `npm run dev` | sviluppo su http://localhost:4321 (grafica e testi; il modulo contatti **non** si prova qui) |
| `npm run check` | type-check |
| `npm run deploy:dry` | build + deploy simulato |
| `npm run preview` | build + Worker locale su :8787 — **qui si prova il modulo contatti** (Turnstile di test, email simulata) |
| `npm run deploy` | build + pubblicazione |
| `npm run cf:whoami` | account Cloudflare attivo |
| `npm run cf:logs` | log live del Worker |
| `npm run cf:deployments` | versioni pubblicate |
| `npm run cf:secret:turnstile` | imposta/ruota il secret Turnstile |
| `npm run cf:email:enable` | abilita Email Sending su viosadea.com (una tantum, zona Active) |
| `npm run cf:email:dns` | stato dei record DNS di Email Sending |
| `npm run import:photos` | riscarica le foto dal vecchio WordPress (già eseguito, una tantum) |

## Cosa cambiare dove
- **Testi, foto, dati della struttura**: vedi la tabella nel [README](../README.md).
- **Destinatario delle richieste**: `CONTACT_TO` in `wrangler.jsonc` → rilascia.
- **Chiave Turnstile ruotata**: site key in `src/consts.ts` + `npm run cf:secret:turnstile` → rilascia.
