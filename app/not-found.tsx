import Link from "next/link";

import { BoardFrame } from "@/src/components/BoardFrame";
import { ChalkUnderline } from "@/src/components/chalk";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-3xl items-center px-3 py-6 sm:px-6 sm:py-10">
      <BoardFrame className="w-full">
        <div className="px-6 py-12 text-center sm:px-10 sm:py-16">
          <h1 className="inline-block font-chalk text-4xl font-bold text-chalk sm:text-5xl">
            Papan ini tidak ada
          </h1>
          <ChalkUnderline className="mx-auto max-w-[320px]" />
          <p className="mx-auto mt-5 max-w-[45ch] text-base text-chalk-dim">
            Room yang kamu buka tidak ada atau sudah tidak berlaku. Periksa
            kembali link dari temanmu, atau buat room baru.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-lg bg-chalk-yellow px-6 py-3 text-base font-semibold text-board-deep shadow-press transition hover:bg-[#f0d175] active:translate-y-px"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </BoardFrame>
    </main>
  );
}
