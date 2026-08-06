import type { CSSProperties, ReactNode } from "react";
import { Link, useParams } from "react-router";
import { getArticle } from "~/lib/articles";
import { chromeTextStyle } from "~/lib/chromeStyles";
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

function BackButton({ skin, to }: { skin: Skin; to: string }) {
  return (
    <Link
      to={to}
      className="hover-invert self-start px-4 py-[9px] font-mono text-[10px] tracking-[.3em]"
      style={
        {
          "--edge": skin.backBorder,
          "--accent": skin.accent,
          "--void": skin.voidTone,
        } as CSSProperties
      }
    >
      ← BACK
    </Link>
  );
}

function Kicker({ skin, children }: { skin: Skin; children: ReactNode }) {
  return (
    <span
      className="text-[10px] tracking-[.32em]"
      style={{ color: skin.muted }}
    >
      {children}
    </span>
  );
}

/** Typography and glitch behavior are identical across articles — only the
 *  background/mood layer changes per skin. */
function Heading({
  skin,
  size,
  children,
}: {
  skin: Skin;
  size: number;
  children: ReactNode;
}) {
  return (
    <h1
      className={skin.h1Split ? "hover-split m-0 font-display" : "m-0 font-display"}
      style={
        {
          fontSize: size,
          lineHeight: size === 48 ? 1.2 : 1.25,
          ...(skin.h1Chrome ? chromeTextStyle : { color: skin.h1Color }),
          "--split": skin.h1Split,
        } as CSSProperties
      }
    >
      {children}
    </h1>
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

  const { frontmatter, skin, Content } = article;
  const isList = frontmatter.type === "list";

  return (
    <div
      className="flex-1 px-[60px] pb-[120px] pt-[70px]"
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
              <div
                key={item.title}
                className="hover-tint flex items-baseline gap-7 border-t px-1 py-5"
                style={
                  {
                    borderTopColor: skin.rowHairline,
                    "--tint": skin.rowHover,
                  } as CSSProperties
                }
              >
                <span
                  className="w-[60px] flex-none font-bitmap text-[26px]"
                  style={{ color: skin.accent }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {/* Title and metadata share a line on desktop. Real entries
                    carry long titles and full director names, which together
                    outgrow narrow viewports — below the rail breakpoint they
                    stack instead, so nothing wraps mid-title or overflows. */}
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
              </div>
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
