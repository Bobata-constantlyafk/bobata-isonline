import { hashIp } from "./hash";

/**
 * POST /api/contact
 *
 * Validates the submission server-side (the client's checks are a
 * convenience, not a control), then stores it in D1. That storage is the
 * one thing that must succeed for the request to succeed.
 *
 * Email is a best-effort bonus notification, not a requirement: if Resend
 * secrets are configured it tries to send one, but a Resend failure never
 * fails the request — the message is already safely in the database, and
 * an admin can read it from there regardless of whether an email arrived.
 *
 * Optional secrets, set with `wrangler secret put` or in the Worker's
 * dashboard settings:
 *   RESEND_API_KEY   — from https://resend.com/api-keys
 *   CONTACT_TO       — the inbox that should receive the notification
 *   CONTACT_FROM     — a verified sender on your Resend domain
 */

export interface ContactEnv {
  DB: D1Database;
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

async function notifyByEmail(
  env: ContactEnv,
  handle: string,
  message: string,
): Promise<void> {
  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    return;
  }

  try {
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
      console.error("contact: resend notify failed", res.status, await res.text());
    }
  } catch (error) {
    console.error("contact: resend notify threw", error);
  }
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
  // store nothing and notify nothing.
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

  const ip = request.headers.get("cf-connecting-ip");
  const ipHash = ip ? await hashIp(ip) : null;
  const userAgent = request.headers.get("user-agent");

  try {
    await env.DB.prepare(
      "INSERT INTO messages (handle, message, ip_hash, user_agent) VALUES (?, ?, ?, ?)",
    )
      .bind(handle, message, ipHash, userAgent)
      .run();
  } catch (error) {
    console.error("contact: D1 insert failed", error);
    return json({ ok: false, error: "CHANNEL OFFLINE" }, 500);
  }

  // Awaited so logs land before the Worker's execution context can be torn
  // down, but its outcome never changes the response below.
  await notifyByEmail(env, handle, message);

  return json({ ok: true });
}
