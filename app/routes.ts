import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("components/layout/SiteLayout.tsx", [
    index("routes/home.tsx"),
    route("about", "routes/about.tsx"),
    route("work", "routes/work.tsx"),
    route("blog", "routes/blog.tsx"),
    route("articles", "routes/articles/index.tsx"),
    route("articles/:slug", "routes/articles/article.tsx"),
    route("contact", "routes/contact.tsx"),
  ]),
  // Deliberately outside SiteLayout — this is an operations tool, not part
  // of the public persona site, so it skips the rail/nav/cursor chrome.
  // Gated by Cloudflare Access at the edge (see worker/access.ts); every
  // route under here is static shell markup either way, fetching real data
  // client-side after mount once the Access session is confirmed.
  layout("routes/admin/layout.tsx", [
    // layout() contributes no path segment of its own, so each child spells
    // out the full "admin/..." path — an index() here would resolve to "/"
    // and collide with the public home route above.
    route("admin", "routes/admin/index.tsx"),
    route("admin/inbox", "routes/admin/inbox.tsx"),
    route("admin/articles", "routes/admin/articles.tsx"),
    route("admin/diary", "routes/admin/diary.tsx"),
  ]),
] satisfies RouteConfig;
