import { useEffect, useState } from "react";
import { WidgetSlot } from "./WidgetSlot";

/**
 * Real count, read from D1 via the Worker's /api/visitors — see
 * worker/visitors.ts. That endpoint gates the increment behind a session
 * cookie, so a refresh doesn't inflate it; this component just displays
 * whatever it's told.
 *
 * Only reachable through the Worker (wrangler dev / production). Under
 * plain `npm run dev` there's no Worker to answer, so a failed fetch is
 * swallowed and the placeholder dashes stay up rather than throwing.
 */
export function VisitorsWidget() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/visitors")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { visitors: number }) => {
        if (!cancelled) setCount(data.visitors);
      })
      .catch(() => {
        // No Worker reachable — leave the placeholder showing.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <WidgetSlot label="VISITORS">
      <span className="font-bitmap text-[20px] text-acid-green">
        {count === null ? "------" : String(count).padStart(6, "0")}
      </span>
      <span className="text-[10px] text-muted">SINCE 1998 (ALLEGEDLY)</span>
    </WidgetSlot>
  );
}
