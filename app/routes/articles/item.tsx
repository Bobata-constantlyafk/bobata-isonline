import { Link, useParams } from "react-router";
import { BackButton, Heading, Kicker } from "~/components/articles/SkinChrome";
import { getListItem } from "~/lib/articles";
import { parseProseBlocks } from "~/lib/parseProseBlocks";
import type { Route } from "./+types/item";

export function meta({ params }: Route.MetaArgs) {
  const found = getListItem(params.slug, params.position);
  if (!found) return [{ title: "Not found — Bobata" }];
  return [
    { title: `${found.item.title} — ${found.article.frontmatter.title} — Bobata` },
  ];
}

const HATCH =
  "repeating-linear-gradient(135deg, #16191c 0 12px, #101315 12px 24px)";

/**
 * A single ranked-list row's review: title, image, prose. Reached only
 * from a row that has one (see RankedRow in ../articles/article.tsx) — a
 * row without a review has no link here at all, so this page is never a
 * dead end, only ever a destination.
 */
export default function ListItem() {
  const { slug, position } = useParams();
  const found = getListItem(slug, position);

  if (!found) {
    return (
      <div className="flex flex-1 flex-col gap-6 px-[60px] pb-[120px] pt-[70px]">
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

  const { article, item } = found;
  const { skin } = article;
  const blocks = item.review ? parseProseBlocks(item.review) : [];

  return (
    <div
      className="flex-1 px-[60px] pb-[120px] pt-[70px]"
      style={{ backgroundImage: skin.pageBackground }}
    >
      <div className="flex max-w-[780px] flex-col gap-[30px]">
        <BackButton skin={skin} to={`/articles/${article.slug}`} />
        <Kicker skin={skin}>
          REVIEW · {article.frontmatter.title} · SKIN: {skin.name}
        </Kicker>
        <Heading skin={skin} size={46}>
          {item.title}
        </Heading>

        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="max-h-[420px] w-full border object-cover"
            style={{ borderColor: skin.rowHairline }}
          />
        ) : (
          <div
            aria-hidden
            className="h-[240px] w-full border"
            style={{ backgroundImage: HATCH, borderColor: skin.rowHairline }}
          />
        )}

        <div className="h-px" style={{ backgroundImage: skin.ruleColor }} />

        <div className="flex flex-col gap-6">
          {blocks.map((block, i) =>
            block.type === "quote" ? (
              <blockquote
                key={i}
                className="m-0 py-1.5 pl-[22px] text-[18px] leading-[1.7]"
                style={{
                  borderLeft: `2px solid ${skin.quoteBorder}`,
                  color: skin.quoteColor,
                }}
              >
                {block.text}
              </blockquote>
            ) : (
              <p
                key={i}
                className="m-0 text-[15px] leading-[2]"
                style={{ color: skin.prose, textWrap: "pretty" }}
              >
                {block.text}
              </p>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
