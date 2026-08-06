import { useEffect, useState } from "react";

/**
 * Tracks prefers-reduced-motion. Starts `false` so prerendered/SSR markup
 * matches the client's first paint; flips to the real value on mount, which
 * is fine here since everything gated by this is decorative motion, not
 * layout — no visible flash of the wrong state.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
