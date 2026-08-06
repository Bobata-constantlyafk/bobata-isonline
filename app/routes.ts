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
] satisfies RouteConfig;
