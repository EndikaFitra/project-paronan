/**
 * Normalisasi kode room yang diketik/ditempel pengguna:
 * buang spasi & tanda hubung, lalu jadikan huruf besar.
 * Kode room sendiri dibuat dari alfabet huruf besar tanpa karakter ambigu.
 */
export function normalizeRoomCode(value: string): string {
  return value.replace(/[\s-]/g, "").toUpperCase();
}
