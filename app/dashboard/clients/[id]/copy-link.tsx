"use client";

import { useState } from "react";

export function CopyLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  if (!url) return null;

  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className="rounded-full border border-border px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-muted"
    >
      {copied ? "Link copied ✓" : "Copy upload link"}
    </button>
  );
}
