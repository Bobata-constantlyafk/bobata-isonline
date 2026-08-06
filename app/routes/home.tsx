import { Link } from "react-router";
import { DecodeName } from "~/components/hero/DecodeName";
import { useDecodeName } from "~/components/hero/useDecodeName";
import { TITLEBAR_GRADIENT, heroPanelStyle } from "~/lib/chromeStyles";
import type { Route } from "./+types/home";

const TICKER =
  "IRON // STOICS // RANKED // TENNIS // VINYL // 24 FRAMES // SIGNAL LOST // ";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Bobata" },
    {
      name: "description",
      content:
        "Entrepreneur, twenties. Iron and altitude before noon, Stoics after dark. Ranked ladder, tennis courts, a soundtrack running under all of it, and films taken apart frame by frame.",
    },
  ];
}

export default function Home() {
  const { text, chars, progress, log } = useDecodeName(0.3);

  return (
    <div className="relative flex flex-1 flex-col justify-center overflow-hidden px-[60px] py-[70px]">
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 right-0 top-0 h-[120px] animate-sweep"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, transparent, rgba(0,229,255,.06), transparent)",
        }}
      />

      <div style={heroPanelStyle}>
        <div
          style={{ backgroundImage: TITLEBAR_GRADIENT }}
          className="flex items-center justify-between border-b border-border px-3.5 py-[10px]"
        >
          <span className="text-[10px] tracking-[.3em] text-body">
            /dev/bobata — identity resolver
          </span>
          <span className="text-[10px] tracking-[.2em] text-acid-cyan">
            {progress}
          </span>
        </div>

        <div className="flex flex-col gap-7 px-[38px] pb-[44px] pt-[52px]">
          <div className="flex flex-col gap-[5px] text-[12px] tracking-[.1em]">
            <span className="text-muted">&gt; resolve --name --all-scripts</span>
            <span className="text-acid-green">&gt; {log}</span>
          </div>

          <DecodeName text={text} chars={chars} />

          <div
            className="h-px"
            style={{
              backgroundImage: "linear-gradient(to right, #00e5ff, transparent)",
            }}
          />

          <p
            className="m-0 max-w-[640px] text-[13px] leading-[1.9] tracking-[.06em] text-secondary"
            style={{ textWrap: "pretty" }}
          >
            Entrepreneur, twenties. Iron and altitude before noon, Stoics
            after dark. Ranked ladder, tennis courts, a soundtrack running
            under all of it, and films taken apart frame by frame.
          </p>

          <div className="flex gap-[14px]">
            <Link
              to="/work"
              className="btn-outline-cyan px-6 py-[13px] font-mono text-[11px] tracking-[.3em]"
            >
              ENTER THE LAIR
            </Link>
            <Link
              to="/articles"
              className="btn-outline-ghost px-6 py-[13px] font-mono text-[11px] tracking-[.3em]"
            >
              TRANSMISSIONS
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-7 overflow-hidden">
        <div className="flex animate-crawl gap-10 whitespace-nowrap text-[11px] tracking-[.32em] text-dim-2">
          <span>{TICKER}</span>
          <span>{TICKER}</span>
        </div>
      </div>
    </div>
  );
}
