/**
 * Perhitungan split tagihan — fungsi murni, tanpa dependensi DB/UI.
 * Semua nominal adalah integer rupiah (tanpa desimal).
 *
 * Aturan pembulatan: pembagian dilakukan dengan pembagian bulat (floor),
 * lalu sisa pembulatan (total − jumlah bagian) dibebankan seluruhnya
 * kepada pembayar. Dengan demikian jumlah seluruh bagian selalu sama
 * persis dengan total tagihan.
 */

export type SplitMode = "EQUALS" | "SHARES";

export interface SharesItem {
  memberId: string;
  shares: number;
}

export interface SplitResult {
  memberId: string;
  shares: number;
  amount: number;
}

function assertValidAmount(totalAmount: number): void {
  if (!Number.isInteger(totalAmount)) {
    throw new Error("Nominal tagihan harus berupa bilangan bulat rupiah.");
  }
  if (totalAmount < 0) {
    throw new Error("Nominal tagihan tidak boleh negatif.");
  }
}

function assertUniqueIds(ids: string[]): void {
  if (new Set(ids).size !== ids.length) {
    throw new Error("Peserta tidak boleh duplikat.");
  }
}

/**
 * Membagi totalAmount secara merata ke participantIds.
 * Sisa pembulatan dibebankan ke payerId (pembayar wajib ikut sebagai peserta).
 */
export function computeEqualSplit(
  totalAmount: number,
  participantIds: string[],
  payerId: string,
): SplitResult[] {
  assertValidAmount(totalAmount);
  if (participantIds.length === 0) {
    throw new Error("Minimal satu peserta diperlukan.");
  }
  assertUniqueIds(participantIds);
  if (!participantIds.includes(payerId)) {
    throw new Error("Pembayar harus termasuk peserta.");
  }

  const base = Math.floor(totalAmount / participantIds.length);
  const remainder = totalAmount - base * participantIds.length;

  return participantIds.map((memberId) => ({
    memberId,
    shares: 1,
    amount: base + (memberId === payerId ? remainder : 0),
  }));
}

/**
 * Membagi totalAmount proporsional terhadap porsi (shares) tiap peserta.
 * Bagian = floor(total × shares / totalShares); sisa pembulatan dibebankan
 * ke payerId. Porsi harus bilangan bulat >= 1 dan peserta unik.
 */
export function computeSharesSplit(
  totalAmount: number,
  items: SharesItem[],
  payerId: string,
): SplitResult[] {
  assertValidAmount(totalAmount);
  if (items.length === 0) {
    throw new Error("Minimal satu peserta diperlukan.");
  }
  assertUniqueIds(items.map((item) => item.memberId));
  if (!items.some((item) => item.memberId === payerId)) {
    throw new Error("Pembayar harus termasuk peserta.");
  }
  for (const item of items) {
    if (!Number.isInteger(item.shares) || item.shares < 1) {
      throw new Error("Porsi harus bilangan bulat minimal 1.");
    }
  }

  const totalShares = items.reduce((sum, item) => sum + item.shares, 0);
  const amounts = items.map((item) => ({
    memberId: item.memberId,
    shares: item.shares,
    amount: Math.floor((totalAmount * item.shares) / totalShares),
  }));

  const allocated = amounts.reduce((sum, item) => sum + item.amount, 0);
  const remainder = totalAmount - allocated;
  const payer = amounts.find((item) => item.memberId === payerId);
  if (!payer) {
    // Tidak mungkin terjadi karena sudah divalidasi di atas.
    throw new Error("Pembayar harus termasuk peserta.");
  }
  payer.amount += remainder;

  return amounts;
}
