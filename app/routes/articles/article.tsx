import type { CSSProperties, ReactNode } from "react";
import { Link, useParams } from "react-router";
import { BackButton, Heading, Kicker } from "~/components/articles/SkinChrome";
import { getArticle, type ListItemFrontmatter } from "~/lib/articles";
import type { Skin } from "~/lib/skins";
import type { Route } from "./+types/article";

export function meta({ params }: Route.MetaArgs) {
  const article = getArticle(params.slug);
  if (!article) return [{ title: "Not found — Bobata" }];
  return [
    { title: `${article.frontmatter.title} — Bobata` },
    { name: "description", content: article.frontmatter.excerpt },
  ];
}

const HATCH =
  "repeating-linear-gradient(135deg, #16191c 0 8px, #101315 8px 16px)";

/** Poster-style row thumbnail. Images are pasted links, not uploads — no
 *  storage is built for this — so absent ones render the same hatch
 *  placeholder used for Work page image slots, just smaller. */
function RowThumb({ src, alt }: { src?: string; alt: string }) {
  if (!src) {
    return (
      <div
        aria-hidden
        className="h-16 w-11 flex-none border border-hairline"
        style={{ backgroundImage: HATCH }}
      />
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="h-16 w-11 flex-none border border-hairline object-cover"
    />
  );
}

/**
 * One numbered row on a ranked list. Only rows with a `review` are
 * clickable — presence of the content is the switch, not a separate flag —
 * marked with an accent left-border, a "REVIEW →" tag, and a link to the
 * detail page instead of a plain div. Link and div need separate JSX
 * blocks here rather than a dynamic tag: React Router's LinkProps makes
 * `to` required, so a component var typed as `Link | "div"` can't accept
 * conditionally-spread props without losing type safety.
 */
function RankedRow({
  item,
  index,
  skin,
  slug,
}: {
  item: ListItemFrontmatter;
  index: number;
  skin: Skin;
  slug: string;
}) {
  const hasReview = Boolean(item.review);
  const className = "hover-tint flex items-center gap-7 border-t border-l-2 px-1 py-4";
  const style = {
    borderTopColor: skin.rowHairline,
    borderLeftColor: hasReview ? skin.accent : "transparent",
    "--tint": skin.rowHover,
  } as CSSProperties;

  const content = (
    <>
      <span
        className="w-[60px] flex-none font-bitmap text-[26px]"
        style={{ color: skin.accent }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <RowThumb src={item.imageUrl} alt={item.title} />
      {/* Title and metadata share a line on desktop. Real entries carry
          long titles and full director names, which together outgrow
          narrow viewports — below the rail breakpoint they stack instead,
          so nothing wraps mid-title or overflows. */}
      <div className="flex min-w-0 flex-1 flex-col gap-2 rail:flex-row rail:items-baseline rail:gap-7">
        <span
          className="min-w-0 flex-1 font-display text-[20px]"
          style={{ color: skin.h1Color }}
        >
          {item.title}
        </span>
        <span
          className="text-[11px] tracking-[.2em] rail:whitespace-nowrap"
          style={{ color: skin.muted }}
        >
          {item.meta}
        </span>
      </div>
      {hasReview && (
        <span
          className="flex-none text-[10px] tracking-[.2em]"
          style={{ color: skin.accent }}
        >
          REVIEW →
        </span>
      )}
    </>
  );

  if (hasReview) {
    return (
      <Link to={`/articles/${slug}/${index + 1}`} className={className} style={style}>
        {content}
      </Link>
    );
  }
  return (
    <div className={className} style={style}>
      {content}
    </div>
  );
}

/** Prose element map handed to MDX, carrying the skin's body and quote tones. */
function proseComponents(skin: Skin) {
  return {
    p: (props: { children?: ReactNode }) => (
      <p
        className="m-0 text-[15px] leading-[2]"
        style={{ color: skin.prose, textWrap: "pretty" }}
        {...props}
      />
    ),
    blockquote: (props: { children?: ReactNode }) => (
      <blockquote
        className="m-0 py-1.5 pl-[22px] text-[18px] leading-[1.7]"
        style={{
          borderLeft: `2px solid ${skin.quoteBorder}`,
          color: skin.quoteColor,
        }}
        {...props}
      />
    ),
  };
}

export default function Article() {
  const { slug } = useParams();
  const article = getArticle(slug);

  if (!article) {
    return (
      <div className="flex flex-1 flex-col gap-6 page-px pb-[120px] pt-[70px]">
        <span className="font-display text-[46px] text-bright">NOT FOUND</span>
        <Link
          to="/articles"
          className="btn-outline-ghost self-start px-6 py-[13px] font-mono text-[11px] tracking-[.3em]"
        >
          ← BACK
        </Link>
      </div>
    );
  }

  const { frontmatter, skin, Content } = article;
  const isList = frontmatter.type === "list";

  return (
    <div
      className="flex-1 page-px pb-[120px] pt-[70px]"
      style={{ backgroundImage: skin.pageBackground }}
    >
      {isList ? (
        <div className="flex max-w-[860px] flex-col gap-[34px]">
          {/* Ranked lists are reached from the Blog hub's Channel A. */}
          <BackButton skin={skin} to="/blog" />
          <div className="flex flex-col gap-3">
            <Kicker skin={skin}>
              {frontmatter.kicker} · SKIN: {skin.name}
            </Kicker>
            <Heading skin={skin} size={48}>
              {frontmatter.title}
            </Heading>
          </div>
          <div className="flex flex-col">
            {frontmatter.items?.map((item, i) => (
              <RankedRow
                key={item.title}
                item={item}
                index={i}
                skin={skin}
                slug={article.slug}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex max-w-[780px] flex-col gap-[30px]">
          <BackButton skin={skin} to="/articles" />
          <Kicker skin={skin}>
            {frontmatter.date} · {frontmatter.kicker} · SKIN: {skin.name}
          </Kicker>
          <Heading skin={skin} size={46}>
            {frontmatter.title}
          </Heading>
          <div
            className="h-px"
            style={{ backgroundImage: skin.ruleColor }}
          />
          <Content components={proseComponents(skin)} />
        </div>
      )}
    </div>
  );
}
