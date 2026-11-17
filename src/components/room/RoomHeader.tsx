import Link from "next/link";

import { CopyLinkButton } from "@/src/components/room/CopyLinkButton";
import { ChalkCircle } from "@/src/components/chalk";
import { formatRupiah } from "@/src/lib/format";
import type { RoomSummary } from "@/src/lib/api";

interface RoomHeaderProps {
  name: string;
  code: string;
  memberCount: number;
  billCount: number;
  totalBills: number;
  /** Tampilkan tombol "Gabung" bila pengunjung belum menjadi anggota. */
  showJoinCta: boolean;
}

/** Header room di dalam bingkai papan: nama kapur, kode dalam kotak kapur, total dilingkari. */
export function RoomHeader({
  name,
  code,
  memberCount,
  billCount,
  totalBills,
  showJoinCta,
}: RoomHeaderProps) {
  return (
    <header>
      <Link
        href="/"
        className="inline-flex min-h-11 items-center text-sm font-medium text-chalk-dim underline decoration-chalk-faint underline-offset-4 transition hover:text-chalk hover:decoration-chalk"
      >
        Beranda
      </Link>

      <div className="mt-1 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate font-chalk text-4xl font-bold leading-tight text-chalk sm:text-5xl">
            {name}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-chalk-dim">
            <span className="rounded-md border-2 border-chalk/60 px-2.5 py-1">
              <span className="tnum text-base font-semibold tracking-[0.2em] text-chalk">
                {code}
              </span>
            </span>
            <span className="tnum">
              {memberCount} anggota · {billCount} tagihan
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          {showJoinCta ? (
            <a
              href="#gabung-room-panel"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-chalk-yellow px-4 py-2 text-sm font-semibold text-board-deep shadow-press transition hover:bg-[#f0d175] active:translate-y-px"
            >
              Gabung
            </a>
          ) : null}
          <CopyLinkButton code={code} />
        </div>
      </div>

      <p className="relative mt-6 inline-block px-3 py-1.5">
        <span className="text-lg text-chalk">
          Total tagihan:{" "}
          <span className="tnum text-2xl font-semibold text-chalk">
            {formatRupiah(totalBills)}
          </span>
        </span>
        {/* key = total: lingkaran digambar ulang (write-on) tiap kali
            total berubah setelah tagihan disimpan. Di bawah
            prefers-reduced-motion .chalk-draw tidak beranimasi
            (lihat globals.css) dan lingkaran tetap terlihat penuh. */}
        <ChalkCircle key={totalBills} className="inset-0" />
      </p>
    </header>
  );
}
