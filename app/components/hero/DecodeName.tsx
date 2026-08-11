/**
 * The name glitch: a magenta ghost offset behind the real name, which is
 * rendered one <span> per character so each can be hovered independently.
 *
 * Takes `text`/`chars` as props rather than calling useDecodeName itself —
 * the title bar progress readout and the log line above this need the exact
 * same tick, and two independent interval instances would only stay
 * numerically in sync by coincidence.
 */
// clamp() ceiling, not a breakpoint jump — see PageHeader.tsx. 96px is the
// desktop value, untouched above the width where the vw term crosses it.
const NAME_SIZE = "clamp(40px, 13vw, 96px)";

export function DecodeName({ text, chars }: { text: string; chars: string[] }) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 whitespace-nowrap font-display text-acid-magenta opacity-50"
        style={{ fontSize: NAME_SIZE, transform: "translate(-4px, 1px)" }}
      >
        {text}
      </div>
      <div
        className="relative flex whitespace-nowrap font-display"
        style={{ fontSize: NAME_SIZE }}
      >
        {chars.map((ch, i) => (
          <span key={i} className="chrome-char">
            {ch}
          </span>
        ))}
        {/* em-sized rather than a second clamp(): it scales with the name's
            own font-size automatically, so it can't drift out of proportion
            at any width. */}
        <span
          aria-hidden
          className="ml-[10px] animate-flick bg-acid-cyan"
          style={{ width: "0.36em", height: "0.9em" }}
        />
      </div>
    </div>
  );
}
