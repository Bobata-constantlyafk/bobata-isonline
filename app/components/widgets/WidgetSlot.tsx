import type { ReactNode } from "react";
import { slotStyle } from "~/lib/chromeStyles";

/**
 * The chrome slot recipe shared by every rail widget: label, then content.
 * New widgets are new children of this shell, not new CSS — see the rail
 * widget list in Rail.tsx.
 */
export function WidgetSlot({
  label,
  children,
  gap = "gap-2",
}: {
  label: string;
  children: ReactNode;
  gap?: string;
}) {
  return (
    <div
      style={slotStyle}
      className={`flex flex-col ${gap} px-[11px] pt-[10px] pb-3`}
    >
      <span className="text-[9px] tracking-[.3em] text-secondary">
        {label}
      </span>
      {children}
    </div>
  );
}
