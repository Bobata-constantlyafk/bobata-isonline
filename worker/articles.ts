import { SKINS } from "../app/lib/skins";
import { verifyAccessJwt, type AccessEnv } from "./access";

export interface ArticlesEnv extends AccessEnv {
  DB: D1Database;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function requireAdmin(request: Request, env: ArticlesEnv) {
  return verifyAccessJwt(request, env);
}

const VALID_SKINS = new Set(Object.keys(SKINS));
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_TITLE = 200;
const MAX_EXCERPT = 400;
const MAX_BODY = 20000;

interface ArticleRow {
  id: number;
  slug: string;
  title: string;
  skin: string;
  type: string;
  sort_order: number;
  date: string;
  kicker: string;
  badge: string;
  excerpt: string;
  blog_kicker: string | null;
  blog_background: string | null;
  blog_tint: string | null;
  body: string | null;
  published: number;
}

function toApiShape(row: ArticleRow) {
  return {
    slug: row.slug,
    title: row.title,
    skin: row.skin,
    type: row.type,
    sortOrder: row.sort_order,
    date: row.date,
    kicker: row.kicker,
    badge: row.badge,
    excerpt: row.excerpt,
    blogTint: row.blog_tint,
    body: row.body,
    published: row.published === 1,
  };
}

/** GET /api/admin/articles — every article, list and essay alike. */
export async function handleListArticles(
  request: Request,
  env: ArticlesEnv,
): Promise<Response> {
  if (!(await requireAdmin(request, env))) {
    return json({ ok: false, error: "UNAUTHORIZED" }, 401);
  }
  const { results } = await env.DB.prepare(
    "SELECT id, slug, title, skin, type, sort_order, date, kicker, badge, excerpt, blog_kicker, blog_background, blog_tint, body, published FROM articles ORDER BY sort_order",
  ).all<ArticleRow>();
  return json({ ok: true, articles: results.map(toApiShape) });
}

/** GET /api/admin/articles/:slug — list-type rows also carry their nine
 *  items, so this one endpoint serves both the essay editor and (read-only)
 *  the Nines editor's initial load. */
export async function handleGetArticle(
  request: Request,
  env: ArticlesEnv,
  slug: string,
): Promise<Response> {
  if (!(await requireAdmin(request, env))) {
    return json({ ok: false, error: "UNAUTHORIZED" }, 401);
  }
  const row = await env.DB.prepare(
    "SELECT id, slug, title, skin, type, sort_order, date, kicker, badge, excerpt, blog_kicker, blog_background, blog_tint, body, published FROM articles WHERE slug = ?",
  )
    .bind(slug)
    .first<ArticleRow>();
  if (!row) return json({ ok: false, error: "NOT FOUND" }, 404);

  if (row.type === "list") {
    const { results } = await env.DB.prepare(
      "SELECT title, meta, image_url, review FROM article_items WHERE article_id = ? ORDER BY position",
    )
      .bind(row.id)
      .all<{
        title: string;
        meta: string;
        image_url: string | null;
        review: string | null;
      }>();
    return json({
      ok: true,
      article: {
        ...toApiShape(row),
        items: results.map((r) => ({
          title: r.title,
          meta: r.meta,
          imageUrl: r.image_url,
          review: r.review,
        })),
      },
    });
  }

  return json({ ok: true, article: toApiShape(row) });
}

interface EssayInput {
  title?: unknown;
  slug?: unknown;
  skin?: unknown;
  date?: unknown;
  excerpt?: unknown;
  blogTint?: unknown;
  body?: unknown;
  published?: unknown;
}

/** Shared validation for create and update — returns an error string, or
 *  null if the input is acceptable to write. */
function validateEssayInput(input: EssayInput, requireAll: boolean) {
  if (requireAll || input.title !== undefined) {
    if (typeof input.title !== "string" || !input.title.trim() || input.title.length > MAX_TITLE) {
      return "INVALID TITLE";
    }
  }
  if (requireAll || input.slug !== undefined) {
    if (typeof input.slug !== "string" || !SLUG_RE.test(input.slug)) {
      return "INVALID SLUG — lowercase letters, numbers, hyphens only";
    }
  }
  if (requireAll || input.skin !== undefined) {
    if (typeof input.skin !== "string" || !VALID_SKINS.has(input.skin)) {
      return "INVALID SKIN";
    }
  }
  if (requireAll || input.date !== undefined) {
    if (typeof input.date !== "string" || !input.date.trim()) {
      return "INVALID DATE";
    }
  }
  if (requireAll || input.excerpt !== undefined) {
    if (typeof input.excerpt !== "string" || !input.excerpt.trim() || input.excerpt.length > MAX_EXCERPT) {
      return "INVALID EXCERPT";
    }
  }
  if (requireAll || input.body !== undefined) {
    if (typeof input.body !== "string" || !input.body.trim() || input.body.length > MAX_BODY) {
      return "INVALID BODY";
    }
  }
  if (input.blogTint !== undefined && typeof input.blogTint !== "string") {
    return "INVALID BLOG TINT";
  }
  if (input.published !== undefined && typeof input.published !== "boolean") {
    return "INVALID PUBLISHED FLAG";
  }
  return null;
}

/** POST /api/admin/articles — always creates an essay. List-type articles
 *  (the Nines) aren't created through this endpoint — see worker/access.ts
 *  comment pattern; that editor is a separate, not-yet-built piece. */
export async function handleCreateArticle(
  request: Request,
  env: ArticlesEnv,
): Promise<Response> {
  if (!(await requireAdmin(request, env))) {
    return json({ ok: false, error: "UNAUTHORIZED" }, 401);
  }

  let input: EssayInput;
  try {
    input = await request.json();
  } catch {
    return json({ ok: false, error: "MALFORMED PAYLOAD" }, 400);
  }

  const error = validateEssayInput(input, true);
  if (error) return json({ ok: false, error }, 400);

  const existing = await env.DB.prepare(
    "SELECT 1 FROM articles WHERE slug = ?",
  )
    .bind(input.slug)
    .first();
  if (existing) {
    return json({ ok: false, error: "SLUG ALREADY IN USE" }, 409);
  }

  const { results } = await env.DB.prepare(
    "SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM articles",
  ).all<{ next: number }>();
  const nextOrder = results[0]?.next ?? 1;

  await env.DB.prepare(
    `INSERT INTO articles
      (slug, title, skin, type, sort_order, date, kicker, badge, excerpt, blog_tint, body, published)
     VALUES (?, ?, ?, 'essay', ?, ?, 'ESSAY', 'ESSAY', ?, ?, ?, ?)`,
  )
    .bind(
      input.slug,
      input.title,
      input.skin,
      nextOrder,
      input.date,
      input.excerpt,
      typeof input.blogTint === "string" ? input.blogTint : null,
      input.body,
      input.published === false ? 0 : 1,
    )
    .run();

  return json({ ok: true, slug: input.slug }, 201);
}

/** PATCH /api/admin/articles/:slug — essays only; rejects list-type rows,
 *  which have no editor yet and shouldn't be silently corrupted by one
 *  built for the wrong shape. */
export async function handleUpdateArticle(
  request: Request,
  env: ArticlesEnv,
  slug: string,
): Promise<Response> {
  if (!(await requireAdmin(request, env))) {
    return json({ ok: false, error: "UNAUTHORIZED" }, 401);
  }

  const existing = await env.DB.prepare(
    "SELECT type FROM articles WHERE slug = ?",
  )
    .bind(slug)
    .first<{ type: string }>();
  if (!existing) return json({ ok: false, error: "NOT FOUND" }, 404);
  if (existing.type !== "essay") {
    return json(
      { ok: false, error: "RANKED LISTS AREN'T EDITABLE HERE YET" },
      400,
    );
  }

  let input: EssayInput;
  try {
    input = await request.json();
  } catch {
    return json({ ok: false, error: "MALFORMED PAYLOAD" }, 400);
  }

  const error = validateEssayInput(input, false);
  if (error) return json({ ok: false, error }, 400);

  if (typeof input.slug === "string" && input.slug !== slug) {
    const clash = await env.DB.prepare(
      "SELECT 1 FROM articles WHERE slug = ?",
    )
      .bind(input.slug)
      .first();
    if (clash) return json({ ok: false, error: "SLUG ALREADY IN USE" }, 409);
  }

  const sets: string[] = [];
  const values: (string | number)[] = [];
  const fieldMap: Record<string, string> = {
    title: "title",
    slug: "slug",
    skin: "skin",
    date: "date",
    excerpt: "excerpt",
    body: "body",
  };
  for (const [key, column] of Object.entries(fieldMap)) {
    const value = input[key as keyof EssayInput];
    if (typeof value === "string") {
      sets.push(`${column} = ?`);
      values.push(value);
    }
  }
  if (input.blogTint !== undefined) {
    sets.push("blog_tint = ?");
    values.push(typeof input.blogTint === "string" ? input.blogTint : "");
  }
  if (typeof input.published === "boolean") {
    sets.push("published = ?");
    values.push(input.published ? 1 : 0);
  }

  if (sets.length === 0) {
    return json({ ok: false, error: "NOTHING TO UPDATE" }, 400);
  }

  await env.DB.prepare(`UPDATE articles SET ${sets.join(", ")} WHERE slug = ?`)
    .bind(...values, slug)
    .run();

  return json({ ok: true });
}

/** DELETE /api/admin/articles/:slug — either type. article_items cascades
 *  via the FK in migrations/0002_articles.sql, so deleting a list-type row
 *  also removes its nine items in the same statement. */
export async function handleDeleteArticle(
  request: Request,
  env: ArticlesEnv,
  slug: string,
): Promise<Response> {
  if (!(await requireAdmin(request, env))) {
    return json({ ok: false, error: "UNAUTHORIZED" }, 401);
  }

  const existing = await env.DB.prepare(
    "SELECT 1 FROM articles WHERE slug = ?",
  )
    .bind(slug)
    .first();
  if (!existing) return json({ ok: false, error: "NOT FOUND" }, 404);

  await env.DB.prepare("DELETE FROM articles WHERE slug = ?").bind(slug).run();
  return json({ ok: true });
}
