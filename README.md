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
| `articles` | Every article/ranked-list — see "Articles live in D1" below. |
| `article_items` | The nine rows of a ranked-list article, FK'd to `articles`. |

| Endpoint | Reads/writes |
|---|---|
| `POST /api/contact` | Inserts into `messages`. Server-validated; a honeypot field silently no-ops. |
| `GET /api/visitors` | Reads `counters`, incrementing first unless the request carries a `bobata_visited` session cookie (no Max-Age — cleared when the browser closes, so the next visit counts again). |
| `GET/PATCH/DELETE /api/admin/messages(/:id)` | Admin inbox. Every handler re-verifies the Access JWT itself (`worker/access.ts`). |
| `GET/POST /api/admin/articles`, `GET/PATCH/DELETE /api/admin/articles/:slug` | Essay CRUD. Creating always makes `type='essay'`; PATCH/DELETE reject rows where `type='list'` — the ranked-list (Nines) editor is a separate, not-yet-built piece, so this guards against corrupting one with the wrong shape of form. |

### Articles live in D1, not just as files

`app/content/articles/*.mdx` still exists and is still what Vite's MDX plugin
compiles — but those files are now *generated*, not hand-written. The real
source of truth is the `articles`/`article_items` tables.

`scripts/fetch-articles-from-d1.mjs` runs as an npm `prebuild` step, before
every `npm run build`. It queries D1 over Cloudflare's REST API (there's no
Worker binding available on the build machine — bindings only exist inside a
deployed Worker) and rewrites the `.mdx` files to match, deleting any that
no longer correspond to a published row.

It requires `CF_D1_API_TOKEN` — **only on the machine actually building for
deploy.** If it's unset (any normal local `npm run build`), the script logs
that it's skipping and leaves whatever `.mdx` files are already on disk
untouched. Only Cloudflare's own build step needs the token, and it needs it
as a **build-time** variable, which on this project's dashboard is a separate
settings section from the Worker's runtime Variables and Secrets used
everywhere else in this README — look for something like "Build
configuration" / "Build variables", not "Variables and Secrets".

Create the token at My Profile → API Tokens → Create Custom Token, scoped to
your account, permission **Account → D1 → Read**. `scripts/generate-seed-sql.mjs`
is the one-time tool that produced `migrations/0003_seed_articles.sql` from
the original hand-written files; it's not part of any ongoing process.

## Deploying (Cloudflare Workers)

Connected to Git — pushing to the default branch builds and deploys
automatically. Root directory for the build is this repo's root (`package.json`
lives here, not in a subfolder).

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Node version | 22 (`.nvmrc`) |

### Secrets and variables

Set these in the Worker's dashboard under Settings → Variables and Secrets, or
with `wrangler secret put <NAME>`.

| Name | Required | Type | Notes |
|---|---|---|---|
| `RESEND_API_KEY` | optional | Secret | from resend.com/api-keys — enables an email notification alongside the D1 save |
| `CONTACT_TO` | optional | Plaintext | inbox that receives the notification |
| `CONTACT_FROM` | optional | Plaintext | verified sender, e.g. `Bobata <signal@example.com>` |
| `ACCESS_TEAM_DOMAIN` | required for `/admin` | Plaintext | e.g. `boyandechev.cloudflareaccess.com` — from Zero Trust → Settings → Custom Pages (or the team's overview page) |
| `ACCESS_AUD` | required for `/admin` | Plaintext | the Access Application's Audience tag, shown on the application's Overview page after it's created |

`ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` aren't secret — the AUD tag is already
inside every Access JWT's own `aud` claim, so exposing it grants nothing. Set
them as **Plaintext**, not Secret.

### Who can sign in to /admin

The Access Application's identity provider is **"Sign in with Cloudflare
account"**, not One-Time PIN. That means `/admin` only accepts Cloudflare
account members — the app's policy also lists `bobodech21@gmail.com` and
`boyandechevaz@gmail.com` under Include → Emails, but neither can actually
sign in, since the account-membership check happens before that policy is
ever evaluated. This is deliberate (chosen over email-OTP for anyone), not
a bug — if it ever needs to change, switch the Application's Authentication
tab to include One-Time PIN.

The contact form's one hard requirement is the `DB` binding (wired in
`wrangler.jsonc`, not a secret) — a submission is saved there regardless of
whether the three Resend variables above are set. If they're absent, the
message still saves; it just doesn't also get emailed.
