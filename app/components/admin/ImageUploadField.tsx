import { useRef, useState } from "react";

const inputClass =
  "border border-border bg-[#0a0b0d] p-2 font-mono text-[13px] text-bright outline-none focus:border-acid-cyan";

/**
 * A pasted URL is still accepted — external links have legitimate uses
 * (an image that's already hosted elsewhere) — but the file picker is the
 * primary path now: pick a file, it uploads to R2 immediately, the URL
 * field fills itself in.
 */
export function ImageUploadField({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "content-type": file.type },
        body: file,
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "Upload failed.");
      onChange(body.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex gap-2">
        <input
          className={`${inputClass} flex-1`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or upload a file"
          maxLength={500}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-outline-ghost flex-none px-3 py-2 font-mono text-[10px] tracking-[.15em] disabled:opacity-50"
        >
          {uploading ? "UPLOADING…" : "UPLOAD"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
      {error && <p className="text-[11px] text-acid-magenta">{error}</p>}
      {value && (
        <img
          src={value}
          alt=""
          className="h-16 w-11 border border-hairline object-cover"
        />
      )}
    </div>
  );
}
