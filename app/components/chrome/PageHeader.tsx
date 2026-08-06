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
    <div className="flex items-baseline gap-5">
      <span className="font-display text-[62px]" style={chromeTextStyle}>
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
