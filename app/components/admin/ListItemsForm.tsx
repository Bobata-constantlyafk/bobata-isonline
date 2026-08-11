import { useState, type FormEvent } from "react";
import { ImageUploadField } from "./ImageUploadField";

export interface ListItem {
  title: string;
  meta: string;
  imageUrl?: string;
  review?: string;
}

const inputClass =
  "border border-border bg-[#0a0b0d] p-2 font-mono text-[13px] text-bright outline-none focus:border-acid-cyan";

/**
 * The nine TITLE_01..09 slots of a ranked-list article. Always exactly
 * nine rows — the row count isn't editable, only their content — matching
 * the design's fixed "the Nines" format.
 *
 * Image URL and review are collapsed by default per row (expanded only if
 * either already has a value) — most rows won't have one yet, and showing
 * all four fields for all nine rows up front makes the form much longer
 * than it needs to be for the common case.
 */
export function ListItemsForm({
  initial,
  onSubmit,
  submitting,
  error,
}: {
  initial: ListItem[];
  onSubmit: (items: ListItem[]) => void;
  submitting: boolean;
  error: string | null;
}) {
  const [items, setItems] = useState(initial);
  const [expanded, setExpanded] = useState(() =>
    initial.map((item) => Boolean(item.imageUrl || item.review)),
  );

  function setItem(index: number, field: keyof ListItem, value: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }

  function toggleExpanded(index: number) {
    setExpanded((prev) => prev.map((v, i) => (i === index ? !v : v)));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(items);
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <div className="flex flex-col gap-4">
        {items.map((item, i) => (
          <div key={i} className="flex flex-col gap-2 border-b border-hairline pb-4">
            <div className="flex items-center gap-3">
              <span className="w-8 flex-none font-bitmap text-[15px] text-acid-cyan">
                {String(i + 1).padStart(2, "0")}
              </span>
              <input
                className={`${inputClass} flex-[2]`}
                value={item.title}
                onChange={(e) => setItem(i, "title", e.target.value)}
                placeholder={`TITLE_0${i + 1}`}
                maxLength={120}
                required
              />
              <input
                className={`${inputClass} flex-1`}
                value={item.meta}
                onChange={(e) => setItem(i, "meta", e.target.value)}
                placeholder="YEAR · CREDIT"
                maxLength={60}
                required
              />
              <button
                type="button"
                onClick={() => toggleExpanded(i)}
                className="flex-none text-[10px] tracking-[.15em] text-secondary hover:text-acid-cyan"
              >
                {expanded[i] ? "− HIDE" : "+ IMAGE & REVIEW"}
              </button>
            </div>

            {expanded[i] && (
              <div className="ml-11 flex flex-col gap-2">
                <label className="flex flex-col gap-1">
                  <span className="text-[9px] tracking-[.2em] text-dim">
                    IMAGE — upload a file, or paste a link
                  </span>
                  <ImageUploadField
                    value={item.imageUrl ?? ""}
                    onChange={(url) => setItem(i, "imageUrl", url)}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-[9px] tracking-[.2em] text-dim">
                    REVIEW — leave blank to keep this row non-clickable on
                    the public page. Blank line = new paragraph, "&gt; text"
                    = pull quote.
                  </span>
                  <textarea
                    className={`${inputClass} resize-y`}
                    rows={4}
                    value={item.review ?? ""}
                    onChange={(e) => setItem(i, "review", e.target.value)}
                    maxLength={4000}
                  />
                </label>
              </div>
            )}
          </div>
        ))}
      </div>

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
        {submitting ? "SAVING…" : "SAVE CHANGES"}
      </button>
    </form>
  );
}
