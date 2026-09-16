import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { SITE } from '../../consts';
import { LANGUAGE_NAME, isLocale, type Locale } from '../../i18n/locales';
import { useTranslations } from '../../i18n/utils';

// Eseguito on-demand nel Worker: valida la richiesta, verifica Turnstile e
// invia l'email al proprietario tramite l'API transazionale di Brevo.
export const prerender = false;

interface RuntimeEnv {
  BREVO_API_KEY?: string;
  CONTACT_TO?: string;
  MAIL_FROM?: string;
  TURNSTILE_SECRET?: string;
}

const BREVO_ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

const str = (v: unknown, max = 500) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const int = (v: unknown) => Number.parseInt(str(v, 3), 10);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const isDate = (v: string) => /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));
const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
const itDate = (iso: string) => iso.split('-').reverse().join('/');

async function verifyTurnstile(secret: string, token: string, ip: string | null): Promise<boolean> {
  if (!token) return false;
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip) form.append('remoteip', ip);
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const outcome = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (!outcome.success) console.warn('[richiesta] Turnstile rifiutato', outcome['error-codes']);
    return outcome.success === true;
  } catch (err) {
    console.error('[richiesta] Turnstile non raggiungibile', (err as Error).message);
    return false;
  }
}

interface BrevoEmail {
  sender: { email: string; name?: string };
  to: { email: string; name?: string }[];
  replyTo?: { email: string; name?: string };
  subject: string;
  htmlContent: string;
  textContent: string;
  tags?: string[];
}

/** Invia con Brevo. Successo = HTTP 201; altrimenti lancia con codice e messaggio di Brevo. */
async function sendWithBrevo(apiKey: string, email: BrevoEmail): Promise<void> {
  const res = await fetch(BREVO_ENDPOINT, {
    method: 'POST',
    headers: { 'api-key': apiKey, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify(email),
    signal: AbortSignal.timeout(10_000),
  });
  if (res.status !== 201) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Brevo HTTP ${res.status} ${detail.slice(0, 300)}`);
  }
}

export const POST: APIRoute = async ({ request }) => {
  const runtime = env as unknown as RuntimeEnv;

  if (Number(request.headers.get('content-length') ?? 0) > 20_000) {
    return json({ message: 'Payload too large' }, 413);
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ message: 'Invalid request' }, 400);
  }

  const rawLocale = str(body.locale, 5);
  const locale: Locale = isLocale(rawLocale) ? rawLocale : 'it';
  const t = useTranslations(locale);

  // honeypot: i bot compilano il campo nascosto -> risposta "ok" senza inviare nulla
  if (str(body.website)) return json({ ok: true, message: t('form.success') });

  const data = {
    name: str(body.name, 100),
    email: str(body.email, 200),
    phone: str(body.phone, 40),
    checkin: str(body.checkin, 10),
    checkout: str(body.checkout, 10),
    adults: int(body.adults),
    children: Math.max(0, int(body.children) || 0),
    pets: str(body.pets, 3) === 'yes',
    petsDetails: str(body.petsDetails, 200),
    parking: str(body.parking, 3) === 'yes',
    message: str(body.message, 2000),
    privacy: str(body.privacy, 3) === 'yes',
  };

  const errors: Record<string, string> = {};
  if (data.name.length < 2) errors.name = t('form.required');
  if (!data.email) errors.email = t('form.required');
  else if (!EMAIL_RE.test(data.email)) errors.email = t('form.invalidEmail');
  if (!isDate(data.checkin)) errors.checkin = t('form.required');
  if (!isDate(data.checkout)) errors.checkout = t('form.required');
  if (!errors.checkin && !errors.checkout) {
    // tolleranza di un giorno per i fusi orari
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    if (data.checkin < yesterday) errors.checkin = t('form.datesPast');
    if (data.checkout <= data.checkin) errors.checkout = t('form.datesOrder');
  }
  const maxGuests = SITE.apartment.maxGuests;
  if (!(data.adults >= 1) || data.adults + data.children > maxGuests) {
    errors.adults = t('form.guests', { n: maxGuests });
  }
  if (!data.privacy) errors.privacy = t('form.privacyRequired');
  if (Object.keys(errors).length > 0) return json({ message: t('form.error'), errors }, 422);

  if (runtime.TURNSTILE_SECRET) {
    const ok = await verifyTurnstile(
      runtime.TURNSTILE_SECRET,
      str(body['cf-turnstile-response'], 2048),
      request.headers.get('CF-Connecting-IP'),
    );
    if (!ok) return json({ message: t('form.captcha'), errors: { captcha: t('form.captcha') } }, 422);
  } else {
    console.warn('[richiesta] TURNSTILE_SECRET non configurato: verifica anti-spam saltata');
  }

  if (!runtime.BREVO_API_KEY || !runtime.CONTACT_TO || !runtime.MAIL_FROM) {
    console.error('[richiesta] configurazione email mancante (BREVO_API_KEY, CONTACT_TO o MAIL_FROM)');
    return json({ message: t('form.network') }, 503);
  }

  const nights = Math.round((Date.parse(data.checkout) - Date.parse(data.checkin)) / 86_400_000);
  const rows: [string, string][] = [
    ['Nome', data.name],
    ['Email', data.email],
    ['Telefono', data.phone || '—'],
    ['Arrivo', itDate(data.checkin)],
    ['Partenza', itDate(data.checkout)],
    ['Notti', String(nights)],
    ['Ospiti', `${data.adults} adulti, ${data.children} bambini`],
    ['Animali', data.pets ? `Sì${data.petsDetails ? ` — ${data.petsDetails}` : ''}` : 'No'],
    ['Parcheggio privato', data.parking ? 'Sì' : 'No'],
    ['Lingua del sito', LANGUAGE_NAME[locale]],
  ];
  const phoneDigits = data.phone.replace(/\D/g, '');
  const text = [
    'Nuova richiesta di disponibilità dal sito viosadea.com',
    '',
    ...rows.map(([k, v]) => `${k}: ${v}`),
    '',
    'Messaggio:',
    data.message || '—',
    '',
    'Rispondi a questa email per scrivere direttamente all’ospite.',
  ].join('\n');
  const html = `<!doctype html><html><body style="font-family:system-ui,sans-serif;color:#2f2a26">
<h2 style="color:#582b01">Nuova richiesta di disponibilità</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#5e564d">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`)
    .join('')}</table>
<h3>Messaggio</h3><p style="white-space:pre-wrap">${esc(data.message || '—')}</p>
${phoneDigits.length >= 8 ? `<p><a href="https://wa.me/${phoneDigits}">Scrivi all’ospite su WhatsApp</a></p>` : ''}
<p style="color:#5e564d;font-size:13px">Rispondi a questa email per scrivere direttamente all’ospite.</p>
</body></html>`;

  try {
    await sendWithBrevo(runtime.BREVO_API_KEY, {
      sender: { email: runtime.MAIL_FROM, name: `${SITE.name} – sito web` },
      to: [{ email: runtime.CONTACT_TO }],
      replyTo: { email: data.email, name: data.name },
      subject: `Richiesta ${itDate(data.checkin)} → ${itDate(data.checkout)} · ${data.name}${data.pets ? ' · 🐾' : ''}`,
      htmlContent: html,
      textContent: text,
      tags: ['richiesta-sito'],
    });
  } catch (err) {
    console.error('[richiesta] invio email fallito', (err as Error).message);
    return json({ message: t('form.network') }, 502);
  }

  return json({ ok: true, message: t('form.success') });
};
