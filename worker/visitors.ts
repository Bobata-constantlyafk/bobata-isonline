/**
 * GET /api/visitors
 *
 * Reads the real count from D1, incrementing it first unless this browser
 * has already been counted this session. "Session" here means literally
 * that: the guard cookie carries no Max-Age, so it disappears when the
 * browser closes and the next visit counts again — same definition the
 * README's State Management table always used for this widget.
 */

export interface VisitorsEnv {
  DB: D1Database;
}

const COOKIE_NAME = "bobata_visited";

function hasVisitedCookie(request: Request): boolean {
  const cookie = request.headers.get("cookie") ?? "";
  return cookie
    .split(";")
    .some((part) => part.trim().startsWith(`${COOKIE_NAME}=`));
}

export async function handleVisitors(
  request: Request,
  env: VisitorsEnv,
): Promise<Response> {
  const alreadyCounted = hasVisitedCookie(request);

  if (!alreadyCounted) {
    await env.DB.prepare(
      "UPDATE counters SET value = value + 1 WHERE key = 'visitors'",
    ).run();
  }

  const row = await env.DB.prepare(
    "SELECT value FROM counters WHERE key = 'visitors'",
  ).first<{ value: number }>();

  const headers = new Headers({ "content-type": "application/json" });
  if (!alreadyCounted) {
    headers.append(
      "set-cookie",
      `${COOKIE_NAME}=1; Path=/; SameSite=Lax; Secure`,
    );
  }

  return new Response(JSON.stringify({ visitors: row?.value ?? 0 }), {
    status: 200,
    headers,
  });
}
