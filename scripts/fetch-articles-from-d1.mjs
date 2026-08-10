// Runs before every build (see package.json "prebuild"). Regenerates
// app/content/articles/*.mdx from the `articles`/`article_items` tables in
// D1, so admin edits (a later task) go live on the next deploy without
// anyone hand-editing a file.
//
// The site itself never talks to D1 over HTTP — only the deployed Worker
// does, through its binding (see worker/messages.ts). This script runs on
// the build machine, outside the Worker runtime, so it has no binding to
// use and reaches D1 through Cloudflare's REST API instead, authenticated
// with a scoped API token.
//
// CF_D1_API_TOKEN is intentionally the only required env var. If it's
// unset (e.g. a local `npm run build` on a machine that was never given
// one), this script logs why and exits 0 without touching anything —
// build proceeds using whatever .mdx files already happen to be on disk.
// Only Cloudflare's build step, which has the token, produces a build that
// reflects the live database.

import {
  mkdirSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { dump as dumpYaml } from "js-yaml";

const ACCOUNT_ID = "02931da89c029f78392d65620298964f";
const DATABASE_ID = "7193bfed-b884-4e80-bdbb-8c6aa30bead3";

const contentDir = fileURLToPath(
  new URL("../app/content/articles", import.meta.url),
);

async function queryD1(sql) {
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.CF_D1_API_TOKEN}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ sql }),
    },
  );
  const body = await res.json();
  if (!res.ok || !body.success) {
    throw new Error(
      `D1 query failed: ${res.status} ${JSON.stringify(body.errors)}`,
    );
  }
  return body.result[0].results;
}

async function main() {
  if (!process.env.CF_D1_API_TOKEN) {
    console.log(
      "[fetch-articles-from-d1] CF_D1_API_TOKEN not set — skipping, using existing app/content/articles/*.mdx as-is.",
    );
    return;
  }

  const articles = await queryD1(
    "SELECT * FROM articles WHERE published = 1 ORDER BY sort_order",
  );
  const items = await queryD1(
    "SELECT * FROM article_items ORDER BY article_id, position",
  );

  const itemsByArticle = new Map();
  for (const item of items) {
    const list = itemsByArticle.get(item.article_id) ?? [];
    list.push({ title: item.title, meta: item.meta });
    itemsByArticle.set(item.article_id, list);
  }

  mkdirSync(contentDir, { recursive: true });

  const keepFiles = new Set();
  for (const a of articles) {
    const frontmatter = {
      title: a.title,
      skin: a.skin,
      type: a.type,
      order: a.sort_order,
      date: a.date,
      kicker: a.kicker,
      badge: a.badge,
      excerpt: a.excerpt,
    };
    if (a.type === "list") {
      frontmatter.blogKicker = a.blog_kicker;
      frontmatter.blogBackground = a.blog_background;
      frontmatter.items = itemsByArticle.get(a.id) ?? [];
    } else {
      frontmatter.blogTint = a.blog_tint;
    }

    const yamlText = dumpYaml(frontmatter, { lineWidth: -1 });
    const body = a.type === "essay" ? `\n${a.body ?? ""}\n` : "";
    const fileName = `${a.slug}.mdx`;
    writeFileSync(
      `${contentDir}/${fileName}`,
      `---\n${yamlText}---\n${body}`,
    );
    keepFiles.add(fileName);
  }

  // Anything on disk that D1 no longer lists (unpublished/deleted) is
  // removed, so the build doesn't keep serving stale content forever.
  for (const existing of readdirSync(contentDir)) {
    if (existing.endsWith(".mdx") && !keepFiles.has(existing)) {
      rmSync(`${contentDir}/${existing}`);
      console.log(`[fetch-articles-from-d1] removed stale ${existing}`);
    }
  }

  console.log(
    `[fetch-articles-from-d1] wrote ${articles.length} articles from D1.`,
  );
}

main().catch((error) => {
  console.error("[fetch-articles-from-d1] failed:", error);
  process.exit(1);
});
