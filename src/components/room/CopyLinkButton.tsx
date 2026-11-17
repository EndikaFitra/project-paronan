"use client";

import { useState } from "react";

import { secondaryButtonClass } from "@/src/components/styles";
import { CopyIcon } from "@/src/components/icons";

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
        className={`${secondaryButtonClass} px-3 py-2 text-sm`}
        aria-label="Salin link room"
      >
        <CopyIcon />
        {status === "copied" ? "Link tersalin!" : "Salin link"}
      </button>
      {/* Konfirmasi tersalin diumumkan ke pembaca layar. */}
      <p aria-live="polite" className="min-h-0 text-xs text-chalk-faint">
        {status === "copied" ? "Link room tersalin ke papan klip." : ""}
      </p>
      {status === "error" ? (
        <p
          className="max-w-xs text-xs break-all text-chalk-red"
          role="alert"
        >
          Gagal menyalin otomatis. Salin manual: {fallbackUrl}
        </p>
      ) : null}
    </div>
  );
}
