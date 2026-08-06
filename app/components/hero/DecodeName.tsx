/**
 * The name glitch: a magenta ghost offset behind the real name, which is
 * rendered one <span> per character so each can be hovered independently.
 *
 * Takes `text`/`chars` as props rather than calling useDecodeName itself —
 * the title bar progress readout and the log line above this need the exact
 * same tick, and two independent interval instances would only stay
 * numerically in sync by coincidence.
 */
export function DecodeName({ text, chars }: { text: string; chars: string[] }) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 whitespace-nowrap font-display text-[96px] text-acid-magenta opacity-50"
        style={{ transform: "translate(-4px, 1px)" }}
      >
        {text}
      </div>
      <div className="relative flex whitespace-nowrap font-display text-[96px]">
        {chars.map((ch, i) => (
          <span key={i} className="chrome-char">
            {ch}
          </span>
        ))}
        <span
          aria-hidden
          className="ml-[10px] w-[34px] animate-flick bg-acid-cyan"
          style={{ height: 86 }}
        />
      </div>
    </div>
  );
}
