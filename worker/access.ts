/**
 * Verifies a Cloudflare Access JWT server-side.
 *
 * Access already blocks unauthenticated browser traffic to /admin* at the
 * edge, before it ever reaches this Worker — that's the primary gate, set
 * up in the dashboard (Zero Trust -> Access -> Applications), not here.
 *
 * This is defense-in-depth on top of that: every /api/admin/* handler calls
 * verifyAccessJwt() itself and rejects if it doesn't get back a verified
 * identity. That way a request that somehow reaches this code without
 * having gone through the Access-protected path — a direct API call, a
 * misconfigured Access path, a bug — is still rejected here, independent
 * of whatever the edge did or didn't do. No admin capability should ever
 * depend on the edge gate alone.
 */

export interface AccessEnv {
  /** e.g. "boyandechev.cloudflareaccess.com" — from the Zero Trust dashboard. */
  ACCESS_TEAM_DOMAIN?: string;
  /** The Access Application's Audience (AUD) tag. Not secret — it's inside
   *  the JWT's own `aud` claim, so exposing it grants nothing. */
  ACCESS_AUD?: string;
}

interface Jwk {
  kid: string;
  kty: string;
  n: string;
  e: string;
}

export interface AccessIdentity {
  email: string;
}

let cachedCerts: { keys: Jwk[]; fetchedAt: number } | null = null;
const CERTS_TTL_MS = 60 * 60 * 1000;

async function getCerts(teamDomain: string): Promise<Jwk[]> {
  const now = Date.now();
  if (cachedCerts && now - cachedCerts.fetchedAt < CERTS_TTL_MS) {
    return cachedCerts.keys;
  }
  const res = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
  if (!res.ok) {
    throw new Error(`Access certs fetch failed: ${res.status}`);
  }
  const data = await res.json<{ keys: Jwk[] }>();
  cachedCerts = { keys: data.keys, fetchedAt: now };
  return data.keys;
}

function base64UrlToBytes(input: string): Uint8Array {
  const padded = input + "=".repeat((4 - (input.length % 4)) % 4);
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

function base64UrlToJson<T>(input: string): T {
  return JSON.parse(new TextDecoder().decode(base64UrlToBytes(input))) as T;
}

export async function verifyAccessJwt(
  request: Request,
  env: AccessEnv,
): Promise<AccessIdentity | null> {
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) {
    // Not configured — fail closed, never treat "unconfigured" as "allowed".
    return null;
  }

  const token = request.headers.get("cf-access-jwt-assertion");
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [headerB64, payloadB64, signatureB64] = parts;

  let header: { kid?: string; alg?: string };
  let payload: {
    aud?: string[] | string;
    exp?: number;
    email?: string;
    iss?: string;
  };
  try {
    header = base64UrlToJson(headerB64);
    payload = base64UrlToJson(payloadB64);
  } catch {
    return null;
  }

  if (header.alg !== "RS256" || !header.kid) return null;
  if (!payload.exp || payload.exp * 1000 < Date.now()) return null;

  const audiences = Array.isArray(payload.aud)
    ? payload.aud
    : payload.aud
      ? [payload.aud]
      : [];
  if (!audiences.includes(env.ACCESS_AUD)) return null;
  if (payload.iss !== `https://${env.ACCESS_TEAM_DOMAIN}`) return null;
  if (!payload.email) return null;

  let keys: Jwk[];
  try {
    keys = await getCerts(env.ACCESS_TEAM_DOMAIN);
  } catch (error) {
    console.error("access: certs fetch failed", error);
    return null;
  }

  const jwk = keys.find((k) => k.kid === header.kid);
  if (!jwk) return null;

  const publicKey = await crypto.subtle.importKey(
    "jwk",
    { kty: jwk.kty, n: jwk.n, e: jwk.e, alg: "RS256", ext: true },
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );

  const valid = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    publicKey,
    base64UrlToBytes(signatureB64),
    new TextEncoder().encode(`${headerB64}.${payloadB64}`),
  );
  if (!valid) return null;

  return { email: payload.email };
}
