import Link from "next/link";

import { CopyLinkButton } from "@/src/components/room/CopyLinkButton";

interface RoomHeaderProps {
  name: string;
  code: string;
  memberCount: number;
  billCount: number;
  /** Tampilkan tombol "Gabung" bila pengunjung belum menjadi anggota. */
  showJoinCta: boolean;
}

/** Header room: nama, kode, tombol salin link, dan CTA gabung. */
export function RoomHeader({
  name,
  code,
  memberCount,
  billCount,
  showJoinCta,
}: RoomHeaderProps) {
  return (
    <header className="rounded-2xl bg-zinc-900 px-5 py-6 text-white shadow-sm sm:px-7 sm:py-7">
      <Link
        href="/"
        className="text-sm font-medium text-zinc-400 transition hover:text-white"
      >
        ← Beranda
      </Link>

      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
            {name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-zinc-400">
            <span>
              Kode room:{" "}
              <span className="rounded-md bg-white/10 px-2 py-0.5 font-mono text-base font-semibold tracking-[0.2em] text-white">
                {code}
              </span>
            </span>
            <span className="hidden text-zinc-600 sm:inline">•</span>
            <span>
              {memberCount} anggota · {billCount} tagihan
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          {showJoinCta ? (
            <a
              href="#gabung-room-panel"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400 focus-visible:ring-4 focus-visible:ring-indigo-400/40 focus-visible:outline-none"
            >
              Gabung
            </a>
          ) : null}
          <CopyLinkButton code={code} />
        </div>
      </div>
    </header>
  );
}
