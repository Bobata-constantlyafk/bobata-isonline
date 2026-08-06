/**
 * The six named skins. This is the content model: an article's `skin`
 * frontmatter field picks one by name, and both its card on /articles and
 * its detail page read every color from the preset it resolves to.
 *
 * Adding a seventh article means adding a preset here — not writing new CSS
 * in two places. Every value is lifted literally from
 * design_handoff_bobata_site/Bobata Site.dc.html.
 *
 * Two groups of fields are extrapolated rather than quoted, because the
 * design only ever pairs three skins with lists and three with essays:
 *  - `prose`/`quoteBorder`/`quoteColor`/`ruleColor` on the three list skins
 *  - `rowHairline`/`rowHover` on the three essay skins
 * They exist so any skin works with either article type. Quote borders follow
 * the design's rule of contrasting with the page accent, not matching it.
 */
export interface Skin {
  /** Display name, as printed in the `SKIN: <NAME>` tag and page kicker. */
  name: string;
  /** Badge, card border-on-hover, numerals, rule and back-button color. */
  accent: string;
  /** `SKIN:` tag color — BRUSHED STEEL is the one skin where it isn't `accent`. */
  tagColor: string;
  /** Darkest tone of the page gradient; used as text color when a button inverts. */
  voidTone: string;

  /* ---- /articles card ---- */
  cardBackground: string;
  cardTexture: string;
  /** Top border of the card's caption block. */
  captionBorder: string;
  cardTitle: string;
  /** Card excerpt + detail-page kicker and row metadata. */
  muted: string;

  /* ---- detail page ---- */
  pageBackground: string;
  backBorder: string;
  h1Color: string;
  /** BRUSHED STEEL fills its H1 with the chrome gradient instead of a flat tone. */
  h1Chrome: boolean;
  /** RGB-split applied on H1 hover. Absent for the chrome-gradient H1. */
  h1Split?: string;
  /** Fading rule under the H1 on essay pages. */
  ruleColor: string;

  /* ---- ranked-list rows ---- */
  rowHairline: string;
  rowHover: string;

  /* ---- essay prose ---- */
  prose: string;
  /** Deliberately a *different* accent from the page skin, so the tension
   *  between chrome and acid stays visible. */
  quoteBorder: string;
  quoteColor: string;
}

export const SKINS = {
  "STATIC RED": {
    name: "STATIC RED",
    accent: "#ff2d55",
    tagColor: "#ff2d55",
    voidTone: "#0a0507",
    cardBackground: "linear-gradient(170deg, #2a1216, #0a0507 70%)",
    cardTexture:
      "repeating-linear-gradient(to bottom, rgba(255,45,85,.09) 0 2px, transparent 2px 5px)",
    captionBorder: "#5a3038",
    cardTitle: "#ffe8ec",
    muted: "#c9a3ab",
    pageBackground: "linear-gradient(180deg, #2a1216, #0a0507 55%)",
    backBorder: "#5a3038",
    h1Color: "#ffe8ec",
    h1Chrome: false,
    h1Split: "4px 0 #00e5ff, -4px 0 #ff2d55",
    ruleColor: "linear-gradient(to right, #ff2d55, transparent)",
    rowHairline: "#4a2027",
    rowHover: "rgba(255,45,85,.07)",
    prose: "#e6c8ce",
    quoteBorder: "#00e5ff",
    quoteColor: "#ffe8ec",
  },
  "NEON CHROME": {
    name: "NEON CHROME",
    accent: "#00e5ff",
    tagColor: "#00e5ff",
    voidTone: "#050a0b",
    cardBackground: "linear-gradient(170deg, #0b2a30, #050a0b 70%)",
    cardTexture:
      "repeating-linear-gradient(90deg, rgba(0,229,255,.1) 0 1px, transparent 1px 7px)",
    captionBorder: "#1e5a63",
    cardTitle: "#dffaff",
    muted: "#93b8bf",
    pageBackground: "linear-gradient(180deg, #0b2a30, #050a0b 55%)",
    backBorder: "#1e5a63",
    h1Color: "#dffaff",
    h1Chrome: false,
    h1Split: "4px 0 #ff00a8, -4px 0 #00e5ff",
    ruleColor: "linear-gradient(to right, #00e5ff, transparent)",
    rowHairline: "#164048",
    rowHover: "rgba(0,229,255,.07)",
    prose: "#c2dfe4",
    quoteBorder: "#a3ff12",
    quoteColor: "#dffaff",
  },
  "ACID INK": {
    name: "ACID INK",
    accent: "#a3ff12",
    tagColor: "#a3ff12",
    voidTone: "#070a05",
    cardBackground: "linear-gradient(170deg, #1d2a0d, #070a05 70%)",
    cardTexture:
      "radial-gradient(circle at 30% 30%, rgba(163,255,18,.14), transparent 60%)",
    captionBorder: "#45611c",
    cardTitle: "#f0ffdc",
    muted: "#a8bd8a",
    pageBackground: "linear-gradient(180deg, #1d2a0d, #070a05 55%)",
    backBorder: "#45611c",
    h1Color: "#f0ffdc",
    h1Chrome: false,
    h1Split: "4px 0 #ff00a8, -4px 0 #a3ff12",
    ruleColor: "linear-gradient(to right, #a3ff12, transparent)",
    rowHairline: "#33470f",
    rowHover: "rgba(163,255,18,.07)",
    prose: "#d3e2c0",
    quoteBorder: "#ff00a8",
    quoteColor: "#f0ffdc",
  },
  "BRUSHED STEEL": {
    name: "BRUSHED STEEL",
    accent: "#e8eef1",
    tagColor: "#c9d1d6",
    voidTone: "#0c0d0f",
    cardBackground: "linear-gradient(200deg, #2b2f33, #0c0d0f 68%)",
    cardTexture:
      "linear-gradient(115deg, rgba(255,255,255,.16), transparent 38%, rgba(255,255,255,.09) 62%, transparent)",
    captionBorder: "#4a5055",
    cardTitle: "#e8eef1",
    muted: "#8f989e",
    pageBackground: "linear-gradient(200deg, #2b2f33, #0c0d0f 62%)",
    backBorder: "#4a5055",
    h1Color: "#e8eef1",
    h1Chrome: true,
    ruleColor: "linear-gradient(to right, #e8eef1, transparent)",
    rowHairline: "#3a3f44",
    rowHover: "rgba(232,238,241,.07)",
    prose: "#c9d1d6",
    quoteBorder: "#a3ff12",
    quoteColor: "#e8eef1",
  },
  "MAGENTA BURN": {
    name: "MAGENTA BURN",
    accent: "#ff00a8",
    tagColor: "#ff00a8",
    voidTone: "#08050a",
    cardBackground: "linear-gradient(155deg, #2a1030, #08050a 70%)",
    cardTexture:
      "repeating-linear-gradient(45deg, rgba(255,0,168,.1) 0 6px, transparent 6px 16px)",
    captionBorder: "#5c1c53",
    cardTitle: "#ffdff4",
    muted: "#bf93b3",
    pageBackground: "linear-gradient(155deg, #2a1030, #08050a 62%)",
    backBorder: "#5c1c53",
    h1Color: "#ffdff4",
    h1Chrome: false,
    h1Split: "5px 0 #00e5ff, -5px 0 #ff00a8",
    ruleColor: "linear-gradient(to right, #ff00a8, transparent)",
    rowHairline: "#43163c",
    rowHover: "rgba(255,0,168,.07)",
    prose: "#e3c9dc",
    quoteBorder: "#00e5ff",
    quoteColor: "#ffdff4",
  },
  "COLD BLUE": {
    name: "COLD BLUE",
    accent: "#6ea8ff",
    tagColor: "#6ea8ff",
    voidTone: "#05070a",
    cardBackground: "linear-gradient(185deg, #101c2b, #05070a 70%)",
    cardTexture:
      "linear-gradient(to bottom, rgba(110,168,255,.14), transparent 55%), repeating-linear-gradient(to bottom, rgba(255,255,255,.05) 0 1px, transparent 1px 4px)",
    captionBorder: "#2c4568",
    cardTitle: "#dfeaff",
    muted: "#93a5bf",
    pageBackground: "linear-gradient(185deg, #101c2b, #05070a 62%)",
    backBorder: "#2c4568",
    h1Color: "#dfeaff",
    h1Chrome: false,
    h1Split: "5px 0 #ff00a8, -5px 0 #6ea8ff",
    ruleColor: "linear-gradient(to right, #6ea8ff, transparent)",
    rowHairline: "#22334d",
    rowHover: "rgba(110,168,255,.07)",
    prose: "#c2d2e6",
    quoteBorder: "#a3ff12",
    quoteColor: "#dfeaff",
  },
} as const satisfies Record<string, Skin>;

export type SkinName = keyof typeof SKINS;

export function getSkin(name: string): Skin {
  const skin = SKINS[name as SkinName];
  if (!skin) {
    throw new Error(
      `Unknown skin "${name}". Valid skins: ${Object.keys(SKINS).join(", ")}`,
    );
  }
  return skin;
}
