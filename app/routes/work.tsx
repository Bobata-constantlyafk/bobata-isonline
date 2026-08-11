import type { CSSProperties } from "react";
import { PageHeader } from "~/components/chrome/PageHeader";
import type { Route } from "./+types/work";

const HATCH =
  "repeating-linear-gradient(135deg, #16191c 0 12px, #101315 12px 24px)";

/**
 * Six artifacts on a 12-column grid with 116px auto-rows. Note the holes:
 * nothing occupies columns 1–2 on the bottom rows. That asymmetry is the
 * composition, not an oversight.
 *
 * Titles are Lorem Ipsum placeholders and the image tiles are hatched
 * blocks — both awaiting real content.
 */
type Tile =
  | {
      kind: "image";
      title: string;
      meta: string;
      column: string;
      rowSpan: number;
      background: string;
      slotLabel: string;
      /** The first tile's caption sits on one baseline; the third stacks. */
      captionLayout: "inline" | "stacked";
      titleSize: number;
      accent: string;
      shift: string;
    }
  | {
      kind: "type";
      title: string;
      meta: string;
      label: string;
      column: string;
      rowSpan: number;
      accent: string;
      shift: string;
      split: string;
    }
  | {
      kind: "bar";
      title: string;
      meta: string;
      column: string;
      accent: string;
      hoverBg: string;
    };

const TILES: Tile[] = [
  {
    kind: "image",
    title: "Lorem Ipsum",
    meta: "2026 · VENTURE",
    column: "1 / 7",
    rowSpan: 3,
    background: "linear-gradient(150deg, #2a2d31, #0b0c0e 60%)",
    slotLabel: "IMAGE SLOT 2400×1600",
    captionLayout: "inline",
    titleSize: 17,
    accent: "#00e5ff",
    shift: "translate(-3px, -3px)",
  },
  {
    kind: "type",
    title: "Dolor Sit",
    meta: "2025 · SOUND",
    label: "TYPE ONLY",
    column: "7 / 10",
    rowSpan: 2,
    accent: "#ff00a8",
    shift: "translate(3px, -2px)",
    split: "3px 0 #ff00a8, -3px 0 #00e5ff",
  },
  {
    kind: "image",
    title: "Consectetur",
    meta: "2025 · FILM",
    column: "10 / 13",
    rowSpan: 3,
    background: "linear-gradient(200deg, #2a2d31, #0b0c0e 65%)",
    slotLabel: "IMAGE SLOT",
    captionLayout: "stacked",
    titleSize: 16,
    accent: "#a3ff12",
    shift: "translate(0, -4px)",
  },
  {
    kind: "bar",
    title: "Adipiscing",
    meta: "2024",
    column: "7 / 10",
    accent: "#00e5ff",
    hoverBg: "#101417",
  },
  {
    kind: "bar",
    title: "Elit Sed",
    meta: "2024 · WRITING",
    column: "2 / 6",
    accent: "#ff00a8",
    hoverBg: "#141013",
  },
  {
    kind: "bar",
    title: "Tempor Incididunt",
    meta: "2023 · VISUALS",
    column: "6 / 11",
    accent: "#a3ff12",
    hoverBg: "#10130d",
  },
];

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Work — Bobata" },
    { name: "description", content: "Six artifacts." },
  ];
}

export default function Work() {
  return (
    <div className="flex flex-col gap-[46px] page-px pb-[120px] pt-[80px]">
      <PageHeader title="WORK" kicker="// 06 ARTIFACTS" kickerColor="#a3ff12" />

      <div className="tile-grid grid grid-cols-12 gap-5 [grid-auto-rows:116px]">
        {TILES.map((tile) => {
          if (tile.kind === "bar") {
            return (
              <div
                key={tile.title}
                className="hover-tile flex items-center justify-between border border-border bg-[#0d0e10] px-[22px] py-[18px]"
                style={
                  {
                    gridColumn: tile.column,
                    "--accent": tile.accent,
                    "--hover-bg": tile.hoverBg,
                  } as CSSProperties
                }
              >
                <span className="font-display text-[15px] text-body">
                  {tile.title}
                </span>
                <span className="text-[10px] tracking-[.24em] text-muted">
                  {tile.meta}
                </span>
              </div>
            );
          }

          if (tile.kind === "type") {
            return (
              <div
                key={tile.title}
                className="hover-shift flex flex-col justify-between border border-border-bright p-[22px] shadow-[inset_0_1px_0_rgba(255,255,255,.14)]"
                style={
                  {
                    gridColumn: tile.column,
                    gridRow: `span ${tile.rowSpan}`,
                    backgroundImage:
                      "linear-gradient(160deg, #23262a, #0d0e10)",
                    "--accent": tile.accent,
                    "--shift": tile.shift,
                  } as CSSProperties
                }
              >
                <span className="text-[9px] tracking-[.3em] text-muted">
                  {tile.label}
                </span>
                <span
                  className="hover-split font-display text-[22px] leading-[1.25] text-bright"
                  style={{ "--split": tile.split } as CSSProperties}
                >
                  {tile.title}
                </span>
                <span className="text-[10px] tracking-[.24em] text-secondary">
                  {tile.meta}
                </span>
              </div>
            );
          }

          return (
            <div
              key={tile.title}
              className="hover-shift flex flex-col border border-border-bright shadow-[inset_0_1px_0_rgba(255,255,255,.14)]"
              style={
                {
                  gridColumn: tile.column,
                  gridRow: `span ${tile.rowSpan}`,
                  backgroundImage: tile.background,
                  "--accent": tile.accent,
                  "--shift": tile.shift,
                } as CSSProperties
              }
            >
              <div
                className="flex flex-1 items-center justify-center text-[10px] tracking-[.3em] text-dim-2"
                style={{ backgroundImage: HATCH }}
              >
                {tile.slotLabel}
              </div>
              <div
                className={
                  tile.captionLayout === "inline"
                    ? "flex items-baseline justify-between border-t border-border px-[18px] py-4"
                    : "flex flex-col gap-[5px] border-t border-border px-[18px] py-4"
                }
              >
                <span
                  className="font-display text-bright"
                  style={{ fontSize: tile.titleSize }}
                >
                  {tile.title}
                </span>
                <span className="text-[10px] tracking-[.24em] text-muted">
                  {tile.meta}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
