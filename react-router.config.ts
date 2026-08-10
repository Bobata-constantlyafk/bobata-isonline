import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Config } from "@react-router/dev/config";
import matter from "gray-matter";

// One prerendered page per MDX file — dropping a new article into
// app/content/articles is all it takes to get a route at build time.
const contentDir = fileURLToPath(
  new URL("./app/content/articles", import.meta.url),
);
const articleFiles = readdirSync(contentDir).filter((f) => f.endsWith(".mdx"));
const articleSlugs = articleFiles.map((f) => f.replace(/\.mdx$/, ""));

// Same idea for reviewable rows: a row only gets a prerendered page at
// /articles/:slug/:position if its frontmatter actually has a `review` —
// most rows won't, since this is opt-in per row, not every row on a list.
const reviewPaths: string[] = [];
for (const file of articleFiles) {
  const slug = file.replace(/\.mdx$/, "");
  const { data } = matter(readFileSync(`${contentDir}/${file}`, "utf8"));
  if (data.type !== "list" || !Array.isArray(data.items)) continue;
  data.items.forEach((item: { review?: string }, i: number) => {
    if (item.review) reviewPaths.push(`/articles/${slug}/${i + 1}`);
  });
}

export default {
  // Fully static: no server, everything prerendered to HTML at build time.
  // Deploys as static assets to a Cloudflare Worker; the three interactive
  // pieces (decode hero, rail widgets, cursor) hydrate as client islands.
  ssr: false,
  prerender: [
    "/",
    "/about",
    "/work",
    "/blog",
    "/articles",
    "/contact",
    // Static shells only — gated by Cloudflare Access at the edge, not by
    // anything in this file. Their content fetches from /api/admin/* after
    // mount, so prerendering them is safe: there's no admin data baked in.
    "/admin",
    "/admin/inbox",
    "/admin/articles",
    "/admin/articles/new",
    "/admin/diary",
    // /admin/articles/:slug (edit) is genuinely dynamic and NOT prerendered
    // per-slug — see the /admin/* fallback in worker/index.ts.
    ...articleSlugs.map((slug) => `/articles/${slug}`),
    ...reviewPaths,
  ],
} satisfies Config;
