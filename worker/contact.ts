/**
 * POST /api/contact
 *
 * Validates the submission server-side (the client's checks are a
 * convenience, not a control) and relays it by email through Resend.
 *
 * Required secrets, set with `wrangler secret put` or in the Worker's
 * dashboard settings:
 *   RESEND_API_KEY   — from https://resend.com/api-keys
 *   CONTACT_TO       — the inbox that should receive submissions
 *   CONTACT_FROM     — a verified sender on your Resend domain,
 *                      e.g. "Bobata <signal@yourdomain.com>"
 */

export interface ContactEnv {
  RESEND_API_KEY?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

const MAX_HANDLE = 80;
const MAX_MESSAGE = 5000;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

export async function handleContact(
  request: Request,
  env: ContactEnv,
): Promise<Response> {
  let payload: { handle?: unknown; message?: unknown; website?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "MALFORMED PAYLOAD" }, 400);
  }

  // Honeypot: silently accept so bots don't learn they were caught, but
  // send nothing.
  if (typeof payload.website === "string" && payload.website.trim() !== "") {
    return json({ ok: true });
  }

  const handle = typeof payload.handle === "string" ? payload.handle.trim() : "";
  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";

  if (!handle || handle.length > MAX_HANDLE) {
    return json({ ok: false, error: "INVALID HANDLE" }, 400);
  }
  if (!message || message.length > MAX_MESSAGE) {
    return json({ ok: false, error: "INVALID TRANSMISSION" }, 400);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    console.error("contact: missing RESEND_API_KEY / CONTACT_TO / CONTACT_FROM");
    return json({ ok: false, error: "CHANNEL OFFLINE" }, 500);
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      subject: `Inbound signal — ${handle}`,
      text: `From: ${handle}\n\n${message}`,
    }),
  });

  if (!res.ok) {
    console.error("contact: resend responded", res.status, await res.text());
    return json({ ok: false, error: "TRANSMISSION FAILED" }, 502);
  }

  return json({ ok: true });
}
