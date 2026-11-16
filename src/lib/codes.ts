import { customAlphabet } from "nanoid";

// Alfabet tanpa karakter ambigu (0/O, 1/I/L) agar kode mudah dibagikan.
const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

const nanoidCode = customAlphabet(CODE_ALPHABET, 10);

/** Kode room acak 10 karakter — tidak mudah ditebak (≈ 31^10 kemungkinan). */
export function ensureRoomCode(): string {
  return nanoidCode();
}

/** Token admin acak untuk mengedit room (disimpan di cookie httpOnly). */
const nanoidToken = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  32,
);

export function createAdminToken(): string {
  return nanoidToken();
}
