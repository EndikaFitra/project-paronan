import type { ReactNode } from "react";

/**
 * Papan tulis dalam bingkai kayu: bingkai kayu bertekstur di luar,
 * papan hijau-hitam bertekstur kapur di dalam. Bingkai punya bayangan
 * lempar ke dinding (offset + blur, ke bawah), bevel dalam di tepi
 * papan, dan bacaan rak kecil di bawah — papan terasa benda fisik.
 */
export function BoardFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`wood-grain relative rounded-3xl p-2.5 sm:p-3.5 ${className}`}
      style={{
        boxShadow:
          "0 24px 48px -12px rgb(0 0 0 / 0.65), 0 8px 16px -8px rgb(0 0 0 / 0.5)",
      }}
    >
      {/* Bevel dalam: kayu bertemu papan — tepi atas terang, tepi bawah gelap. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-3xl"
        style={{
          boxShadow:
            "inset 0 2px 3px rgb(243 239 228 / 0.14), inset 0 -3px 5px rgb(0 0 0 / 0.55)",
        }}
      />
      {/* Laci kapur di bawah bingkai: ledai tipis yang menjorok keluar. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-2.5 left-6 right-6 h-2.5 rounded-b-lg"
        style={{
          background:
            "linear-gradient(180deg, #4a3425 0%, #3e2b1f 60%, #2d1f15 100%)",
          boxShadow: "0 4px 8px -3px rgb(0 0 0 / 0.6)",
        }}
      />
      <div
        className="board-grain relative overflow-hidden rounded-2xl bg-board"
        style={{ boxShadow: "inset 0 2px 10px rgb(0 0 0 / 0.55)" }}
      >
        {/* Bayangan dalam di tepi papan — papan tulis nyata punya ceruk. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            boxShadow:
              "inset 0 0 60px rgb(0 0 0 / 0.35), inset 0 1px 0 rgb(243 239 228 / 0.06)",
          }}
        />
        {children}
      </div>
    </div>
  );
}
