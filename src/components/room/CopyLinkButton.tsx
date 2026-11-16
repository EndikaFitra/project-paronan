"use client";

import { useState } from "react";

import { secondaryButtonClass } from "@/src/components/styles";

/** Tombol menyalin link room; menampilkan konfirmasi singkat. */
export function CopyLinkButton({ code }: { code: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const [fallbackUrl, setFallbackUrl] = useState("");

  async function handleCopy() {
    const url = `${window.location.origin}/r/${code}`;
    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      // Clipboard diblokir browser — tampilkan link agar bisa disalin manual.
      setFallbackUrl(url);
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={handleCopy}
        className={`${secondaryButtonClass} px-3 py-2`}
        aria-label="Salin link room"
      >
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          className="h-4 w-4"
        >
          <rect x="9" y="9" width="12" height="12" rx="2" />
          <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
        </svg>
        {status === "copied" ? "Link tersalin!" : "Salin link"}
      </button>
      {status === "error" ? (
        <p className="max-w-xs text-xs break-all text-rose-600" role="alert">
          Gagal menyalin otomatis. Salin manual: {fallbackUrl}
        </p>
      ) : null}
    </div>
  );
}
