"use client";

import { useEffect } from "react";
import {
  LAST_ROOM_STORAGE_KEY,
  serializeLastRoom,
} from "@/src/lib/last-room";

/**
 * Catat room yang sedang dibuka ke localStorage.
 * Selalu gagal diam: Safari private mode atau storage penuh
 * tidak boleh merusak halaman room.
 */
export function RememberRoom({ code, name }: { code: string; name: string }) {
  useEffect(() => {
    try {
      window.localStorage.setItem(
        LAST_ROOM_STORAGE_KEY,
        serializeLastRoom({ code, name }),
      );
    } catch {
      // Penyimpanan penuh atau diblokir — abaikan.
    }
  }, [code, name]);

  return null;
}
