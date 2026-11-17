/**
 * Normalisasi kode room yang diketik/ditempel pengguna:
 * buang spasi & tanda hubung, lalu jadikan huruf besar.
 * Kode room sendiri dibuat dari alfabet huruf besar tanpa karakter ambigu.
 */
export function normalizeRoomCode(value: string): string {
  return value.replace(/[\s-]/g, "").toUpperCase();
}

/** Panjang kode room yang dihasilkan generator. */
export const ROOM_CODE_LENGTH = 10;

const ROOM_CODE_PATTERN = new RegExp(
  `^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{${ROOM_CODE_LENGTH}}$`,
);

/**
 * Periksa apakah nilai adalah kode room yang valid, apa adanya
 * (tanpa trimming, tanpa pengubahan huruf besar/kecil).
 * Aman dipanggil dengan input tidak tepercaya.
 */
export function isRoomCode(value: unknown): boolean {
  return typeof value === "string" && ROOM_CODE_PATTERN.test(value);
}
