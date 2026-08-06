import { NavLink } from "react-router";
import { NAV_GRADIENT } from "~/lib/chromeStyles";

const NAV_ITEMS = [
  { label: "HOME", to: "/", end: true },
  { label: "ABOUT", to: "/about", end: false },
  { label: "WORK", to: "/work", end: false },
  { label: "BLOG", to: "/blog", end: false },
  { label: "ARTICLES", to: "/articles", end: false },
  { label: "CONTACT", to: "/contact", end: false },
];

export function TopNav() {
  return (
    <nav
      style={{ backgroundImage: NAV_GRADIENT }}
      className="sticky top-0 z-30 flex border-b border-border"
    >
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            [
              "flex-1 border-r border-hairline px-0 py-4 text-center font-mono text-[11px] tracking-[.28em] transition-none",
              "hover:bg-[rgba(0,229,255,.07)] hover:text-acid-cyan hover:[text-shadow:2px_0_#ff00a8,-2px_0_#a3ff12]",
              isActive
                ? "bg-[rgba(0,229,255,.07)] text-acid-cyan shadow-[inset_0_-2px_0_#00e5ff]"
                : "text-secondary",
            ].join(" ")
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
