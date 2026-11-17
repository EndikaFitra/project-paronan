"use client";

import { PlusIcon } from "@/src/components/icons";

/**
 * Bilah aksi bawah di mobile: selalu terlihat, membuka dan menggulir ke
 * form tagihan. Konten halaman diberi padding bawah supaya bilah ini
 * tidak menutupi nota terakhir.
 */
export function StickyAddBillBar() {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <a
        href="#tambah-tagihan"
        className="pointer-events-auto mx-auto flex min-h-12 w-full max-w-md items-center justify-center gap-2 rounded-full bg-chalk-yellow py-3 text-base font-semibold text-board-deep shadow-paper transition active:translate-y-px"
        onClick={(event) => {
          const toggle = document.querySelector<HTMLElement>(
            "#tambah-tagihan [aria-controls]",
          );
          if (toggle) {
            event.preventDefault();
            if (toggle.getAttribute("aria-expanded") !== "true") {
              toggle.click();
            }
            toggle.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }}
      >
        <PlusIcon />
        Tambah Tagihan
      </a>
    </div>
  );
}
