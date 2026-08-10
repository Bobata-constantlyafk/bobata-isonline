import { useEffect, useState } from "react";
import type { Route } from "./+types/inbox";

export function meta(_: Route.MetaArgs) {
  return [{ title: "Inbox — Admin — Bobata" }];
}

interface Message {
  id: number;
  handle: string;
  message: string;
  createdAt: string;
  read: boolean;
  archived: boolean;
}

type Filter = "active" | "archived" | "all";

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
}

export default function Inbox() {
  const [messages, setMessages] = useState<Message[] | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<Filter>("active");
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetch("/api/admin/messages")
      .then((res) => (res.ok ? res.json() : Promise.reject(res.status)))
      .then((data: { messages: Message[] }) => setMessages(data.messages))
      .catch(() => setError("Could not load messages."));
  }

  useEffect(load, []);

  async function patch(id: number, body: Partial<Pick<Message, "read" | "archived">>) {
    // Optimistic — the inbox should feel instant; reconcile on failure.
    setMessages((prev) =>
      prev?.map((m) => (m.id === id ? { ...m, ...body } : m)) ?? prev,
    );
    const res = await fetch(`/api/admin/messages/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      setError("Update failed — reloading.");
      load();
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this message permanently? This can't be undone."))
      return;
    setMessages((prev) => prev?.filter((m) => m.id !== id) ?? prev);
    if (selectedId === id) setSelectedId(null);
    const res = await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Delete failed — reloading.");
      load();
    }
  }

  if (error) {
    return <p className="text-sm text-acid-magenta">{error}</p>;
  }
  if (!messages) {
    return <p className="text-sm text-secondary">Loading…</p>;
  }

  const visible = messages.filter((m) => {
    if (filter === "all") return true;
    if (filter === "archived") return m.archived;
    return !m.archived;
  });
  const selected = messages.find((m) => m.id === selectedId) ?? null;

  return (
    <div className="grid grid-cols-[1fr_1.4fr] gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex gap-4 text-[11px] tracking-[.2em]">
          {(["active", "archived", "all"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                filter === f ? "text-acid-cyan" : "text-secondary hover:text-bright"
              }
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {visible.length === 0 && (
          <p className="text-sm text-dim">Nothing here.</p>
        )}

        <div className="flex flex-col border-t border-hairline">
          {visible.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedId(m.id);
                if (!m.read) patch(m.id, { read: true });
              }}
              className={`flex flex-col gap-1 border-b border-hairline px-3 py-3 text-left hover:bg-[rgba(0,229,255,.05)] ${
                selectedId === m.id ? "bg-[rgba(0,229,255,.08)]" : ""
              }`}
            >
              <span className="flex items-center gap-2 text-[13px] text-bright">
                {!m.read && (
                  <span className="h-1.5 w-1.5 flex-none bg-acid-cyan" />
                )}
                {m.handle}
                {m.archived && (
                  <span className="text-[10px] tracking-[.15em] text-dim">
                    ARCHIVED
                  </span>
                )}
              </span>
              <span className="truncate text-[12px] text-secondary">
                {m.message}
              </span>
              <span className="text-[10px] text-dim">
                {formatDate(m.createdAt)}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="border border-border p-6">
        {!selected ? (
          <p className="text-sm text-dim">Select a message.</p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base text-bright">{selected.handle}</p>
                <p className="text-[11px] text-dim">
                  {formatDate(selected.createdAt)}
                </p>
              </div>
              <div className="flex gap-3 text-[11px] tracking-[.15em]">
                <button
                  onClick={() => patch(selected.id, { read: !selected.read })}
                  className="text-secondary hover:text-acid-cyan"
                >
                  {selected.read ? "MARK UNREAD" : "MARK READ"}
                </button>
                <button
                  onClick={() =>
                    patch(selected.id, { archived: !selected.archived })
                  }
                  className="text-secondary hover:text-acid-cyan"
                >
                  {selected.archived ? "UNARCHIVE" : "ARCHIVE"}
                </button>
                <button
                  onClick={() => remove(selected.id)}
                  className="text-acid-magenta hover:text-bright"
                >
                  DELETE
                </button>
              </div>
            </div>
            <p className="whitespace-pre-wrap text-[14px] leading-[1.7] text-body">
              {selected.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
