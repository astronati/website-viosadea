# Migrazione DNS da Netsons a Cloudflare

Obiettivo: servire il **sito** dal Worker Cloudflare lasciando la **posta** dov'è
(cPanel Netsons). Si sposta solo la gestione DNS (i nameserver): registrar,
rinnovo del dominio e hosting email restano su Netsons.

Regola d'oro: **il sito passa da Cloudflare, tutto il resto va "DNS only" (nuvola
grigia) e continua a puntare al server Netsons `46.252.148.112`.**

## Stato attuale (letto dai DNS autoritativi Netsons il 15/09/2026)

- Registrar: PublicDomainRegistry tramite Netsons, scadenza 14/02/2027 (il rinnovo resta su Netsons).
- Nameserver: `dns1`–`dns4.netsons.net`.
- **DNSSEC: non attivo** (nessun record DS) → niente da disabilitare prima del cambio.
- Certificato Let's Encrypt di cPanel valido per `viosadea.com`, `www`, `mail`, `webmail`,
  `cpanel`, `autodiscover`, `autoconfig`, `cpcalendars`, `cpcontacts`, `webdisk`.
- Esiste un record **jolly** `*.viosadea.com` → `46.252.148.112` (qualsiasi sottodominio risponde).

> ⚠️ I record sotto sono stati rilevati interrogando i DNS dall'esterno (Netsons
> non consente di scaricare la zona). Nomi non comuni, ad esempio altri selettori
> DKIM, potrebbero mancare. **La fonte completa è il *Zone Editor* di cPanel**
> (o la gestione DNS nell'area clienti Netsons): confronta anche con quella.

## 1. Aggiungi la zona su Cloudflare e controlla i record

Dashboard (account dedicato) → **Add a domain** → `viosadea.com` → piano Free →
Cloudflare prova a importare i record esistenti. L'import automatico **può essere
incompleto** e può attivare il proxy su alcuni record: prima di cambiare i
nameserver confronta *DNS → Records* con questa tabella e con il Zone Editor di
cPanel, aggiungi a mano ciò che manca e metti **DNS only** dove indicato.

Solo A/AAAA/CNAME hanno l'interruttore Proxy; MX, TXT e SRV sono sempre DNS only.

| Tipo | Nome | Contenuto | Proxy | Perché |
|---|---|---|---|---|
| A | `viosadea.com` (`@`) | `46.252.148.112` | **DNS only** | Oggi è WordPress; al cutover va eliminato e sostituito dal Worker (step 5) |
| CNAME | `www` | `viosadea.com` | **DNS only** | Idem |
| A | `mail` | `46.252.148.112` | **DNS only** ⚠️ | Server di posta: IMAP/SMTP/POP non passano dal proxy |
| A/CNAME | `webmail`, `cpanel`, `whm`, `webdisk`, `cpcalendars`, `cpcontacts` | `46.252.148.112` / `cpanel.viosadea.com` | **DNS only** | Pannelli cPanel su porte non web e rinnovo certificati |
| A/CNAME | `autodiscover`, `autoconfig` | `cpanel.viosadea.com` | **DNS only** | Configurazione automatica dei client email |
| A/CNAME | `ftp` | `cpanel.viosadea.com` | **DNS only** | FTP non è HTTP |
| A | `smtp`, `imap`, `pop`, `pop3` (se presenti) | `46.252.148.112` | **DNS only** | Posta |
| A | `*` (jolly) | `46.252.148.112` | **DNS only** | Mantiene il comportamento attuale |
| MX | `viosadea.com` | `mail.viosadea.com`, priorità `0` | — | **Ricezione email** |
| TXT | `viosadea.com` | SPF | — | Da aggiornare (step 2) |
| TXT | `viosadea.com` | `google-site-verification=9VNW7k…` | — | Search Console |
| TXT | `viosadea.com` | `brevo-code:14b6a9…` | — | Brevo |
| TXT | `default._domainkey` | `v=DKIM1; k=rsa; p=MIIBIjAN…` | — | DKIM di cPanel (email inviate da Netsons) |
| TXT | `mail._domainkey` | `k=rsa;p=MIGfMA0G…` | — | DKIM (Brevo) |
| TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` | — | DMARC: **deve restare uno solo** |
| SRV | `_autodiscover._tcp` | `0 0 443 panelemaildiscovery.cpanel.net` | — | Autoconfigurazione email |
| SRV | `_caldav._tcp` / `_caldavs._tcp` | `0 0 2079` / `0 0 2080 cpanel.viosadea.com` | — | Calendari cPanel |
| SRV | `_carddav._tcp` / `_carddavs._tcp` | `0 0 2079` / `0 0 2080 cpanel.viosadea.com` | — | Contatti cPanel |

I valori completi (DKIM compresi) vanno copiati dall'import di Cloudflare o dal Zone
Editor di cPanel: qui sono abbreviati. Da ignorare se importati: `localhost`, `ns1`,
`ns2`.

> **Jolly `*`**: tenerlo DNS only non cambia nulla rispetto a oggi. I record
> espliciti (`mail`, `www`, ecc.) hanno sempre la precedenza sul jolly. Quando tutto
> funziona si può eliminare: il sito non ne ha bisogno.

## 2. SPF

Oggi: `v=spf1 +a +mx ~all`. Sia `a` (IP dell'apex) sia `mx` (IP di `mail`) valgono
oggi `46.252.148.112`. Dopo il cutover l'apex punterà a Cloudflare, ma `mx` continua a
coprire il server Netsons, quindi l'invio non si rompe. Per chiarezza conviene
comunque rendere esplicito l'IP e togliere `a`:

```
v=spf1 ip4:46.252.148.112 mx ~all
```

Non serve aggiungere Brevo: Brevo autentica il dominio con DKIM (`mail._domainkey`)
e non richiede un include SPF. Le email del modulo contatti partono da Brevo, quindi
`brevo-code` e `mail._domainkey` **devono restare** nella zona Cloudflare.

## 3. Cambia i nameserver su Netsons

Cloudflare, nella schermata *"Replace your current nameservers with Cloudflare
nameservers"*, mostra i nameserver da togliere (`dns1`–`dns4.netsons.net`) e i **2
da inserire** (`xxx.ns.cloudflare.com`, `yyy.ns.cloudflare.com`: sono assegnati al
tuo account, copiali esattamente).

1. Netsons → **Area clienti → Domini → Gestione Dominio → Pannello Dominio → NameServer**.
2. Sostituisci **tutti** i nameserver Netsons con i **2 di Cloudflare** e lascia
   vuoti gli altri campi. Non lasciare nessun `dnsX.netsons.net`: Cloudflare chiede
   di rimuovere tutti i nameserver precedenti.
3. Clicca **Modifica Nameserver**.
4. Torna su Cloudflare → **Check nameservers now**.

Netsons avverte che la zona sui nuovi nameserver deve già contenere record NS e MX:
Cloudflare crea gli NS da solo, l'MX lo verifichi allo step 1.

Propagazione: in media un'ora, fino a 48 ore. Durante l'attesa alcuni resolver usano
ancora Netsons e altri Cloudflare; se lo step 1 è completo rispondono con gli stessi
record, quindi sito ed email continuano a funzionare.

Da questo momento **ogni modifica DNS si fa su Cloudflare**: il Zone Editor di
cPanel non ha più effetto sul dominio.

## 4. Verifica (zona Active)

Cloudflare manda un'email e segna il dominio **Active**. Da terminale:

```sh
dig +short NS viosadea.com            # i 2 nameserver *.ns.cloudflare.com
dig +short MX viosadea.com            # 0 mail.viosadea.com.
dig +short A mail.viosadea.com        # 46.252.148.112 (un IP Cloudflare = proxy acceso per errore)
dig +short TXT viosadea.com           # SPF aggiornato + google + brevo
dig +short TXT _dmarc.viosadea.com    # un solo record DMARC
dig +short SRV _autodiscover._tcp.viosadea.com
```

Poi invia e ricevi un'email sulla casella del dominio e apri `https://webmail.viosadea.com`.
Il sito è ancora WordPress: è normale finché non fai il cutover.

## 5. Cutover del sito sul Worker

Solo con la zona **Active** e il sito già provato su `workers.dev`.

Cloudflare **non** permette di collegare un Custom Domain a un nome che ha già un
record DNS: i due record del vecchio sito vanno eliminati prima. Il sito resta
irraggiungibile per il breve tempo tra i passi 1 e 2: fallo in un momento tranquillo.

1. *DNS → Records*: **elimina** il record A `viosadea.com` e il CNAME `www`.
   **Solo questi due**: MX, `mail`, `webmail`, `cpanel`, TXT, SRV e il jolly restano.
2. Collega i domini al Worker:
   - da codice: in `wrangler.jsonc` scommenta `routes` → `npm run deploy`;
   - oppure dashboard: *Workers & Pages → viosadea → Settings → Domains & Routes →
     Add → Custom Domain* → `www.viosadea.com`, poi `viosadea.com`.

   Cloudflare crea i record che puntano al Worker ed emette i certificati.
3. **Redirect apex → www**: *Rules → Redirect Rules → Create rule*:
   - condizione: *Wildcard pattern*, Request URL `https://viosadea.com/*`
   - azione: Target URL `https://www.viosadea.com/${1}`, status **301**, *Preserve query string* attivo.

   Il redirect funziona perché `viosadea.com` è collegato al Worker, quindi passa dal
   proxy Cloudflare. Il canonical del sito è `https://www.viosadea.com`.
4. Verifiche:
   ```sh
   curl -sI https://viosadea.com/ | grep -i location           # → https://www.viosadea.com/
   curl -sI https://www.viosadea.com/ | head -1                 # 200
   curl -sI https://www.viosadea.com/en/privacy-cookie-policy/ | grep -i location  # → /en/privacy/
   dig +short A mail.viosadea.com                                # sempre 46.252.148.112
   ```

## Dopo il cutover: posta e certificati

- **Client email (telefono, Outlook, Thunderbird)**: il server IMAP/SMTP deve essere
  **`mail.viosadea.com`**, non `viosadea.com`. Dopo il cutover `viosadea.com` punta al
  Worker e non risponde più per la posta. Il certificato attuale copre già `mail.viosadea.com`.
- **AutoSSL di cPanel**: per `viosadea.com` e `www` la validazione non passerà più
  (puntano a Cloudflare) e cPanel potrebbe inviare email di avviso. `mail`,
  `webmail`, `cpanel` e gli altri restano raggiungibili sul server. Nelle settimane
  successive controlla in cPanel → *SSL/TLS Status* che il certificato di `mail` venga
  rinnovato. Se serve, escludi `viosadea.com` e `www` da AutoSSL. Il certificato del
  sito lo gestisce Cloudflare.
- **Hosting Netsons**: tienilo attivo finché la posta resta su cPanel. WordPress si può
  disattivare dopo qualche giorno di verifica.

## In caso di problemi

- **Email non arrivano** → controlla `MX` e che `mail` sia **DNS only** con IP `46.252.148.112`.
- **Email in spam** → SPF, i due `_domainkey`, un solo `_dmarc`.
- **Client email non si collega dopo il cutover** → server impostato su `viosadea.com`
  invece di `mail.viosadea.com`.
- **Tornare indietro**: rimetti su Netsons i nameserver `dns1`–`dns4.netsons.net`.
  Prima verifica con Netsons che la zona DNS del dominio sia ancora presente sui loro
  server (dal Zone Editor di cPanel): non è garantito che resti dopo il cambio.
