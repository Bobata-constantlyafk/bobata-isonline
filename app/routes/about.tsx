import type { CSSProperties } from "react";
import { PageHeader } from "~/components/chrome/PageHeader";
import { cardStyle } from "~/lib/chromeStyles";
import type { Route } from "./+types/about";

/**
 * Four fragments, deliberately out of alignment on a 12-column grid — the
 * misalignment is the composition. Grid spans and offsets are literal from
 * the design.
 */
const FRAGMENTS = [
  {
    label: "FRAGMENT 01 — BODY",
    body: "Barbell first, questions later. Trails, cold water, long days outside. The body is the first argument you have to win.",
    column: "1 / 6",
    marginTop: 0,
    accent: "#a3ff12",
  },
  {
    label: "FRAGMENT 02 — MIND",
    body: "Athens on repeat. Epictetus in the notes app, Heraclitus in the margins. Still looking for the thing under the thing.",
    column: "7 / 13",
    marginTop: 46,
    accent: "#ff00a8",
  },
  {
    label: "FRAGMENT 03 — COMPETITION",
    body: "Ranked ladder, tennis court, whatever keeps score. Losing is data. Winning is data with better lighting.",
    column: "2 / 8",
    marginTop: 10,
    accent: "#00e5ff",
  },
  {
    label: "FRAGMENT 04 — SIGNAL",
    body: "A soundtrack for every year of it. Films watched twice: once for the story, once for the seams.",
    column: "8 / 13",
    marginTop: 0,
    accent: "#a3ff12",
  },
];

export function meta(_: Route.MetaArgs) {
  return [
    { title: "About — Bobata" },
    { name: "description", content: "Fragments, not a bio." },
  ];
}

export default function About() {
  return (
    <div className="flex flex-col gap-[54px] page-px pb-[120px] pt-[80px]">
      <PageHeader
        title="ABOUT"
        kicker="// FRAGMENTS, NOT A BIO"
        kickerColor="#ff00a8"
      />

      <div className="grid grid-cols-12 gap-[22px]">
        {FRAGMENTS.map((fragment) => (
          <div
            key={fragment.label}
            className="hover-border p-[26px]"
            style={
              {
                ...cardStyle,
                gridColumn: fragment.column,
                marginTop: fragment.marginTop,
                "--accent": fragment.accent,
              } as CSSProperties
            }
          >
            <span className="text-[9px] tracking-[.3em] text-muted">
              {fragment.label}
            </span>
            <p
              className="mt-[14px] mb-0 text-[14px] leading-[1.95] text-body"
              style={{ textWrap: "pretty" }}
            >
              {fragment.body}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5 border-t border-hairline pt-[26px] text-[12px] tracking-[.08em] text-muted">
        <span>&gt; cat /etc/bobata/creed</span>
        <span className="text-acid-green">
          &gt; know the thing, then break it, then rebuild it heavier.
        </span>
      </div>
    </div>
  );
}
