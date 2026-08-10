import { verifyAccessJwt, type AccessEnv } from "./access";

export interface ListsEnv extends AccessEnv {
  DB: D1Database;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function requireAdmin(request: Request, env: ListsEnv) {
  return verifyAccessJwt(request, env);
}

const MAX_TITLE = 120;
const MAX_META = 60;
const ITEM_COUNT = 9;

interface ItemInput {
  title?: unknown;
  meta?: unknown;
}

/**
 * PATCH /api/admin/lists/:slug — replaces all nine rows of a ranked-list
 * article. Deliberately its own endpoint and its own validation, separate
 * from the essay PATCH in worker/articles.ts: the payload shape (nine
 * title/meta pairs) has nothing in common with an essay's fields, and this
 * only ever touches article_items, never the articles row itself.
 */
export async function handleUpdateListItems(
  request: Request,
  env: ListsEnv,
  slug: string,
): Promise<Response> {
  if (!(await requireAdmin(request, env))) {
    return json({ ok: false, error: "UNAUTHORIZED" }, 401);
  }

  const article = await env.DB.prepare(
    "SELECT id, type FROM articles WHERE slug = ?",
  )
    .bind(slug)
    .first<{ id: number; type: string }>();
  if (!article) return json({ ok: false, error: "NOT FOUND" }, 404);
  if (article.type !== "list") {
    return json({ ok: false, error: "THIS ARTICLE ISN'T A RANKED LIST" }, 400);
  }

  let body: { items?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "MALFORMED PAYLOAD" }, 400);
  }

  if (!Array.isArray(body.items) || body.items.length !== ITEM_COUNT) {
    return json(
      { ok: false, error: `EXPECTED EXACTLY ${ITEM_COUNT} ITEMS` },
      400,
    );
  }

  const items: { title: string; meta: string }[] = [];
  for (const [i, raw] of body.items.entries()) {
    const item = raw as ItemInput;
    if (
      typeof item.title !== "string" ||
      !item.title.trim() ||
      item.title.length > MAX_TITLE
    ) {
      return json({ ok: false, error: `ROW ${i + 1}: INVALID TITLE` }, 400);
    }
    if (
      typeof item.meta !== "string" ||
      !item.meta.trim() ||
      item.meta.length > MAX_META
    ) {
      return json({ ok: false, error: `ROW ${i + 1}: INVALID META` }, 400);
    }
    items.push({ title: item.title, meta: item.meta });
  }

  // Replace-all rather than diff-and-update: nine rows is little enough
  // that "delete then reinsert" is simpler and just as correct, and
  // env.DB.batch() runs every statement in one atomic transaction — no
  // window where the list is missing rows if this fails partway through.
  await env.DB.batch([
    env.DB.prepare("DELETE FROM article_items WHERE article_id = ?").bind(
      article.id,
    ),
    ...items.map((item, i) =>
      env.DB.prepare(
        "INSERT INTO article_items (article_id, position, title, meta) VALUES (?, ?, ?, ?)",
      ).bind(article.id, i + 1, item.title, item.meta),
    ),
  ]);

  return json({ ok: true });
}
