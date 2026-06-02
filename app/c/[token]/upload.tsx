"use client";

import { useState, useRef } from "react";
import { uploadDocument } from "./actions";
import { cn } from "@/lib/utils";

export function UploadRow({
  token,
  documentId,
  label,
  status: initial,
}: {
  token: string;
  documentId: string;
  label: string;
  status: string;
}) {
  const [status, setStatus] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploaded = status === "uploaded" || status === "approved";

  async function onFile(file: File) {
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.set("file", file);
    const res = await uploadDocument(token, documentId, fd);
    setBusy(false);
    if (res.ok) setStatus("uploaded");
    else setError(res.error ?? "Upload failed.");
  }

  return (
    <li className="flex items-center gap-3 rounded-xl border border-border bg-background px-4 py-3">
      <span
        className={cn(
          "grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold",
          uploaded
            ? "bg-status-filed/15 text-status-filed"
            : "bg-muted text-muted-foreground",
        )}
      >
        {uploaded ? "✓" : ""}
      </span>
      <div className="flex-1">
        <span className="text-sm text-ink">{label}</span>
        {error && <span className="block text-xs text-primary">{error}</span>}
        {status === "rejected" && !error && (
          <span className="block text-xs text-primary">
            Please re-upload this one.
          </span>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
        }}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
          uploaded
            ? "border border-border text-muted-foreground hover:bg-muted"
            : "bg-primary text-primary-foreground hover:opacity-90",
          busy && "opacity-60",
        )}
      >
        {busy ? "Uploading…" : uploaded ? "Replace" : "Upload"}
      </button>
    </li>
  );
}
