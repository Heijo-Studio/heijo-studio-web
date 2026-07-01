import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const TO_INBOX = 'studio@heijostudio.com';
const FROM = 'Heijo Studio <hello@send.heijostudio.com>';
const BOOKING_URL = 'https://cal.com/your-handle/intro';

type ContactPayload = {
  name?: string;
  email?: string;
  projectType?: string;
  location?: string;
  timeline?: string;
  budget?: string;
  language?: string;
  message?: string;
  company?: string; // honeypot — must stay empty
};

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripNewlines(value: string): string {
  return value.replace(/[\r\n]/g, ' ');
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return json({ error: 'Invalid request.' }, 415);
  }

  let data: ContactPayload;
  try {
    data = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  // Spam honeypot: bots fill hidden fields; return fake success so they don't retry.
  if (data.company && data.company.trim() !== '') {
    return json({ ok: true }, 200);
  }

  const name = (data.name ?? '').trim();
  const email = (data.email ?? '').trim();
  const message = (data.message ?? '').trim();

  if (!name || !email || !message) {
    return json(
      { error: 'Please fill in your name, email, and message.' },
      400,
    );
  }
  if (!isEmail(email)) {
    return json(
      { error: 'That email address looks off — please check it.' },
      400,
    );
  }

  const optional: Array<[string, string | undefined]> = [
    ['Project type', data.projectType],
    ['Location', data.location],
    ['Timeline', data.timeline],
    ['Budget', data.budget],
    ['Preferred language', data.language],
  ];
  const detailRows = optional
    .filter(([, v]) => v && v.trim() !== '')
    .map(
      ([label, v]) =>
        `<tr><td><strong>${label}</strong></td><td>${escapeHtml((v ?? '').trim())}</td></tr>`,
    )
    .join('');

  try {
    await resend.emails.send({
      from: FROM,
      to: TO_INBOX,
      replyTo: email,
      subject: `New enquiry — ${stripNewlines(escapeHtml(name))}`,
      html: `
        <h2>New enquiry from heijostudio.com</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}<br/>
        <strong>Email:</strong> ${escapeHtml(email)}</p>
        ${detailRows ? `<table cellpadding="6" style="border-collapse:collapse">${detailRows}</table>` : ''}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>
      `,
    });

    await resend.emails.send({
      from: FROM,
      to: email,
      replyTo: TO_INBOX,
      subject: "Thanks — we've got your message",
      html: `
        <p>Hi ${escapeHtml(name)},</p>
        <p>Thanks for reaching out to Heijo Studio. Your message is in,
        and we'll reply within one business day.</p>
        <p>If you'd rather talk sooner, book a short intro call here:
        <a href="${BOOKING_URL}">${BOOKING_URL}</a>.</p>
        <p>Speak soon,<br/>Joanna — Heijo Studio</p>
      `,
    });

    return json({ ok: true }, 200);
  } catch (err) {
    console.error('Resend error:', err);
    return json(
      {
        error:
          'Something went wrong sending your message. Please email studio@heijostudio.com directly.',
      },
      502,
    );
  }
};
