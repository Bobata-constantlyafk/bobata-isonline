import type { CSSProperties } from "react";
import { Link } from "react-router";
import { PageHeader } from "~/components/chrome/PageHeader";
import { ESSAYS, RANKED_LISTS } from "~/lib/articles";
import type { Route } from "./+types/blog";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Blog — Bobata" },
    { name: "description", content: "Two channels: ranked lists and long form." },
  ];
}

export default function Blog() {
  return (
    <div className="flex flex-col gap-[50px] page-px pb-[120px] pt-[80px]">
      <PageHeader title="BLOG" kicker="// TWO CHANNELS" kickerColor="#00e5ff" />

      <section className="flex flex-col gap-4">
        <span className="text-[10px] tracking-[.34em] text-secondary">
          CHANNEL A — THE NINES (RANKED LISTS)
        </span>
        <div className="grid grid-cols-3 gap-[18px]">
          {RANKED_LISTS.map(({ slug, frontmatter, skin }) => (
            <Link
              key={slug}
              to={`/articles/${slug}`}
              className="hover-shift flex flex-col gap-3 border border-border-bright px-[22px] py-[26px] text-left font-mono shadow-[inset_0_1px_0_rgba(255,255,255,.12)]"
              style={
                {
                  backgroundImage: frontmatter.blogBackground,
                  "--accent": skin.accent,
                  "--shift": "translate(-2px, -3px)",
                } as CSSProperties
              }
            >
              <span
                className="font-bitmap text-[30px]"
                style={{ color: skin.accent }}
              >
                {frontmatter.badge}
              </span>
              <span className="font-display text-[17px] leading-[1.35] text-bright">
                {frontmatter.title}
              </span>
              <span className="text-[10px] tracking-[.26em] text-secondary">
                {frontmatter.blogKicker}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <span className="text-[10px] tracking-[.34em] text-secondary">
          CHANNEL B — LONG FORM
        </span>
        <div className="flex flex-col">
          {ESSAYS.map(({ slug, frontmatter }, i) => (
            <Link
              key={slug}
              to={`/articles/${slug}`}
              className={`hover-tint flex items-baseline gap-[26px] border-t border-hairline px-1 py-5 text-left font-mono ${
                i === ESSAYS.length - 1 ? "border-b" : ""
              }`}
              style={{ "--tint": frontmatter.blogTint } as CSSProperties}
            >
              <span className="w-[90px] flex-none text-[10px] tracking-[.24em] text-dim">
                {frontmatter.date}
              </span>
              <span className="flex-1 font-display text-[18px] text-bright">
                {frontmatter.title}
              </span>
              <span className="text-[10px] tracking-[.24em] text-acid-magenta">
                READ →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
