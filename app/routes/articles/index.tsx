import type { CSSProperties } from "react";
import { Link } from "react-router";
import { PageHeader } from "~/components/chrome/PageHeader";
import { ARTICLES } from "~/lib/articles";
import type { Route } from "./+types/index";

/**
 * Per-position mosaic jitter. Cards are staggered vertically so the grid
 * never sits on one baseline, and each hovers with a translate plus a small
 * rotation — they should feel like loose trading cards.
 *
 * Indexed by position and cycled, so a seventh article picks up the pattern
 * without anyone editing CSS.
 */
const STAGGER = [0, 26, 0, 18, 0, 30];
const HOVER_SHIFT = [
  "translate(-3px, -4px) rotate(-.4deg)",
  "translate(3px, -4px) rotate(.5deg)",
  "translate(-2px, -5px) rotate(-.6deg)",
  "translate(-3px, -4px) rotate(.4deg)",
  "translate(2px, -5px) rotate(-.5deg)",
  "translate(-2px, -3px) rotate(.6deg)",
];

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Articles — Bobata" },
    { name: "description", content: "Collect all six." },
  ];
}

export default function ArticlesIndex() {
  return (
    <div className="flex flex-col gap-[46px] px-[60px] pb-[120px] pt-[80px]">
      <PageHeader
        title="ARTICLES"
        kicker="// COLLECT ALL SIX"
        kickerColor="#ff00a8"
      />

      <div className="grid grid-cols-3 gap-6">
        {ARTICLES.map(({ slug, frontmatter, skin }, i) => (
          <Link
            key={slug}
            to={`/articles/${slug}`}
            className="hover-shift flex h-[340px] flex-col border border-border-bright p-0 text-left font-mono shadow-[inset_0_1px_0_rgba(255,255,255,.14)]"
            style={
              {
                backgroundImage: skin.cardBackground,
                marginTop: STAGGER[i % STAGGER.length],
                "--accent": skin.accent,
                "--shift": HOVER_SHIFT[i % HOVER_SHIFT.length],
              } as CSSProperties
            }
          >
            <div
              className="flex flex-1 items-end p-5"
              style={{ backgroundImage: skin.cardTexture }}
            >
              <span
                className="font-bitmap"
                style={{
                  color: skin.accent,
                  fontSize: frontmatter.type === "list" ? 46 : 20,
                }}
              >
                {frontmatter.badge}
              </span>
            </div>
            <div
              className="flex flex-col gap-[9px] border-t p-[18px]"
              style={{ borderTopColor: skin.captionBorder }}
            >
              <span
                className="font-display text-[15px] leading-[1.35]"
                style={{ color: skin.cardTitle }}
              >
                {frontmatter.title}
              </span>
              <span
                className="text-[11px] leading-[1.7]"
                style={{ color: skin.muted }}
              >
                {frontmatter.excerpt}
              </span>
              <span
                className="text-[9px] tracking-[.28em]"
                style={{ color: skin.tagColor }}
              >
                SKIN: {skin.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
