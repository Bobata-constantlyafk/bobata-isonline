import { readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { Config } from "@react-router/dev/config";

// One prerendered page per MDX file — dropping a new article into
// app/content/articles is all it takes to get a route at build time.
const contentDir = fileURLToPath(
  new URL("./app/content/articles", import.meta.url),
);
const articleSlugs = readdirSync(contentDir)
  .filter((file) => file.endsWith(".mdx"))
  .map((file) => file.replace(/\.mdx$/, ""));

export default {
  // Fully static: no server, everything prerendered to HTML at build time.
  // Deploys as static assets to Cloudflare Pages; the three interactive
  // pieces (decode hero, rail widgets, cursor) hydrate as client islands.
  ssr: false,
  prerender: [
    "/",
    "/about",
    "/work",
    "/blog",
    "/articles",
    "/contact",
    ...articleSlugs.map((slug) => `/articles/${slug}`),
  ],
} satisfies Config;
