import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig, type Plugin } from "vite";

/**
 * `vite dev` doesn't run Cloudflare Pages Functions, so POSTs to /api/contact
 * would 404 locally. This stands in for functions/api/contact.ts during dev
 * only — it validates nothing and sends nothing, it just echoes success so
 * the form's states can be exercised. Never part of the production build.
 */
function devContactMock(): Plugin {
  return {
    name: "bobata-dev-contact-mock",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/contact", (req, res) => {
        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", () => {
          console.log("[dev contact mock] received:", body);
          res.setHeader("content-type", "application/json");
          res.end(JSON.stringify({ ok: true, dev: true }));
        });
      });
    },
  };
}

export default defineConfig({
  plugins: [
    // Must run before the React Router plugin so .mdx is already JSX by the
    // time route/module transforms see it.
    { enforce: "pre", ...mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
    }) },
    tailwindcss(),
    reactRouter(),
    devContactMock(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
