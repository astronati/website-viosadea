# Visite e provenienza

## Cosa c'è

**Cloudflare Web Analytics**, senza cookie: nessun banner da mostrare e nessun
dato personale raccolto.
[Pannello del sito](https://dash.cloudflare.com/e874f5ea796bcf21353aac8e5177a9a6/web-analytics)
(a mano: dashboard Cloudflare → *Analytics → Web analytics* → `viosadea.com`).
Mostra visite, pagine viste, percorsi, referrer, paese e dispositivo.

Il riassunto per l'uso quotidiano — dove guardare e quali link distribuire — sta
nel [README](../README.md#statistiche-dove-si-guardano); qui restano i dettagli
tecnici.

Lo snippet è incluso dal sito (`src/layouts/Base.astro`) con il token in
`src/consts.ts` → `cfBeaconToken`. **L'installazione automatica del dashboard non
funziona** su un sito servito da un Worker: se il token viene svuotato, le
statistiche smettono di arrivare senza alcun avviso.

## Perché gli `utm_*` non servono qui

Cloudflare Web Analytics **non registra le query string** (scelta di privacy):
`?utm_source=qr` non comparirà in nessun rapporto. Al posto degli UTM usiamo un
link diverso per canale, che nel rapporto *Pages* diventa una riga a sé.

## I link da distribuire

| Canale | Link da dare |
|---|---|
| QR su volantino o biglietto | `https://www.viosadea.com/go/qr` |
| Foglio di benvenuto in appartamento | `https://www.viosadea.com/go/casa` |
| Booking.com (scheda e messaggi) | `https://www.viosadea.com/go/booking` |
| Airbnb | `https://www.viosadea.com/go/airbnb` |
| WhatsApp | `https://www.viosadea.com/go/wa` |
| Firma email e risposte alle richieste | `https://www.viosadea.com/go/mail` |
| Social | `https://www.viosadea.com/go/social` |
| Consorzio (fassa.com, Dolomiti Superski) | `https://www.viosadea.com/go/fassa` |

Chi apre uno di questi link vede la home dopo un istante: la pagina intermedia
serve solo a registrare il passaggio, è in `noindex` e non entra nella sitemap.

Nel rapporto *Pages* di Web Analytics le righe `/go/qr/`, `/go/booking/`… dicono
quante visite sono arrivate da ciascun canale. Funziona anche dove il referrer
non esiste: QR stampato, messaggio WhatsApp, app di Booking.

**Aggiungere un canale**: una riga in `src/data/channels.ts`, poi `npm run deploy`.
La pagina `/go/<id>/` viene generata da `src/pages/go/[channel].astro`.

Per i link che pubblichi su un sito altrui va bene anche l'indirizzo normale: lì
il referrer si vede già da solo. Le porte servono quando il referrer manca.

## Se un giorno servissero le campagne vere

UTM completi (sorgente, mezzo, campagna, conversioni) richiedono un altro
strumento: GA4 — che usa cookie e quindi obbligherebbe a mettere il banner e ad
aggiornare l'informativa — oppure Plausible/Umami, senza cookie ma a pagamento o
da ospitare. Oggi il sito non ha banner, ed è un vantaggio: pagine più leggere e
nessun fastidio per chi arriva.
