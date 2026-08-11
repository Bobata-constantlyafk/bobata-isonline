import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router";
import { chromeTextStyle } from "~/lib/chromeStyles";
import type { Skin } from "~/lib/skins";

/**
 * Shared between the article/list detail page and the per-item review
 * page — both are "a skinned detail screen with a back button, a kicker,
 * and a big heading," just with different content underneath.
 */

export function BackButton({ skin, to }: { skin: Skin; to: string }) {
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

export function Kicker({ skin, children }: { skin: Skin; children: ReactNode }) {
  return (
    <span className="text-[10px] tracking-[.32em]" style={{ color: skin.muted }}>
      {children}
    </span>
  );
}

/** Typography and glitch behavior are identical across articles — only the
 *  background/mood layer changes per skin. */
export function Heading({
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
          // clamp() floor, not a breakpoint jump — see PageHeader.tsx for
          // why. `size` (46/48) stays the exact desktop value.
          fontSize: `clamp(26px, 8vw, ${size}px)`,
          lineHeight: size >= 46 ? 1.2 : 1.25,
          ...(skin.h1Chrome ? chromeTextStyle : { color: skin.h1Color }),
          "--split": skin.h1Split,
        } as CSSProperties
      }
    >
      {children}
    </h1>
  );
}
