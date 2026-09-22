# DNS, posta e dominio — stato e manutenzione

Migrazione completata. Questo documento descrive **com'è configurato oggi**
viosadea.com e cosa fare se qualcosa va storto. Lo storico della migrazione da
Netsons è in fondo.

## Stato attuale (22/09/2026)

| Pezzo | Dove |
|---|---|
| Registrar del dominio | Netsons (PublicDomainRegistry), scadenza **14/02/2027** — solo dominio, hosting disdetto |
| DNS autoritativi | **Cloudflare** (`anastasia`/`plato.ns.cloudflare.com`), zona `viosadea.com` Active |
| Sito | Worker **`viosadea`** su `www.viosadea.com` e `viosadea.com` (Custom Domain) |
| Posta in **arrivo** `@viosadea.com` | **Cloudflare Email Routing**, catch-all → `viosadea@gmail.com` |
| Posta in **uscita** dal sito | **Brevo** (API transazionale), mittente `no-reply@viosadea.com` |
| Vecchio hosting Netsons (WordPress + caselle cPanel) | **disdetto**, nessun record DNS punta più a `46.252.148.112` |

Non esiste più alcuna casella IMAP/POP sul dominio: chi scrive a un indirizzo
`@viosadea.com` (qualsiasi nome, è un catch-all) finisce su Gmail. Per rispondere
usando un indirizzo del dominio servirebbe configurare "Invia come" in Gmail con
un SMTP (es. Brevo): oggi non è impostato.

## Record DNS della zona

Questi sono tutti i record: se ne trovi altri che puntano a un IP, verifica prima
di lasciarli.

| Tipo | Nome | Contenuto | A cosa serve |
|---|---|---|---|
| AAAA | `viosadea.com`, `www` | `100::` (proxy) | Creati e gestiti dal Custom Domain del Worker: **non toccare** |
| MX | `viosadea.com` | `route1/2/3.mx.cloudflare.net` | Email Routing (posta in arrivo) |
| TXT | `viosadea.com` | `v=spf1 include:_spf.mx.cloudflare.net ~all` | SPF dell'inoltro Cloudflare |
| TXT | `viosadea.com` | `brevo-code:14b6a9…` | Verifica del dominio su Brevo |
| TXT | `viosadea.com` | `google-site-verification=9VNW7k…` | Google Search Console |
| TXT | `mail._domainkey` | `k=rsa;p=MIGf…` | **DKIM Brevo** — senza questo le email del modulo finiscono in spam |
| TXT | `cf2024-1._domainkey` | `v=DKIM1; …` | DKIM di Cloudflare Email Routing |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` | DMARC (uno solo) |

Brevo non richiede un `include` SPF: autentica il dominio con DKIM.

## Verifiche rapide

Impostazioni della zona da tenere così: *SSL/TLS → Edge Certificates →* **Always
Use HTTPS attivo** (senza, l'apex rispondeva in chiaro su http://) e la Redirect
Rule *apex → www* creata da template (*Rules → Redirect Rules*).

```sh
curl -sI http://viosadea.com/ | grep -i location        # → https://…
curl -sI https://www.viosadea.com/ | head -1            # 200 dal Worker
curl -sI https://viosadea.com/ | grep -i location       # → https://www.viosadea.com/
dig +short MX viosadea.com                              # solo route*.mx.cloudflare.net
dig +short TXT viosadea.com                             # SPF + brevo-code + google
dig +short TXT mail._domainkey.viosadea.com             # DKIM Brevo presente
dig +short A qualsiasi.viosadea.com                     # vuoto (niente wildcard)
```

Prova funzionale completa: invia una richiesta dal modulo su
`https://www.viosadea.com/contatti/` (deve arrivare a `viosadea@gmail.com`) e una
mail a un indirizzo `@viosadea.com` (deve arrivare sulla stessa casella).

## Se qualcosa non va

- **Email del modulo non arrivano** → `npm run cf:logs` e cerca `[richiesta]`;
  controlla Brevo → *Transactional → Logs* e che "Block unknown IP addresses" sia
  disattivato (il Worker non ha IP fissi).
- **Email del modulo in spam** → verifica `mail._domainkey`, `_dmarc` e che il
  dominio risulti *Authenticated* su Brevo.
- **Posta in arrivo non inoltrata** → dashboard → *Email → Email Routing*: regola
  catch-all attiva e indirizzo `viosadea@gmail.com` verificato.
- **Sito irraggiungibile dopo un deploy** → `npm run cf:deployments` e rollback
  (vedi [`deploy.md`](deploy.md)).
- **Certificato/apex** → i record AAAA `100::` sono placeholder del Custom Domain:
  se vengono cancellati, ricreare il Custom Domain con `npm run deploy`.

## Rinnovo del dominio

Il dominio resta registrato su Netsons anche dopo la disdetta dell'hosting:
controlla che il **rinnovo automatico del dominio** sia attivo e che i contatti
email dell'area clienti siano validi. I nameserver devono restare quelli di
Cloudflare: modifiche al Zone Editor di Netsons non hanno più alcun effetto.

---

## Storico

1. **15/09/2026** — zona aggiunta su Cloudflare importando i record Netsons
   (WordPress su `46.252.148.112`, posta su cPanel), nameserver cambiati da
   `dns1`–`dns4.netsons.net` ai due di Cloudflare.
2. **Posta** — passata a Cloudflare Email Routing (catch-all → `viosadea@gmail.com`),
   le caselle cPanel non ricevono più.
3. **22/09/2026 — cutover del sito**: eliminati A `viosadea.com` e CNAME `www`,
   `routes` scommentato in `wrangler.jsonc` e deploy → Custom Domain su apex e www.
4. **22/09/2026 — pulizia**: rimossi il wildcard `*`, i CNAME/SRV di cPanel
   (`webmail`, `cpanel`, `whm`, `webdisk`, `ftp`, `ssh`, `git`, `autodiscover`,
   `autoconfig`, `_caldav*`, `_carddav*`, `_autodiscover`), il DKIM cPanel
   `default._domainkey` e l'`ip4:46.252.148.112` dallo SPF.
5. **22/09/2026** — Redirect Rule apex → www (301, query preservata) e
   *Always Use HTTPS* attivato sulla zona.
6. **Disdetta dell'hosting Netsons** (solo hosting, non il dominio).

Rollback al vecchio WordPress non più possibile: dopo la disdetta i file non
esistono più (resta solo il backup scaricato prima della chiusura).
