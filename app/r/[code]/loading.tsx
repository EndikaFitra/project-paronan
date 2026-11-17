import { BoardFrame } from "@/src/components/BoardFrame";

/**
 * Kerangka pamuatan room — garis-garis kapur samar di papan, mengikuti
 * tata letak room nyata: header, total dilingkari, saldo/settlement,
 * blok tambah tagihan, lalu nota-nota. Tidak ada angka atau nama palsu.
 */
export default function RoomLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-3 py-4 pb-28 sm:px-6 sm:py-8 lg:pb-8">
      <BoardFrame>
        <div
          className="space-y-8 px-4 py-6 sm:px-7 sm:py-8 lg:px-10 lg:py-10"
          aria-busy="true"
          aria-label="Sedang memuat room"
        >
          {/* Header: tautan, nama, kode, jumlah. */}
          <header className="space-y-4">
            <div className="h-4 w-20 rounded-sm border border-chalk/15" />
            <div className="h-10 w-2/3 rounded-sm border-2 border-chalk/20" />
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-9 w-36 rounded-md border-2 border-chalk/25" />
              <div className="h-5 w-32 rounded-sm border border-chalk/15" />
            </div>
          </header>

          {/* Baris total dilingkari. */}
          <div className="relative inline-block h-11 w-64">
            <div className="absolute inset-x-2 inset-y-1.5 rounded-sm border-2 border-chalk/20" />
            <div className="chalk-draw absolute inset-0 rounded-full border-2 border-chalk-yellow/25" />
          </div>

          {/* Dua kolom: saldo dan settlement. */}
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="space-y-3 rounded-2xl border border-chalk/20 p-5">
              <div className="h-7 w-44 rounded-sm border-2 border-chalk/20" />
              <div className="grid gap-3 sm:grid-cols-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex h-14 items-center justify-between rounded-lg border border-chalk/15 px-3.5"
                  >
                    <div className="h-5 w-20 rounded-sm border border-chalk/15" />
                    <div className="h-5 w-24 rounded-sm border-2 border-chalk/20" />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3 rounded-2xl border border-chalk/20 p-5">
              <div className="h-7 w-56 rounded-sm border-2 border-chalk/20" />
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="h-12 rounded-lg border border-chalk/15"
                />
              ))}
            </div>
          </div>

          {/* Blok tambah tagihan. */}
          <div className="h-16 rounded-2xl border-2 border-chalk-yellow/40 bg-chalk-yellow/10" />

          {/* Nota-nota. */}
          <div className="grid gap-5 sm:grid-cols-2">
            {[0, 1].map((i) => (
              <div
                key={i}
                className={`h-36 rounded-t-sm border-2 border-chalk/15 bg-chalk/5 ${
                  i % 2 === 0 ? "-rotate-1" : "rotate-1"
                }`}
              />
            ))}
          </div>
        </div>
      </BoardFrame>
    </main>
  );
}
