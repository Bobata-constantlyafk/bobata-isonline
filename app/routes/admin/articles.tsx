import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/articles";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Articles — Admin — Bobata" }];
}

interface ArticleSummary {
  slug: string;
  title: string;
  skin: string;
  type: "list" | "essay";
  sortOrder: number;
  published: boolean;
}

export default function AdminArticles() {
  const [articles, setArticles] = useState<ArticleSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/articles")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { articles: ArticleSummary[] }) =>
        setArticles(data.articles),
      )
      .catch(() => setError("Could not load articles."));
  }

  useEffect(load, []);

  async function remove(slug: string, title: string) {
    if (!confirm(`Delete "${title}" permanently? This can't be undone.`))
      return;
    const res = await fetch(`/api/admin/articles/${slug}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setArticles((prev) => prev?.filter((a) => a.slug !== slug) ?? prev);
    } else {
      const body = await res.json().catch(() => ({}));
      alert(body.error ?? "Delete failed.");
    }
  }

  if (error) return <p className="text-sm text-acid-magenta">{error}</p>;
  if (!articles) return <p className="text-sm text-secondary">Loading…</p>;

  return (
    <div className="flex flex-col gap-5">
      <Link
        to="/admin/articles/new"
        className="btn-outline-cyan self-start px-5 py-2.5 font-mono text-[11px] tracking-[.2em]"
      >
        + NEW ESSAY
      </Link>

      <div className="flex flex-col border-t border-hairline">
        {articles.map((a) => (
          <div
            key={a.slug}
            className="flex items-center justify-between gap-4 border-b border-hairline px-1 py-3"
          >
            <div className="flex items-baseline gap-4">
              <span className="font-display text-[14px] text-bright">
                {a.title}
              </span>
              <span className="text-[10px] tracking-[.15em] text-dim">
                {a.type === "list" ? "RANKED LIST" : "ESSAY"} · {a.skin}
              </span>
              {!a.published && (
                <span className="text-[10px] tracking-[.15em] text-acid-magenta">
                  DRAFT
                </span>
              )}
            </div>
            <div className="flex gap-4 text-[11px] tracking-[.15em]">
              {a.type === "essay" ? (
                <>
                  <Link
                    to={`/admin/articles/${a.slug}`}
                    className="text-secondary hover:text-acid-cyan"
                  >
                    EDIT
                  </Link>
                  <button
                    onClick={() => remove(a.slug, a.title)}
                    className="text-acid-magenta hover:text-bright"
                  >
                    DELETE
                  </button>
                </>
              ) : (
                <span className="text-dim">NINES EDITOR — coming next</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
