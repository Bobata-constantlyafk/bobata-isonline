import { Link } from "react-router";
import type { Route } from "./+types/index";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Admin — Bobata" }];
}

const TILES = [
  {
    label: "INBOX",
    to: "/admin/inbox",
    desc: "Contact form submissions.",
    enabled: true,
  },
  {
    label: "ARTICLES",
    to: "/admin/articles",
    desc: "Write and publish.",
    enabled: true,
  },
  {
    label: "DIARY",
    to: "/admin/diary",
    desc: "Not designed yet.",
    enabled: false,
  },
];

export default function AdminHub() {
  return (
    <div className="grid grid-cols-3 gap-5">
      {TILES.map((tile) =>
        tile.enabled ? (
          <Link
            key={tile.label}
            to={tile.to}
            className="flex flex-col gap-2 border border-border-bright p-6 hover:border-acid-cyan"
          >
            <span className="font-display text-base text-bright">
              {tile.label}
            </span>
            <span className="text-[12px] text-secondary">{tile.desc}</span>
          </Link>
        ) : (
          <div
            key={tile.label}
            className="flex flex-col gap-2 border border-dashed border-hairline p-6 opacity-50"
          >
            <span className="font-display text-base text-dim">
              {tile.label}
            </span>
            <span className="text-[12px] text-dim">{tile.desc}</span>
          </div>
        ),
      )}
    </div>
  );
}
