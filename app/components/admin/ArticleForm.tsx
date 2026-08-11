import { useState, type FormEvent } from "react";
import { SKINS } from "~/lib/skins";
import { slugify } from "~/lib/slugify";

export interface ArticleFormValues {
  title: string;
  slug: string;
  skin: string;
  date: string;
  excerpt: string;
  blogTint: string;
  body: string;
  published: boolean;
}

const BLOG_TINTS = [
  { label: "CYAN", value: "rgba(0,229,255,.05)" },
  { label: "GREEN", value: "rgba(163,255,18,.05)" },
  { label: "MAGENTA", value: "rgba(255,0,168,.05)" },
  { label: "RED", value: "rgba(255,45,85,.05)" },
  { label: "COLD BLUE", value: "rgba(110,168,255,.05)" },
];

const inputClass =
  "border border-border bg-[#0a0b0d] p-2.5 font-mono text-[13px] text-bright outline-none focus:border-acid-cyan";
const labelClass = "text-[9px] tracking-[.25em] text-secondary";

/**
 * Shared by /admin/articles/new and /admin/articles/:slug. Only ever
 * produces essay-type articles — ranked lists (the Nines) don't have an
 * editor yet, see worker/articles.ts.
 */
export function ArticleForm({
  mode,
  initial,
  onSubmit,
  submitting,
  error,
}: {
  mode: "create" | "edit";
  initial: ArticleFormValues;
  onSubmit: (values: ArticleFormValues) => void;
  submitting: boolean;
  error: string | null;
}) {
  const [values, setValues] = useState(initial);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");

  function set<K extends keyof ArticleFormValues>(
    key: K,
    value: ArticleFormValues[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function onTitleChange(title: string) {
    set("title", title);
    if (!slugTouched) set("slug", slugify(title));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>TITLE</span>
        <input
          className={inputClass}
          value={values.title}
          onChange={(e) => onTitleChange(e.target.value)}
          maxLength={200}
          required
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>
          SLUG — becomes /articles/{values.slug || "…"}
        </span>
        <input
          className={inputClass}
          value={values.slug}
          onChange={(e) => {
            setSlugTouched(true);
            set("slug", e.target.value);
          }}
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          title="lowercase letters, numbers, hyphens only"
          required
        />
      </label>

      <div className="grid grid-cols-2 gap-5">
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>SKIN</span>
          <select
            className={inputClass}
            value={values.skin}
            onChange={(e) => set("skin", e.target.value)}
          >
            {Object.keys(SKINS).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>DATE — e.g. 2026.05</span>
          <input
            className={inputClass}
            value={values.date}
            onChange={(e) => set("date", e.target.value)}
            placeholder="2026.05"
            required
          />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>
          EXCERPT — shown on the /articles card ({values.excerpt.length}/400)
        </span>
        <textarea
          className={`${inputClass} resize-y`}
          rows={2}
          value={values.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          maxLength={400}
          required
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>
          BLOG ROW TINT — hover tint on the /blog long-form row. By design
          this contrasts with the page's own skin rather than matching it.
        </span>
        <select
          className={inputClass}
          value={values.blogTint}
          onChange={(e) => set("blogTint", e.target.value)}
        >
          {BLOG_TINTS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className={labelClass}>
          BODY — blank line = new paragraph, "&gt; text" = pull quote (
          {values.body.length}/20000)
        </span>
        <textarea
          className={`${inputClass} resize-y`}
          rows={16}
          value={values.body}
          onChange={(e) => set("body", e.target.value)}
          maxLength={20000}
          required
        />
      </label>

      <label className="flex items-center gap-2 text-[12px] text-body">
        <input
          type="checkbox"
          checked={values.published}
          onChange={(e) => set("published", e.target.checked)}
        />
        Published
      </label>

      <p className="text-[11px] text-dim">
        Saves to the database immediately and kicks off a rebuild — it
        usually appears on the live site within a couple of minutes.
      </p>

      {error && <p className="text-[12px] text-acid-magenta">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="btn-outline-cyan self-start px-6 py-3 font-mono text-[11px] tracking-[.2em] disabled:opacity-50"
      >
        {submitting
          ? "SAVING…"
          : mode === "create"
            ? "CREATE ARTICLE"
            : "SAVE CHANGES"}
      </button>
    </form>
  );
}
