import { WidgetSlot } from "./WidgetSlot";

/**
 * Static in the prototype; wiring this to Spotify's "recently played" via a
 * serverless route (revalidated every few minutes) is a later phase — see
 * README's State Management table.
 */
export function NowPlayingWidget() {
  return (
    <WidgetSlot label="NOW PLAYING">
      <span className="text-[12px] leading-[1.35] text-bright">
        UNKNOWN ARTIST — B-SIDE 04
      </span>
      <div className="h-1 border border-[#3d4247] bg-[#1a1d20]">
        <div className="h-full animate-bar bg-acid-cyan" />
      </div>
      <span className="text-[10px] text-muted">01:47 / 04:12</span>
    </WidgetSlot>
  );
}
