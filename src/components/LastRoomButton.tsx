"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LAST_ROOM_STORAGE_KEY,
  parseLastRoom,
  type LastRoom,
} from "@/src/lib/last-room";

/**
 * Tautan kapur kembali ke room terakhir yang dikunjungi.
 * Outline, bukan blok kuning — keputusan terisi hanya "Buat Room".
 */
export function LastRoomButton() {
  const [room, setRoom] = useState<LastRoom | null>(null);

  useEffect(() => {
    try {
      setRoom(
        parseLastRoom(window.localStorage.getItem(LAST_ROOM_STORAGE_KEY)),
      );
    } catch {
      // localStorage bisa melempar di beberapa mode privasi — anggap kosong.
    }
  }, []);

  if (room === null) {
    return null;
  }

  return (
    <div className="mt-6 flex max-w-full items-stretch gap-1">
      <Link
        href={`/r/${room.code}`}
        className="group flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-lg border border-chalk/50 px-4 py-2.5 text-base font-semibold text-chalk transition hover:border-chalk hover:bg-chalk/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chalk-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-board active:translate-y-px"
      >
        <span className="min-w-0 flex-1">
          <span className="block truncate leading-tight">Kembali ke {room.name}</span>
          <span className="block font-mono text-xs font-medium tracking-[0.15em] leading-tight text-chalk-dim [font-variant-numeric:tabular-nums]">
            {room.code}
          </span>
        </span>
      </Link>
      <button
        type="button"
        onClick={() => {
          try {
            window.localStorage.removeItem(LAST_ROOM_STORAGE_KEY);
          } catch {
            // Bila penyimpanan diblokir, cukup hilangkan dari tampilan.
          }
          setRoom(null);
        }}
        className="min-h-11 shrink-0 self-center rounded-md px-3 py-2 text-sm text-chalk-dim transition hover:text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-chalk-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-board"
      >
        Lupakan
      </button>
    </div>
  );
}
