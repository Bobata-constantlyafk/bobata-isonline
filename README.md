# Bobata's Personal Website
Welcome back, wanderer. 



S
## Local development

```bash
npm install
npm run dev
```

| Script | Does |
|---|---|
| `npm run dev` | Dev server on :5173 |
| `npm run build` | Production build + prerender every route |
| `npm run preview` | Serve the built output locally |
| `npm run typecheck` | Typecheck the app and the Pages Functions |

## How it's built

`ssr: false` plus a `prerender` list in `react-router.config.ts` means there is
no server: every route becomes a static HTML file at build time. Three small
client islands hydrate on top — the decode hero, the rail widgets, and the
custom cursor. Article slugs are read from `app/content/articles/*.mdx`, so
adding a file adds a prerendered page.

Skins are defined once in `app/lib/skins.ts`. An article's `skin` frontmatter
field picks one, and both its card on `/articles` and its detail page read
every color from that preset.

## Deploying (Cloudflare Pages)

Connected to Git — pushing to `main` builds and deploys automatically.

| Setting | Value |
|---|---|
| Root directory | `bobata-isonline` |
| Build command | `npm run build` |
| Build output directory | `build/client` |
| Node version | 22 (`.nvmrc`, or a `NODE_VERSION` variable) |

### Environment variables

Set these in the Pages project under Settings → Environment variables. They are
secrets — never commit them.

| Name | Used by | Notes |
|---|---|---|
| `RESEND_API_KEY` | `functions/api/contact.ts` | from resend.com/api-keys |
| `CONTACT_TO` | same | inbox that receives form submissions |
| `CONTACT_FROM` | same | verified sender, e.g. `Bobata <signal@example.com>` |

Until these are set the contact form returns `CHANNEL OFFLINE`. Locally, a Vite
middleware in `vite.config.ts` stands in for the function and only logs the
submission — it never sends mail.
