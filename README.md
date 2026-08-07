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
| `npm run dev` | Dev server on :5173 (site only, no Worker/D1) |
| `npm run build` | Production build + prerender every route |
| `npm run preview` | `wrangler dev` — full Worker + local D1, matches production |
| `npm run deploy` | Build, then `wrangler deploy` straight to Cloudflare |
| `npm run typecheck` | Typecheck the app and the Worker |

## How it's built

`ssr: false` plus a `prerender` list in `react-router.config.ts` means there is
no server for the site itself: every route becomes a static HTML file at
build time. Three small client islands hydrate on top — the decode hero, the
rail widgets, and the custom cursor. Article slugs are read from
`app/content/articles/*.mdx`, so adding a file adds a prerendered page.

Skins are defined once in `app/lib/skins.ts`. An article's `skin` frontmatter
field picks one, and both its card on `/articles` and its detail page read
every color from that preset.

A small Worker (`worker/index.ts`) sits in front of the static assets purely
to answer `/api/*` — everything else falls straight through to the prerendered
files. This is a Cloudflare **Worker**, not Pages: there is no `functions/`
directory, and Pages Functions conventions don't apply here.

## Data (Cloudflare D1)

One database, `bobata-db`, bound as `DB`. Schema lives in `migrations/` as
plain SQL files, applied with:

```bash
npx wrangler d1 migrations apply bobata-db --local   # your machine
npx wrangler d1 migrations apply bobata-db --remote  # live site
```

| Table | Holds |
|---|---|
| `messages` | Contact form submissions. `read`/`archived` are flags an admin toggles — nothing is deleted on view. |
| `counters` | Named single-row counters (`visitors` today), so a new counter is an `INSERT`, not a migration. |

## Deploying (Cloudflare Workers)

Connected to Git — pushing to the default branch builds and deploys
automatically. Root directory for the build is this repo's root (`package.json`
lives here, not in a subfolder).

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Node version | 22 (`.nvmrc`) |

### Secrets

Set these in the Worker's dashboard under Settings → Variables and Secrets, or
with `wrangler secret put <NAME>`. Never commit them.

| Name | Required | Notes |
|---|---|---|
| `RESEND_API_KEY` | optional | from resend.com/api-keys — enables an email notification alongside the D1 save |
| `CONTACT_TO` | optional | inbox that receives the notification |
| `CONTACT_FROM` | optional | verified sender, e.g. `Bobata <signal@example.com>` |

The contact form's one hard requirement is the `DB` binding (wired in
`wrangler.jsonc`, not a secret) — a submission is saved there regardless of
whether the three Resend variables above are set. If they're absent, the
message still saves; it just doesn't also get emailed.
