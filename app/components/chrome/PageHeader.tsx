import type { CSSProperties } from "react";
import { chromeTextStyle } from "~/lib/chromeStyles";

/** The `NAME` + `// kicker` header used at the top of every section page. */
export function PageHeader({
  title,
  kicker,
  kickerColor,
}: {
  title: string;
  kicker: string;
  kickerColor: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-5">
      {/* clamp() rather than a breakpoint jump: 62px is the desktop ceiling,
          not a fixed value, so this never overflows a narrow viewport and
          needs no separate mobile-only rule. flex-wrap is a zero-cost
          safety net — it only engages if the kicker still can't fit
          beside the shrunk title. */}
      <span
        className="font-display text-[clamp(28px,9vw,62px)]"
        style={chromeTextStyle}
      >
        {title}
      </span>
      <span
        className="text-[11px] tracking-[.3em]"
        style={{ color: kickerColor } as CSSProperties}
      >
        {kicker}
      </span>
    </div>
  );
}
