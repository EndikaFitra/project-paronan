import { cookies } from "next/headers";

const ROOM_COOKIE_PREFIX = "room_";
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

/** Token admin room, disimpan httpOnly agar tidak bisa dibaca JavaScript. */
export async function setAdminCookie(adminToken: string) {
  const store = await cookies();
  store.set(ADMIN_COOKIE, adminToken, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getAdminCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value ?? null;
}
