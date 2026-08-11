import { useState } from "react";
import { RAIL_GRADIENT } from "~/lib/chromeStyles";
import { ClockWidget } from "~/components/widgets/ClockWidget";
import { EmptyWidgetSlot } from "~/components/widgets/EmptyWidgetSlot";
import { MoodWidget } from "~/components/widgets/MoodWidget";
import { NowPlayingWidget } from "~/components/widgets/NowPlayingWidget";
import { SoundToggleWidget } from "~/components/widgets/SoundToggleWidget";
import { VisitorsWidget } from "~/components/widgets/VisitorsWidget";

// The rail body renders this list, in order. A seventh widget means a new
// entry here, not new layout — see WidgetSlot.tsx for the shared shell.
const WIDGETS = [
  { key: "now-playing", Component: NowPlayingWidget },
  { key: "clock", Component: ClockWidget },
  { key: "visitors", Component: VisitorsWidget },
  { key: "mood", Component: MoodWidget },
  { key: "sound", Component: SoundToggleWidget },
  { key: "empty", Component: EmptyWidgetSlot },
];

function RailHeader() {
  return (
    <div className="flex flex-col gap-1.5 border-b border-hairline-2 px-3.5 py-4">
      <span className="font-bitmap text-[13px] text-bright">BOBATA.HUD</span>
      <span className="text-[10px] tracking-[.22em] text-acid-cyan">
        ■ SIGNAL ACTIVE
      </span>
    </div>
  );
}

function RailBody() {
  return (
    <div className="flex flex-col gap-3 overflow-y-auto p-3.5">
      {WIDGETS.map(({ key, Component }) => (
        <Component key={key} />
      ))}
    </div>
  );
}

function RailFooter() {
  return (
    <div className="mt-auto border-t border-hairline-2 px-3.5 py-3 text-[9px] tracking-[.2em] text-dim">
      RAIL v0.1
    </div>
  );
}

/**
 * Persistent HUD panel bolted to the left of every route. Desktop keeps the
 * README's fixed 246px sticky column; between `sm` and `rail` (640-1100px)
 * it collapses into a top strip with a disclosure drawer; below `sm` it's
 * gone entirely — a phone screen has no room for a HUD rail on top of
 * everything else, and the widgets aren't essential to reading the page.
 */
export function Rail() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <aside
        style={{ backgroundImage: RAIL_GRADIENT }}
        className="sticky top-0 z-20 hidden h-screen w-[246px] flex-none flex-col self-start border-r border-border rail:flex"
      >
        <RailHeader />
        <RailBody />
        <RailFooter />
      </aside>

      <div
        style={{ backgroundImage: RAIL_GRADIENT }}
        className="sticky top-0 z-20 hidden border-b border-border sm:max-rail:block"
      >
        <button
          type="button"
          onClick={() => setDrawerOpen((v) => !v)}
          aria-expanded={drawerOpen}
          className="flex w-full items-center justify-between px-3.5 py-3"
        >
          <span className="flex items-center gap-3">
            <span className="font-bitmap text-[13px] text-bright">
              BOBATA.HUD
            </span>
            <span className="text-[10px] tracking-[.22em] text-acid-cyan">
              ■ SIGNAL ACTIVE
            </span>
          </span>
          <span className="text-[10px] tracking-[.22em] text-secondary">
            {drawerOpen ? "CLOSE ▲" : "WIDGETS ▼"}
          </span>
        </button>
        {drawerOpen && (
          <div className="max-h-[70vh] overflow-y-auto border-t border-hairline-2">
            <RailBody />
          </div>
        )}
      </div>
    </>
  );
}
