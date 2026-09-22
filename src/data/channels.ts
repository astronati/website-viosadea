// "Porte d'ingresso" per capire da dove arrivano i visitatori.
//
// Cloudflare Web Analytics non registra le query string, quindi i parametri utm
// non si vedrebbero da nessuna parte. In compenso registra il percorso: dando un
// link diverso per ogni canale (viosadea.com/go/qr) ogni canale diventa una riga
// nel rapporto delle pagine. Funziona anche quando il referrer non c'è: QR su
// carta, messaggio WhatsApp, app di Booking.
//
// Aggiungere un canale = aggiungere una riga qui. Le pagine sono generate da
// src/pages/go/[channel].astro, non indicizzate, e rimandano subito alla home.

export interface Channel {
  /** finisce nell'URL: /go/<id>/ */
  id: string;
  /** a cosa serve: promemoria per chi legge i rapporti tra sei mesi */
  note: string;
}

export const CHANNELS: Channel[] = [
  { id: 'qr', note: 'QR code generico (volantino, biglietto da visita)' },
  { id: 'casa', note: 'QR o foglio di benvenuto dentro l’appartamento' },
  { id: 'booking', note: 'Link messo nella scheda o nei messaggi di Booking.com' },
  { id: 'airbnb', note: 'Link messo nella scheda o nei messaggi di Airbnb' },
  { id: 'wa', note: 'Link mandato a mano su WhatsApp' },
  { id: 'mail', note: 'Firma email e risposte alle richieste' },
  { id: 'social', note: 'Post o profilo social' },
  { id: 'fassa', note: 'Scheda sul sito del consorzio (fassa.com, Dolomiti Superski)' },
];

export const CHANNEL_IDS = CHANNELS.map((c) => c.id);
