import { handleWhoami, type AdminEnv } from "./admin";
import {
  handleCreateArticle,
  handleDeleteArticle,
  handleGetArticle,
  handleListArticles,
  handleUpdateArticle,
  type ArticlesEnv,
} from "./articles";
import { handleContact, type ContactEnv } from "./contact";
import { handleUpdateListItems, type ListsEnv } from "./lists";
import {
  handleDeleteMessage,
  handleListMessages,
  handleUpdateMessage,
  type MessagesEnv,
} from "./messages";
import { handleUpload, type UploadEnv } from "./upload";
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
    MessagesEnv,
    ArticlesEnv,
    ListsEnv,
    UploadEnv {
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

    if (url.pathname === "/api/admin/articles") {
      if (request.method === "GET") return handleListArticles(request, env);
      if (request.method === "POST") return handleCreateArticle(request, env);
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { allow: "GET, POST" },
      });
    }

    const articleMatch = url.pathname.match(
      /^\/api\/admin\/articles\/([^/]+)$/,
    );
    if (articleMatch) {
      const [, slug] = articleMatch;
      if (request.method === "GET") return handleGetArticle(request, env, slug);
      if (request.method === "PATCH") return handleUpdateArticle(request, env, slug);
      if (request.method === "DELETE") return handleDeleteArticle(request, env, slug);
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { allow: "GET, PATCH, DELETE" },
      });
    }

    const listMatch = url.pathname.match(/^\/api\/admin\/lists\/([^/]+)$/);
    if (listMatch) {
      const [, slug] = listMatch;
      if (request.method === "PATCH") {
        return handleUpdateListItems(request, env, slug);
      }
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { allow: "PATCH" },
      });
    }

    if (url.pathname === "/api/admin/upload") {
      if (request.method !== "POST") {
        return new Response("Method Not Allowed", {
          status: 405,
          headers: { allow: "POST" },
        });
      }
      return handleUpload(request, env);
    }

    // /admin/articles/:slug (the edit page) is genuinely dynamic — any
    // existing or future slug — so unlike the rest of the site it can't be
    // prerendered per-value. If the exact path isn't a known static file,
    // serve the admin shell instead and let client-side routing take over
    // once it hydrates and reads the real browser URL. Scoped to /admin/*
    // only: the public site keeps real 404s for paths that don't exist.
    if (url.pathname.startsWith("/admin/")) {
      const assetRes = await env.ASSETS.fetch(request);
      if (assetRes.status !== 404) return assetRes;
      // Trailing slash matters: fetching "/admin" (no slash) gets the
      // asset binding's own redirect to "/admin/" instead of the page,
      // which produced a 200 with an empty body and a stale Location
      // header when blindly re-wrapped below.
      const shellRes = await env.ASSETS.fetch(
        new Request(new URL("/admin/", url), request),
      );
      return new Response(shellRes.body, {
        status: 200,
        headers: shellRes.headers,
      });
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
