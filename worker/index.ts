import { handleWhoami, type AdminEnv } from "./admin";
import { handleContact, type ContactEnv } from "./contact";
import {
  handleDeleteMessage,
  handleListMessages,
  handleUpdateMessage,
  type MessagesEnv,
} from "./messages";
import { handleVisitors, type VisitorsEnv } from "./visitors";

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
export interface Env
  extends ContactEnv,
    VisitorsEnv,
    AdminEnv,
    MessagesEnv {
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

    if (url.pathname === "/api/visitors") {
      if (request.method !== "GET") {
        return new Response("Method Not Allowed", {
          status: 405,
          headers: { allow: "GET" },
        });
      }
      return handleVisitors(request, env);
    }

    // Every /api/admin/* route re-verifies the Access JWT itself (see
    // worker/access.ts) — the edge-level Access policy on /admin* is the
    // primary gate, this is defense-in-depth, not a substitute for it.
    if (url.pathname === "/api/admin/whoami") {
      if (request.method !== "GET") {
        return new Response("Method Not Allowed", {
          status: 405,
          headers: { allow: "GET" },
        });
      }
      return handleWhoami(request, env);
    }

    if (url.pathname === "/api/admin/messages") {
      if (request.method !== "GET") {
        return new Response("Method Not Allowed", {
          status: 405,
          headers: { allow: "GET" },
        });
      }
      return handleListMessages(request, env);
    }

    const messageMatch = url.pathname.match(
      /^\/api\/admin\/messages\/([^/]+)$/,
    );
    if (messageMatch) {
      const [, id] = messageMatch;
      if (request.method === "PATCH") {
        return handleUpdateMessage(request, env, id);
      }
      if (request.method === "DELETE") {
        return handleDeleteMessage(request, env, id);
      }
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { allow: "PATCH, DELETE" },
      });
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
