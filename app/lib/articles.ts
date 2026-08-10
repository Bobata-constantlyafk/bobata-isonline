import type { ComponentType } from "react";
import { getSkin, type Skin } from "./skins";

export interface ListItemFrontmatter {
  title: string;
  meta: string;
  /** Pasted link, not an upload — no image storage is built. Absent items
   *  render a placeholder on the public row. */
  imageUrl?: string;
  /** Presence (not a separate flag) is what makes the row clickable and
   *  gives it a detail page at /articles/:slug/:position. */
  review?: string;
}

export interface ArticleFrontmatter {
  title: string;
  /** Name of a preset in skins.ts — drives the card and the detail page. */
  skin: string;
  type: "list" | "essay";
  /** Position in the /articles mosaic and the /blog channels. */
  order: number;
  date: string;
  /** Kicker prefix; the skin name is appended on the detail page. */
  kicker: string;
  /** Silkscreen badge on the article card: "09" for lists, "ESSAY" for essays. */
  badge: string;
  excerpt: string;

  /** Ranked lists only — nine rows, each with its own metadata column. */
  items?: ListItemFrontmatter[];
  /** Card background for the Blog page's Channel A tiles. */
  blogBackground?: string;
  blogKicker?: string;

  /** Essays only — row hover tint in the Blog page's Channel B list. */
  blogTint?: string;
}

export interface Article {
  slug: string;
  frontmatter: ArticleFrontmatter;
  skin: Skin;
  /** Compiled MDX body. Empty for ranked lists, which render from `items`. */
  Content: ComponentType<{ components?: Record<string, unknown> }>;
}

interface MdxModule {
  default: Article["Content"];
  frontmatter: ArticleFrontmatter;
}

// Eager because there are six short files and every one of them is
// prerendered at build time anyway — lazy loading would add a request
// waterfall to save a couple of KB.
const modules = import.meta.glob<MdxModule>("../content/articles/*.mdx", {
  eager: true,
});

export const ARTICLES: Article[] = Object.entries(modules)
  .map(([path, mod]) => ({
    slug: path.split("/").pop()!.replace(/\.mdx$/, ""),
    frontmatter: mod.frontmatter,
    skin: getSkin(mod.frontmatter.skin),
    Content: mod.default,
  }))
  .sort((a, b) => a.frontmatter.order - b.frontmatter.order);

export function getArticle(slug: string | undefined): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** A reviewable row on a ranked list: /articles/:slug/:position. `position`
 *  is 1-indexed to match what the public row numerals and the admin Nines
 *  editor already show — no separate zero-indexed id to keep straight. */
export function getListItem(
  slug: string | undefined,
  position: string | undefined,
): { article: Article; item: ListItemFrontmatter; position: number } | undefined {
  const article = getArticle(slug);
  if (!article || article.frontmatter.type !== "list") return undefined;
  const index = Number(position);
  if (!Number.isInteger(index) || index < 1) return undefined;
  const item = article.frontmatter.items?.[index - 1];
  if (!item) return undefined;
  return { article, item, position: index };
}

export const RANKED_LISTS = ARTICLES.filter((a) => a.frontmatter.type === "list");
export const ESSAYS = ARTICLES.filter((a) => a.frontmatter.type === "essay");
