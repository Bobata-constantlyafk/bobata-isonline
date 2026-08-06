import { useEffect, useRef, useState } from "react";

/**
 * 46x46 reticle that tracks the pointer. Renders nothing until an effect
 * confirms (client-only) that the device has a fine pointer and the user
 * hasn't asked for reduced motion — this doubles as the hydration guard
 * (prerendered HTML and the first client render both show nothing) and the
 * touch/reduced-motion opt-out from the README.
 *
 * Mousemove mutates the ref'd DOM node's transform directly instead of
 * going through React state, so tracking never re-renders the tree.
 */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (isTouch || reducedMotion) return;

    setActive(true);
    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (el) el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    window.addEventListener("mousemove", onMove);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, []);

  if (!active) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className="animate-reticle"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: 46,
        height: 46,
        marginLeft: -23,
        marginTop: -23,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: 1,
          height: 46,
          background: "#00e5ff",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          height: 1,
          width: 46,
          background: "#00e5ff",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 15,
          top: 15,
          width: 16,
          height: 16,
          border: "1px solid #ff00a8",
        }}
      />
    </div>
  );
}
