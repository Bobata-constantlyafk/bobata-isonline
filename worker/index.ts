import { handleContact, type ContactEnv } from "./contact";

/**
 * Worker entry point.
 *
 * Everything on this site is prerendered to static HTML at build time, so
 * this Worker exists only to answer the handful of /api/* routes. Anything
 * else falls straight through to the static asset binding, which serves
 * build/client and resolves directory indexes (/about -> /about/index.html)
 * on its own.
 *
 * This replaces the Pages Functions convention (a functions/ directory).
 * That convention is Pages-only and is silently ignored by a Worker, which
 * is why /api/contact 404'd on the first deploy.
 */
export interface Env extends ContactEnv {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", {
          status: 405,
          headers: { allow: "POST" },
        });
      }
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
