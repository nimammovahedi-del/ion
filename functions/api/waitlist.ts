// Pages Function: POST /api/waitlist
// Stores an email address for the launch waitlist in D1. Nothing else is collected:
// no IP address, no user agent, no health information.

interface Env {
  DB: D1Database;
}

const CARING_FOR = new Set(['parent', 'partner', 'other-family', 'myself', 'professional']);
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

// A plain form post (JavaScript off) gets a page back instead of JSON.
function reply(asJson: boolean, request: Request, body: { ok: boolean; error?: string }, status = 200): Response {
  if (asJson) return json(body, status);
  const to = body.ok ? '/thanks/' : `/?waitlist=${body.error ?? 'error'}#waitlist`;
  return Response.redirect(new URL(to, request.url).toString(), 303);
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const type = request.headers.get('content-type') ?? '';
  const asJson = type.includes('application/json');
  let fields: Record<string, string> = {};
  try {
    if (asJson) {
      const raw = (await request.json()) as Record<string, unknown>;
      for (const [k, v] of Object.entries(raw)) if (typeof v === 'string') fields[k] = v;
    } else {
      const form = await request.formData();
      for (const [k, v] of form.entries()) if (typeof v === 'string') fields[k] = v;
    }
  } catch {
    return reply(asJson, request, { ok: false, error: 'bad-request' }, 400);
  }

  // Honeypot: real visitors never fill this hidden field. Pretend it worked.
  if (fields.company) return reply(asJson, request, { ok: true });

  const email = (fields.email ?? '').trim().toLowerCase();
  if (email.length > 320 || !EMAIL.test(email)) return reply(asJson, request, { ok: false, error: 'invalid-email' }, 422);

  const caringFor = CARING_FOR.has(fields.caring_for ?? '') ? fields.caring_for : null;
  const source = (fields.source ?? '').slice(0, 40) || null;

  try {
    await env.DB.prepare(
      'INSERT INTO waitlist (email, caring_for, source) VALUES (?1, ?2, ?3) ON CONFLICT(email) DO NOTHING',
    )
      .bind(email, caringFor, source)
      .run();
  } catch {
    return reply(asJson, request, { ok: false, error: 'server' }, 500);
  }
  // Same answer whether or not the address was already on the list.
  return reply(asJson, request, { ok: true });
};

export const onRequest: PagesFunction<Env> = async () => json({ ok: false, error: 'method' }, 405);
