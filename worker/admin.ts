import { verifyAccessJwt, type AccessEnv } from "./access";

export type AdminEnv = AccessEnv;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

/**
 * GET /api/admin/whoami — proves the Access gate + JWT verification chain
 * end to end before any real admin feature is built on top of it. Returns
 * the verified email on success; every other outcome is a 401/403 with no
 * information leaked about why.
 */
export async function handleWhoami(
  request: Request,
  env: AdminEnv,
): Promise<Response> {
  const identity = await verifyAccessJwt(request, env);
  if (!identity) {
    return json({ ok: false, error: "UNAUTHORIZED" }, 401);
  }
  return json({ ok: true, email: identity.email });
}
