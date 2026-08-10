import { useState } from "react";
import { useNavigate } from "react-router";
import { ArticleForm, type ArticleFormValues } from "~/components/admin/ArticleForm";
import type { Route } from "./+types/articles.new";

export function meta(_: Route.MetaArgs) {
  return [{ title: "New Article — Admin — Bobata" }];
}

const EMPTY: ArticleFormValues = {
  title: "",
  slug: "",
  skin: "BRUSHED STEEL",
  date: "",
  excerpt: "",
  blogTint: "rgba(0,229,255,.05)",
  body: "",
  published: true,
};

export default function NewArticle() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(values: ArticleFormValues) {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Create failed.");
      navigate("/admin/articles");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-lg text-bright">NEW ESSAY</h1>
      <ArticleForm
        mode="create"
        initial={EMPTY}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
      />
    </div>
  );
}
