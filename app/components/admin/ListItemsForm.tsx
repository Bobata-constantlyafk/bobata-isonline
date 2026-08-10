import { useState, type FormEvent } from "react";

export interface ListItem {
  title: string;
  meta: string;
}

const inputClass =
  "border border-border bg-[#0a0b0d] p-2 font-mono text-[13px] text-bright outline-none focus:border-acid-cyan";

/**
 * The nine TITLE_01..09 slots of a ranked-list article. Always exactly
 * nine rows — the row count isn't editable, only their content — matching
 * the design's fixed "the Nines" format.
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

  function setItem(index: number, field: keyof ListItem, value: string) {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit(items);
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-2xl flex-col gap-5">
      <div className="flex flex-col gap-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
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
          </div>
        ))}
      </div>

      <p className="text-[11px] text-dim">
        Saves to the database immediately. It won't appear on the live site
        until the next deploy.
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
