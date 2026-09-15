# Migrazione DNS da Netsons a Cloudflare

Obiettivo: servire il **sito** dal Worker Cloudflare lasciando la **posta** dov'è
(cPanel Netsons). Si sposta solo la gestione DNS; il registrar può restare Netsons.

## Stato attuale (rilevato il 14/09/2026)

| Tipo | Nome | Valore | Note |
|---|---|---|---|
| NS | viosadea.com | dns1–dns4.netsons.net | da sostituire con i NS Cloudflare |
| A | viosadea.com | 46.252.148.112 | WordPress → diventerà il Worker |
| CNAME/A | www | viosadea.com / 46.252.148.112 | → Worker |
| MX | viosadea.com | 0 mail.viosadea.com | **conservare** |
| A | mail | 46.252.148.112 | **conservare, DNS only** |
| A/CNAME | cpanel, webmail, ftp, autodiscover | 46.252.148.112 / cpanel.viosadea.com | **conservare, DNS only** |
| TXT | viosadea.com | `v=spf1 +a +mx ~all` | **da modificare** (vedi sotto) |
| TXT | viosadea.com | `google-site-verification=9VNW7k…` | conservare (Search Console) |
| TXT | viosadea.com | `brevo-code:14b6a9…` | conservare (Brevo) |
| TXT | default._domainkey | DKIM cPanel | conservare |
| TXT | mail._domainkey | DKIM | conservare |
| TXT | _dmarc | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` | conservare |

Prima di iniziare esporta la zona completa dal pannello Netsons (DNS Zone Editor)
e confrontala con questa tabella: potrebbero esserci record non interrogabili
dall'esterno (altri selettori DKIM, SRV, sottodomini).

## Passi

1. **Deploy di prova** su workers.dev e revisione del sito (mobile e desktop).
2. **Aggiungi la zona** `viosadea.com` a Cloudflare (piano Free). Cloudflare
   importa i record: verifica riga per riga con la tabella sopra.
   - `mail`, `cpanel`, `webmail`, `ftp`, `autodiscover` devono essere
     **DNS only (nuvola grigia)**: la posta non passa dal proxy.
3. **Correggi SPF** già nella nuova zona. Con l'apex puntato a Cloudflare, `+a`
   non autorizzerebbe più il server Netsons:
   ```
   v=spf1 ip4:46.252.148.112 mx include:spf.brevo.com ~all
   ```
   Email Sending di Cloudflare (step 6 di `setup-cloudflare.md`) aggiunge i propri
   record SPF/DKIM/MX su `cf-bounce.viosadea.com`, quindi l'SPF della radice non
   va toccato per lui. ⚠️ Non creare un secondo `_dmarc`: tieni quello esistente.
4. **Cambia i nameserver** dal pannello Netsons (dominio → Nameserver) con i due
   NS assegnati da Cloudflare. Attendi lo stato **Active** (minuti–24h).
5. **Cutover web**: in `wrangler.jsonc` scommenta `routes` e `npm run deploy`,
   oppure dal dashboard *Workers → viosadea → Settings → Domains & Routes → Add
   Custom Domain* per `www.viosadea.com` e `viosadea.com`. Accetta la sostituzione
   dei record A/CNAME esistenti (solo apex e www).
6. **Redirect apex → www**: dashboard → Rules → Redirect Rules → template
   "Redirect from root to WWW" (301, preserva path e query). Il canonical del
   sito è `https://www.viosadea.com`, come prima, così i ranking restano.
7. **Verifiche**:
   ```sh
   dig +short NS viosadea.com      # NS Cloudflare
   dig +short MX viosadea.com      # 0 mail.viosadea.com
   dig +short mail.viosadea.com    # 46.252.148.112
   dig +short TXT viosadea.com     # SPF aggiornato + verifiche
   curl -sI https://viosadea.com/ | grep -i location          # → https://www.viosadea.com/
   curl -sI https://www.viosadea.com/en/privacy-cookie-policy/ # 301 → /en/privacy/
   ```
   Invia e ricevi un'email di prova sulla casella del dominio.
8. **Hosting Netsons**: tienilo attivo finché la posta resta su cPanel. WordPress
   si può disattivare (o eliminare) dopo qualche giorno di verifica: il sito non
   lo usa più.
