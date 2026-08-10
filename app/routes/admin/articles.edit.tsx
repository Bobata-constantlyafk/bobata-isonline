import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ArticleForm, type ArticleFormValues } from "~/components/admin/ArticleForm";
import { ListItemsForm, type ListItem } from "~/components/admin/ListItemsForm";
import type { Route } from "./+types/articles.edit";

export function meta({ params }: Route.MetaArgs) {
  return [{ title: `Edit ${params.slug} — Admin — Bobata` }];
}

interface FetchedArticle extends ArticleFormValues {
  type: "list" | "essay";
  items?: ListItem[];
}

export default function EditArticle() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<FetchedArticle | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/articles/${slug}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { article: FetchedArticle }) => setArticle(data.article))
      .catch(() => setLoadError("Could not load this article."));
  }, [slug]);

  async function handleSubmitEssay(values: ArticleFormValues) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`/api/admin/articles/${slug}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Save failed.");
      navigate("/admin/articles");
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Save failed.");
      setSubmitting(false);
    }
  }

  async function handleSubmitList(items: ListItem[]) {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(`/api/admin/lists/${slug}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Save failed.");
      navigate("/admin/articles");
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Save failed.");
      setSubmitting(false);
    }
  }

  if (loadError) return <p className="text-sm text-acid-magenta">{loadError}</p>;
  if (!article) return <p className="text-sm text-secondary">Loading…</p>;

  if (article.type === "list") {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-display text-lg text-bright">
          EDIT THE NINES — {article.title}
        </h1>
        <ListItemsForm
          initial={article.items ?? []}
          onSubmit={handleSubmitList}
          submitting={submitting}
          error={submitError}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-lg text-bright">
        EDIT — {article.title}
      </h1>
      <ArticleForm
        mode="edit"
        initial={article}
        onSubmit={handleSubmitEssay}
        submitting={submitting}
        error={submitError}
      />
    </div>
  );
}
