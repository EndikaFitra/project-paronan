/**
 * Format uang untuk tampilan — semua nominal adalah integer rupiah.
 * Contoh: 12_500 → "Rp 12.500".
 */

const rupiahFormatter = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 0,
});

/** Format nominal menjadi "Rp 12.500"; nominal negatif menjadi "-Rp 12.500". */
export function formatRupiah(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? Math.trunc(amount) : 0;
  const sign = safeAmount < 0 ? "-" : "";
  return `${sign}Rp ${rupiahFormatter.format(Math.abs(safeAmount))}`;
}

/**
 * Format saldo dengan tanda eksplisit:
 * +Rp 12.500 (kredit), -Rp 5.000 (debit), Rp 0 (lunas).
 */
export function formatSignedRupiah(amount: number): string {
  if (!Number.isFinite(amount) || amount === 0) return formatRupiah(0);
  return `${amount > 0 ? "+" : "-"}${formatRupiah(Math.abs(amount))}`;
}

/**
 * Ambil nominal bulat dari input teks pengguna.
 * Hanya digit yang dipakai; bagian desimal setelah koma diabaikan.
 * Mengembalikan null bila tidak ada angka yang valid.
 */
export function parseRupiahInput(value: string): number | null {
  const integerPart = value.split(",")[0] ?? "";
  const digits = integerPart.replace(/\D/g, "");
  if (!digits) return null;

  const amount = Number(digits);
  return Number.isSafeInteger(amount) ? amount : null;
}

/** Format nilai untuk kotak input nominal (tanpa awalan "Rp"). */
export function formatRupiahInput(amount: number): string {
  if (!Number.isSafeInteger(amount) || amount < 0) return "";
  return rupiahFormatter.format(amount);
}

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  // Zona waktu dipatok agar hasil server dan browser selalu sama.
  timeZone: "Asia/Jakarta",
});

/** Format tanggal ISO menjadi tanggal Bahasa Indonesia, mis. "16 November 2026". */
export function formatTanggal(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "-";
  return dateFormatter.format(date);
}
