# SEO e motori generativi (GEO)

Cosa fa già il sito, cosa va fatto fuori dal codice e cosa controllare ogni tanto.

## Nel sito (automatico)

| Cosa | Dove | Note |
|---|---|---|
| `title`, `description`, canonical, Open Graph | `src/components/BaseHead.astro` | i testi per pagina stanno in `src/content/pages/<lang>.ts` |
| `hreflang` + `x-default` su ogni pagina | `BaseHead.astro` + `src/i18n/routes.ts` | 5 lingue con slug localizzati |
| Sitemap con alternate per lingua | `astro.config.mjs` (`@astrojs/sitemap`) | `/sitemap-index.xml`, `lastmod` dall'ultimo commit |
| Sitemap delle immagini | `src/pages/sitemap-images.xml.ts` | foto della galleria con didascalia nella lingua della pagina |
| `robots.txt` | `public/robots.txt` | ammette esplicitamente i crawler AI, dichiara le due sitemap |
| Dati strutturati (`VacationRental`, `FAQPage`, `BreadcrumbList`) | `src/lib/jsonld.ts` | indirizzo, coordinate, servizi, CIN/CIPAT, lingue parlate, link a Booking/Airbnb e ai portali locali |
| `/llms.txt` | `src/pages/llms.txt.ts` | riassunto fattuale in Markdown per ChatGPT, Claude, Perplexity — generato dai dati, non da aggiornare a mano |
| Ping IndexNow a ogni deploy | `scripts/indexnow.mjs` + workflow | avvisa Bing e Yandex; Google non aderisce |

Il testo delle pagine è la materia prima sia per Google sia per le AI: risposte
dirette e concrete (distanze, prezzi, regole su animali e parcheggio) vengono
citate molto più volentieri di frasi promozionali.

## Da fare/controllare fuori dal codice

1. **Cloudflare non deve bloccare i crawler AI.** Fatto il 22/09/2026: dashboard →
   *Security → Settings → Configure AI bot policies*, le tre categorie (**Search**,
   **Agent**, **Training**) sono tutte su *Allow (do not block)*. Prima *Training*
   era su *Disallow* e GPTBot e ClaudeBot ricevevano 403. Se un giorno il sito
   sparisce dalle risposte delle AI, ricontrolla qui per primo. Verifica:
   ```sh
   curl -s -o /dev/null -w '%{http_code}\n' -A "Mozilla/5.0 (compatible; GPTBot/1.1; +https://openai.com/gptbot)" https://www.viosadea.com/
   curl -s -o /dev/null -w '%{http_code}\n' -A "Mozilla/5.0 (compatible; ClaudeBot/1.0)" https://www.viosadea.com/
   ```
   Devono rispondere `200` (vale anche per `OAI-SearchBot`, `PerplexityBot`,
   `meta-externalagent`).
2. **Google Search Console** → proprietà `www.viosadea.com`, invia
   `sitemap-index.xml` e `sitemap-images.xml`, poi *Controllo URL → Richiedi
   indicizzazione* per la home.
3. **Bing Webmaster Tools** (<https://www.bing.com/webmasters>): importa da Search
   Console. Conta doppio, perché l'indice di Bing alimenta Copilot e la ricerca di
   ChatGPT.
4. **Google Business Profile**: scheda dell'attività su Maps, con link al sito,
   foto, categoria "Appartamento con servizi alberghieri" e attributi (animali
   ammessi, parcheggio gratuito). È la leva più forte per chi cerca dalla zona.
5. **Link in entrata**: sito del consorzio (`fassa.com`), Dolomiti Superski,
   Booking e Airbnb devono puntare a `https://www.viosadea.com` (non al vecchio
   dominio o a URL `workers.dev`).

## Verifiche rapide

```sh
curl -s https://www.viosadea.com/robots.txt
curl -s https://www.viosadea.com/llms.txt | head -20
curl -s https://www.viosadea.com/sitemap-index.xml
npm run indexnow          # richiede una build in dist/ (npm run build)
```

Dati strutturati: <https://search.google.com/test/rich-results> su
`https://www.viosadea.com/` (deve trovare `VacationRental` e `FAQPage`).

> Non aggiungiamo `aggregateRating` nei dati strutturati con i voti di Booking e
> Airbnb: sono recensioni raccolte da terzi e Google considera abuso dichiararle
> come proprie. I voti restano nel testo delle pagine, con la fonte.
