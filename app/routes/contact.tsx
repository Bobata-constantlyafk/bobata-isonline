import { useState, type FormEvent } from "react";
import { PageHeader } from "~/components/chrome/PageHeader";
import { TITLEBAR_GRADIENT, contactPanelStyle } from "~/lib/chromeStyles";
import type { Route } from "./+types/contact";

const LINKS = [
  { label: "INSTAGRAM", href: "#" },
  { label: "LETTERBOXD", href: "#" },
  { label: "RYM", href: "#" },
  { label: "EMAIL", href: "#" },
];

type Status =
  | { state: "idle" }
  | { state: "sending" }
  | { state: "sent" }
  | { state: "error"; message: string };

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Contact — Bobata" },
    { name: "description", content: "Open channel." },
  ];
}

export default function Contact() {
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<{ handle?: string; message?: string }>({});

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const handle = String(data.get("handle") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    // Mirrors the server's rules so the common cases never round-trip;
    // functions/api/contact.ts revalidates everything regardless.
    const nextErrors: typeof errors = {};
    if (!handle) nextErrors.handle = "REQUIRED";
    else if (handle.length > 80) nextErrors.handle = "TOO LONG (MAX 80)";
    if (!message) nextErrors.message = "REQUIRED";
    else if (message.length > 5000) nextErrors.message = "TOO LONG (MAX 5000)";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus({ state: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          handle,
          message,
          // Honeypot: real users never fill this, bots usually do.
          website: String(data.get("website") ?? ""),
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? "TRANSMISSION FAILED");
      }
      form.reset();
      setStatus({ state: "sent" });
    } catch (error) {
      setStatus({
        state: "error",
        message: error instanceof Error ? error.message : "TRANSMISSION FAILED",
      });
    }
  }

  const inputClass =
    "border border-border bg-[#0a0b0d] p-[13px] font-mono text-[14px] text-bright outline-none focus:border-acid-cyan";

  return (
    <div className="flex flex-col gap-10 page-px pb-[120px] pt-[90px]">
      <PageHeader
        title="CONNECT"
        kicker="// OPEN CHANNEL"
        kickerColor="#a3ff12"
      />

      <div className="max-w-[720px]" style={contactPanelStyle}>
        <div
          style={{ backgroundImage: TITLEBAR_GRADIENT }}
          className="border-b border-border px-3.5 py-[10px] text-[10px] tracking-[.3em] text-body"
        >
          /dev/bobata — inbound
        </div>

        <form
          onSubmit={onSubmit}
          noValidate
          className="flex flex-col gap-5 p-7"
        >
          <label className="flex flex-col gap-2">
            <span className="flex items-baseline gap-3">
              <span className="text-[9px] tracking-[.3em] text-secondary">
                HANDLE
              </span>
              {errors.handle && (
                <span className="text-[9px] tracking-[.3em] text-acid-magenta">
                  {errors.handle}
                </span>
              )}
            </span>
            <input
              type="text"
              name="handle"
              placeholder="who's asking"
              maxLength={80}
              aria-invalid={Boolean(errors.handle)}
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-2">
            <span className="flex items-baseline gap-3">
              <span className="text-[9px] tracking-[.3em] text-secondary">
                TRANSMISSION
              </span>
              {errors.message && (
                <span className="text-[9px] tracking-[.3em] text-acid-magenta">
                  {errors.message}
                </span>
              )}
            </span>
            <textarea
              name="message"
              rows={5}
              placeholder="say it plainly"
              maxLength={5000}
              aria-invalid={Boolean(errors.message)}
              className={`${inputClass} resize-y`}
            />
          </label>

          {/* Honeypot — hidden from people, tempting to bots. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            className="absolute left-[-9999px] h-0 w-0 opacity-0"
          />

          <div className="flex items-center gap-5">
            <button
              type="submit"
              disabled={status.state === "sending"}
              className="btn-send self-start px-[26px] py-[14px] font-mono text-[11px] tracking-[.32em] disabled:opacity-50"
            >
              {status.state === "sending" ? "SENDING…" : "SEND SIGNAL →"}
            </button>

            {status.state === "sent" && (
              <span
                role="status"
                className="text-[10px] tracking-[.3em] text-acid-green"
              >
                ■ SIGNAL RECEIVED
              </span>
            )}
            {status.state === "error" && (
              <span
                role="alert"
                className="text-[10px] tracking-[.3em] text-acid-magenta"
              >
                ■ {status.message}
              </span>
            )}
          </div>
        </form>
      </div>

      <div className="flex flex-wrap gap-x-[34px] gap-y-3 text-[11px] tracking-[.26em] text-muted">
        {LINKS.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}
