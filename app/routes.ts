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
  // Gated by Cloudflare Access at the edge (see worker/access.ts); this
  // route itself is just static shell markup either way.
  route("admin", "routes/admin.tsx"),
] satisfies RouteConfig;
