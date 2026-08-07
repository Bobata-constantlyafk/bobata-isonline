import { useEffect, useState } from "react";
import type { Route } from "./+types/admin";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Admin — Bobata" }];
}

type WhoamiState =
  | { state: "checking" }
  | { state: "ok"; email: string }
  | { state: "denied" };

/**
 * Stub shell. Real content (message inbox, article editor) lands in later
 * tasks; this exists to prove the Access + JWT chain works end to end
 * before anything is built on top of it — see worker/access.ts.
 */
export default function Admin() {
  const [whoami, setWhoami] = useState<WhoamiState>({ state: "checking" });

  useEffect(() => {
    fetch("/api/admin/whoami")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { email: string }) =>
        setWhoami({ state: "ok", email: data.email }),
      )
      .catch(() => setWhoami({ state: "denied" }));
  }, []);

  return (
    <div className="flex min-h-screen flex-col gap-6 bg-void px-10 py-10 font-mono text-body">
      <h1 className="font-display text-2xl text-bright">ADMIN</h1>
      <p className="text-sm text-secondary">
        {whoami.state === "checking" && "Checking Access session…"}
        {whoami.state === "ok" && `Signed in as ${whoami.email}`}
        {whoami.state === "denied" &&
          "Not authorized — /api/admin/whoami rejected this session."}
      </p>
    </div>
  );
}
