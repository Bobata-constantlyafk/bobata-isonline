import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "~/lib/motion";

export const SCRIPTS = ["BOBATA", "БОБАТА", "ボバタ", "보바타"];
export const SCRIPT_NAMES = ["LATIN", "CYRILLIC", "KATAKANA", "HANGUL"];

const HEX = "0123456789ABCDEF";
const TICK_MS = 80;

function randomHex(len: number) {
  let s = "";
  for (let i = 0; i < len; i++) s += HEX[(Math.random() * HEX.length) | 0];
  return s;
}

interface DecodeState {
  idx: number;
  reveal: number;
  text: string;
}

const INITIAL: DecodeState = { idx: 0, reveal: 0, text: SCRIPTS[0] };
const RESOLVED: DecodeState = {
  idx: 0,
  reveal: SCRIPTS[0].length,
  text: SCRIPTS[0],
};

/**
 * The name-glitch decode algorithm from README.md's "The decode algorithm"
 * section, ported 1:1 from the reference component's tick(). Runs on an
 * 80ms interval, cycles LATIN -> CYRILLIC -> KATAKANA -> HANGUL, pauses
 * while the tab is hidden, and freezes on the resolved Latin name under
 * prefers-reduced-motion.
 */
export function useDecodeName(cycleSpeed = 0.3) {
  const reducedMotion = usePrefersReducedMotion();
  const [state, setState] = useState<DecodeState>(INITIAL);

  useEffect(() => {
    if (reducedMotion) {
      setState(RESOLVED);
      return;
    }

    const id = setInterval(() => {
      if (document.hidden) return;
      setState((prev) => {
        const target = SCRIPTS[prev.idx];
        const hold = Math.round(16 / Math.max(0.3, cycleSpeed));
        let idx = prev.idx;
        let reveal = prev.reveal;
        if (reveal <= target.length + hold) {
          reveal += 1;
        } else {
          reveal = 0;
          idx = (prev.idx + 1) % SCRIPTS.length;
        }
        const shown = Math.min(reveal, target.length);
        const text = target.slice(0, shown) + randomHex(Math.max(0, target.length - shown));
        return { idx, reveal, text };
      });
    }, TICK_MS);

    return () => clearInterval(id);
  }, [reducedMotion, cycleSpeed]);

  const target = SCRIPTS[state.idx];
  const pct = Math.min(
    100,
    Math.round((Math.min(state.reveal, target.length) / target.length) * 100),
  );
  const log =
    pct < 100
      ? `matching glyph table ${SCRIPT_NAMES[state.idx]}…`
      : `resolved: ${SCRIPT_NAMES[state.idx]}`;

  return {
    text: state.text,
    chars: state.text.split(""),
    progress: `${String(pct).padStart(3, "0")}%`,
    log,
  };
}
