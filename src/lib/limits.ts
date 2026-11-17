/**
 * Batas panjang teks yang dipakai bersama server dan klien.
 * Modul ini sengaja bebas dari `next/server` agar aman diimpor
 * komponen client (mis. `last-room.ts` yang berjalan di browser).
 */

export const MAX_NAME_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 100;
