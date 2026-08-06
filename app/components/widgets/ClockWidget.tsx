import { useEffect, useState } from "react";
import { WidgetSlot } from "./WidgetSlot";

function formatClock(d: Date) {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

/**
 * Prerendered/first-paint markup can't know the visitor's clock, so it
 * renders the placeholder dashes; the real time is filled in after mount to
 * avoid a hydration mismatch, then ticks every second.
 */
export function ClockWidget() {
  const [clock, setClock] = useState<string | null>(null);

  useEffect(() => {
    setClock(formatClock(new Date()));
    const id = setInterval(() => setClock(formatClock(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <WidgetSlot label="LOCAL TIME">
      <span className="font-bitmap text-[22px] text-bright">
        {clock ?? "--:--:--"}
      </span>
      <span className="text-[10px] tracking-[.18em] text-muted">
        GMT+03 // ATHENS
      </span>
    </WidgetSlot>
  );
}
