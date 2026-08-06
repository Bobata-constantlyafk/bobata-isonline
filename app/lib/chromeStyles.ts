import type { CSSProperties } from "react";

/**
 * Literal gradient/shadow recipes lifted verbatim from
 * design_handoff_bobata_site/Bobata Site.dc.html — the source is the spec,
 * so these strings are not meant to be "cleaned up", just centralized so
 * every component that needs the chrome surface reads the same values.
 */

export const CHROME_TEXT_GRADIENT =
  "linear-gradient(178deg, #ffffff 0%, #d6dde1 24%, #626a70 48%, #ffffff 56%, #949da3 76%, #e8eef1 100%)";

/** Display type filled with the chrome gradient via background-clip. */
export const chromeTextStyle: CSSProperties = {
  backgroundImage: CHROME_TEXT_GRADIENT,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  WebkitTextFillColor: "transparent",
  color: "transparent",
};

/** HUD widget slot / chrome panel recipe. */
export const SLOT_GRADIENT = "linear-gradient(160deg, #2a2d31, #0e0f11 46%, #23262a)";
export const slotStyle: CSSProperties = {
  border: "1px solid #6e7479",
  backgroundImage: SLOT_GRADIENT,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,.16)",
};

export const RAIL_GRADIENT = "linear-gradient(180deg, #14171a, #0a0b0d)";
export const NAV_GRADIENT = "linear-gradient(180deg, #101315, #08090b)";
export const TITLEBAR_GRADIENT = "linear-gradient(180deg, #2c3034, #16191c)";

/** Home hero terminal panel — chrome recipe plus a cyan bloom shadow. */
export const HERO_PANEL_GRADIENT =
  "linear-gradient(160deg, rgba(42,45,49,.9), rgba(10,11,13,.92) 46%, rgba(35,38,42,.9))";
export const heroPanelStyle: CSSProperties = {
  border: "1px solid #6e7479",
  backgroundImage: HERO_PANEL_GRADIENT,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,.16), 0 0 60px rgba(0,229,255,.06)",
};

/** Contact terminal panel — same recipe, no bloom. */
export const CONTACT_PANEL_GRADIENT =
  "linear-gradient(160deg, rgba(42,45,49,.9), rgba(10,11,13,.94) 50%)";
export const contactPanelStyle: CSSProperties = {
  border: "1px solid #6e7479",
  backgroundImage: CONTACT_PANEL_GRADIENT,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,.16)",
};

/** About fragment cards / generic raised card. */
export const CARD_GRADIENT = "linear-gradient(160deg, #23262a, #0d0e10)";
export const cardStyle: CSSProperties = {
  border: "1px solid #6e7479",
  backgroundImage: CARD_GRADIENT,
  boxShadow: "inset 0 1px 0 rgba(255,255,255,.14)",
};
