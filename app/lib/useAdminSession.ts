import { useEffect, useState } from "react";

export type AdminSession =
  | { state: "checking" }
  | { state: "ok"; email: string }
  | { state: "denied" };

/**
 * Every /admin/* page calls this. It's not the security boundary — Cloudflare
 * Access at the edge and each Worker route's own JWT check (worker/access.ts)
 * are — this just gives the UI something to show while that's confirmed, and
 * hides admin content if a request somehow reaches this page without a valid
 * session (e.g. Access misconfigured, or a stale prerendered shell viewed
 * offline).
 */
export function useAdminSession(): AdminSession {
  const [session, setSession] = useState<AdminSession>({ state: "checking" });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/whoami")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { email: string }) => {
        if (!cancelled) setSession({ state: "ok", email: data.email });
      })
      .catch(() => {
        if (!cancelled) setSession({ state: "denied" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return session;
}
