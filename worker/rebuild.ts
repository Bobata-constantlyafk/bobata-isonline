// Every admin write only touches D1 — the live site is static HTML that
// only reflects D1 once a build runs (see scripts/fetch-articles-from-d1.mjs).
// Cloudflare Workers Builds is already connected to this repo and rebuilds
// on every push to REF, but it has no webhook to trigger a rebuild without
// a new commit. So this pushes a trivial empty commit instead, via a GitHub
// Actions workflow (.github/workflows/publish-rebuild.yml) dispatched
// through GitHub's API — the one thing a Worker can reach over plain fetch()
// with no git tooling of its own.

export interface RebuildEnv {
  GITHUB_DISPATCH_TOKEN?: string;
}

const REPO = "Bobata-constantlyafk/bobata-isonline";
const WORKFLOW_FILE = "publish-rebuild.yml";
const REF = "master";

/** Fire-and-forget: a rebuild trigger failing should never fail the admin
 *  save that caused it. Call via `ctx.waitUntil(triggerRebuild(env))`. */
export async function triggerRebuild(env: RebuildEnv): Promise<void> {
  if (!env.GITHUB_DISPATCH_TOKEN) {
    console.warn(
      "[rebuild] GITHUB_DISPATCH_TOKEN not set — skipping rebuild trigger",
    );
    return;
  }
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${env.GITHUB_DISPATCH_TOKEN}`,
          accept: "application/vnd.github+json",
          "content-type": "application/json",
          "user-agent": "bobata-isonline-worker",
        },
        body: JSON.stringify({ ref: REF }),
      },
    );
    if (!res.ok) {
      console.error(
        `[rebuild] dispatch failed: ${res.status} ${await res.text()}`,
      );
    }
  } catch (error) {
    console.error("[rebuild] dispatch threw:", error);
  }
}
