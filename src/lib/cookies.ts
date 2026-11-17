import { cookies } from "next/headers";

const ROOM_COOKIE_PREFIX = "room_";
const ADMIN_COOKIE_PREFIX = "admin_";

/** Nama cookie admin lama (global) — hanya dipakai sebagai fallback baca untuk room lama. */
export const ADMIN_COOKIE = "adminToken";

function roomCookieName(roomId: string): string {
  return `${ROOM_COOKIE_PREFIX}${roomId}`;
}

/** Simpan id anggota di cookie room_<roomId> agar anggota dikenali saat kembali. */
export async function setMemberCookie(roomId: string, memberId: string) {
  const store = await cookies();
  store.set(roomCookieName(roomId), memberId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getMemberCookie(roomId: string): Promise<string | null> {
  const store = await cookies();
  return store.get(roomCookieName(roomId))?.value ?? null;
}

/**
 * Token admin disimpan per-room pada cookie admin_<roomId> agar membuat room baru
 * tidak menimpa token admin room lain.
 */
export async function setAdminCookie(
  roomId: string,
  adminToken: string,
): Promise<void> {
  const store = await cookies();
  store.set(`${ADMIN_COOKIE_PREFIX}${roomId}`, adminToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getAdminCookie(roomId: string): Promise<string | null> {
  const store = await cookies();
  return (
    store.get(`${ADMIN_COOKIE_PREFIX}${roomId}`)?.value ??
    // Fallback baca-saja untuk room lama yang token-nya masih di cookie legacy.
    store.get(ADMIN_COOKIE)?.value ??
    null
  );
}
