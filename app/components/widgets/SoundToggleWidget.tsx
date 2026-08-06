import { useEffect, useState } from "react";
import { SLOT_GRADIENT } from "~/lib/chromeStyles";

const STORAGE_KEY = "bobata:sound";

/**
 * Muted by default, persisted to localStorage. Reads the stored value after
 * mount (not during initial render) so prerendered/first-paint markup always
 * shows the muted default and never mismatches a client that had sound on.
 */
export function SoundToggleWidget() {
  const [sound, setSound] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "on") setSound(true);
  }, []);

  const toggle = () => {
    setSound((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
      return next;
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      style={{
        backgroundImage: SLOT_GRADIENT,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.16)",
        border: "1px solid var(--edge, #6e7479)",
        color: "var(--ink, #c9d1d6)",
      }}
      className="px-[11px] py-[11px] text-left font-mono text-[10px] tracking-[.26em] hover:[--edge:#00e5ff] hover:[--ink:#00e5ff]"
    >
      {sound ? "◼ SOUND: ON" : "◻ SOUND: MUTED"}
    </button>
  );
}
