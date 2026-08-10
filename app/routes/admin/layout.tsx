import { NavLink, Outlet } from "react-router";
import { useAdminSession } from "~/lib/useAdminSession";

const SECTIONS = [
  { label: "INBOX", to: "/admin/inbox" },
  { label: "ARTICLES", to: "/admin/articles" },
  { label: "DIARY", to: "/admin/diary" },
];

/**
 * Shell for every /admin/* page. Deliberately not SiteLayout — no rail, no
 * top nav, no custom cursor, no scanline overlays. This is a tool, not part
 * of Bobata's public persona.
 */
export default function AdminLayout() {
  const session = useAdminSession();

  return (
    <div className="min-h-screen bg-void font-mono text-body">
      <header className="flex items-center justify-between border-b border-hairline px-8 py-5">
        <div className="flex items-baseline gap-6">
          <NavLink to="/admin" className="font-display text-lg text-bright">
            ADMIN
          </NavLink>
          <nav className="flex gap-5 text-[11px] tracking-[.2em] text-secondary">
            {SECTIONS.map((s) => (
              <NavLink
                key={s.to}
                to={s.to}
                className={({ isActive }) =>
                  isActive ? "text-acid-cyan" : "hover:text-bright"
                }
              >
                {s.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <span className="text-[11px] text-dim">
          {session.state === "ok" && session.email}
        </span>
      </header>

      <main className="px-8 py-8">
        {session.state === "checking" && (
          <p className="text-sm text-secondary">Checking session…</p>
        )}
        {session.state === "denied" && (
          <p className="text-sm text-acid-magenta">
            Not authorized. This session has no valid Access token.
          </p>
        )}
        {session.state === "ok" && <Outlet />}
      </main>
    </div>
  );
}
