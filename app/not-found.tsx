import Link from "next/link";

import { cardClass } from "@/src/components/styles";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center px-5 py-10 text-center">
      <div className={cardClass}>
        <h1 className="text-2xl font-bold text-zinc-900">
          Halaman tidak ditemukan
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          Room yang kamu buka tidak ada atau sudah tidak berlaku. Periksa kembali
          link dari temanmu, atau buat room baru.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
