const GRAIN_SVG =
  "data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22160%22 height=%22160%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%221%22 numOctaves=%222%22/></filter><rect width=%22160%22 height=%22160%22 filter=%22url(%23n)%22/></svg>";

/**
 * Fixed, non-interactive full-viewport layers: scanlines then grain.
 * Purely CSS/SVG — no client JS needed, so this renders identically on
 * every route without hydration cost.
 */
export function GlobalOverlays() {
  return (
    <>
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 900,
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(0,229,255,.045) 0px, rgba(0,229,255,.045) 1px, transparent 1px, transparent 3px)",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 901,
          opacity: 0.17,
          backgroundImage: `url('${GRAIN_SVG}')`,
        }}
      />
    </>
  );
}
