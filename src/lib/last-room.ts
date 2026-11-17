import { MAX_NAME_LENGTH } from "./limits";
import { isRoomCode, normalizeRoomCode } from "./room-code";

/** Data room terakhir yang dikunjungi pengguna. */
export interface LastRoom {
  code: string;
  name: string;
}

/** Kunci localStorage untuk room terakhir. */
export const LAST_ROOM_STORAGE_KEY = "paronan:last-room";

/**
 * Ubah LastRoom menjadi string JSON untuk disimpan ke localStorage.
 * Hanya memuat field code dan name.
 */
export function serializeLastRoom(room: LastRoom): string {
  return JSON.stringify({ code: room.code, name: room.name });
}

/**
 * Baca string mentah dari localStorage menjadi LastRoom.
 * Total: tidak pernah melempar, apa pun inputnya.
 * Mengembalikan null bila data tidak valid, kode tidak sah
 * (setelah dinormalkan), atau nama kosong/terlalu panjang.
 */
export function parseLastRoom(raw: string | null): LastRoom | null {
  if (raw === null || raw === "") {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return null;
  }

  const record = parsed as Record<string, unknown>;
  const code = record.code;
  const name = record.name;
  if (typeof code !== "string" || typeof name !== "string") {
    return null;
  }

  const normalizedCode = normalizeRoomCode(code);
  if (!isRoomCode(normalizedCode)) {
    return null;
  }

  const trimmedName = name.trim();
  if (trimmedName === "" || trimmedName.length > MAX_NAME_LENGTH) {
    return null;
  }

  return { code: normalizedCode, name: trimmedName };
}
