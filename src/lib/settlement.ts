/**
 * Perhitungan saldo net dan settlement — fungsi murni, tanpa dependensi DB/UI.
 * Semua nominal adalah integer rupiah (tanpa desimal).
 *
 * Konvensi saldo (balance per anggota, dalam rupiah):
 *  - positif = anggota berhak menerima uang (kredit)
 *  - negatif = anggota berutang (debit)
 *  - jumlah seluruh saldo selalu 0.
 */

export interface Transfer {
  fromMemberId: string;
  toMemberId: string;
  amount: number;
}

/**
 * Menghitung saldo net tiap anggota dari daftar expense aktif.
 * Pembayar mendapat kredit sebesar nominal tagihan, lalu setiap peserta
 * mendapat debit sebesar bagian split-nya.
 */
export function computeBalances(
  expenses: {
    payerId: string;
    amount: number;
    splits: { memberId: string; amount: number }[];
  }[],
  balance: Record<string, number> = {},
): Record<string, number> {
  const balances: Record<string, number> = { ...balance };
  for (const expense of expenses) {
    balances[expense.payerId] = (balances[expense.payerId] ?? 0) + expense.amount;
    for (const split of expense.splits) {
      balances[split.memberId] = (balances[split.memberId] ?? 0) - split.amount;
    }
  }
  return balances;
}

/**
 * Settlement greedy min-transfer.
 *
 * Selalu mencocokkan debitur terbesar dengan kreditur terbesar. Algoritma ini
 * menghasilkan paling banyak (jumlah anggota bersaldo ≠ 0) − 1 transfer.
 * Anggota yang saldonya nol tidak pernah muncul dalam transfer.
 */
export function computeSettlement(balances: Record<string, number>): Transfer[] {
  const ids = Object.keys(balances);
  const total = ids.reduce((sum, id) => sum + balances[id], 0);
  if (total !== 0) {
    throw new Error("Total saldo harus nol.");
  }

  // Salinan agar argumen tidak termutasi.
  const work = ids.map((id) => ({ id, amount: balances[id] }));
  const debtors = work
    .filter((entry) => entry.amount < 0)
    .map((entry) => ({ ...entry, amount: -entry.amount }))
    .sort((a, b) => b.amount - a.amount || a.id.localeCompare(b.id));
  const creditors = work
    .filter((entry) => entry.amount > 0)
    .sort((a, b) => b.amount - a.amount || a.id.localeCompare(b.id));

  const transfers: Transfer[] = [];
  let d = 0;
  let c = 0;
  while (d < debtors.length && c < creditors.length) {
    const debtor = debtors[d];
    const creditor = creditors[c];
    const amount = Math.min(debtor.amount, creditor.amount);

    if (amount > 0) {
      transfers.push({
        fromMemberId: debtor.id,
        toMemberId: creditor.id,
        amount,
      });
      debtor.amount -= amount;
      creditor.amount -= amount;
    }

    if (debtor.amount === 0) d += 1;
    if (creditor.amount === 0) c += 1;
  }

  return transfers;
}
