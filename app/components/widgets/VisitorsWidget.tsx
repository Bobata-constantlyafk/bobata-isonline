import { useEffect, useState } from "react";
import { WidgetSlot } from "./WidgetSlot";

const BASE = 4092;

/**
 * Placeholder counter, ticking client-side like the prototype. The real
 * version is a Cloudflare Pages Function backed by KV, incrementing once per
 * session — a later phase; this widget will swap its data source for a
 * fetch to /api/visitors without changing its shell.
 */
export function VisitorsWidget() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const start = Date.now();
    const update = () => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      setCount(BASE + Math.floor(elapsed / 90));
    };
    update();
    const id = setInterval(update, 5000);
    return () => clearInterval(id);
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
