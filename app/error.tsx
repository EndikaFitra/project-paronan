"use client";

import { BoardFrame } from "@/src/components/BoardFrame";

/** Halaman error terkurasi di dunia papan kapur, dengan aksi coba lagi. */
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl items-center px-3 py-6 sm:px-6 sm:py-10">
      <BoardFrame className="w-full">
        <div className="px-6 py-12 text-center sm:px-10 sm:py-16">
          <h1 className="font-chalk text-4xl font-bold text-chalk sm:text-5xl">
            Ada yang terhapus dari papan
          </h1>
          <p className="mx-auto mt-4 max-w-[45ch] text-base text-chalk-dim">
            Terjadi kesalahan saat memuat halaman ini. Coba muat ulang; kalau
            masih gagal, periksa koneksimu sebentar.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-chalk-yellow px-6 py-3 text-base font-semibold text-board-deep shadow-press transition hover:bg-[#f0d175] active:translate-y-px"
          >
            Coba lagi
          </button>
        </div>
      </BoardFrame>
    </main>
  );
}
