import { describe, expect, it } from "vitest";

import { computeBalances, computeSettlement } from "./settlement";

describe("computeBalances", () => {
  it("menghitung saldo net dari tagihan aktif", () => {
    const balances = computeBalances([
      {
        payerId: "a",
        amount: 30_000,
        splits: [
          { memberId: "a", amount: 10_000 },
          { memberId: "b", amount: 10_000 },
          { memberId: "c", amount: 10_000 },
        ],
      },
    ]);

    expect(balances).toEqual({ a: 20_000, b: -10_000, c: -10_000 });
  });

  it("menjumlahkan beberapa tagihan dan pembayar berbeda", () => {
    const balances = computeBalances([
      {
        payerId: "a",
        amount: 10_000,
        splits: [
          { memberId: "a", amount: 5_000 },
          { memberId: "b", amount: 5_000 },
        ],
      },
      {
        payerId: "b",
        amount: 4_000,
        splits: [
          { memberId: "a", amount: 2_000 },
          { memberId: "b", amount: 2_000 },
        ],
      },
    ]);

    expect(balances).toEqual({ a: 3_000, b: -3_000 });
  });

  it("mempertahankan saldo awal yang diberikan", () => {
    const balances = computeBalances([], { a: 1_000, b: -1_000 });

    expect(balances).toEqual({ a: 1_000, b: -1_000 });
  });
});

describe("computeSettlement", () => {
  const transferCount = (
    balances: Record<string, number>,
    members: string[],
  ) => {
    const charged = members.filter((id) => (balances[id] ?? 0) !== 0).length;
    return { transfers: computeSettlement(balances), expectedMax: Math.max(0, charged - 1) };
  };

  it("kasus 2 orang: satu transfer penuh", () => {
    const { transfers, expectedMax } = transferCount(
      { a: 25_000, b: -25_000 },
      ["a", "b"],
    );

    expect(transfers).toEqual([
      { fromMemberId: "b", toMemberId: "a", amount: 25_000 },
    ]);
    expect(expectedMax).toBe(1);
  });

  it("kasus >2 orang dengan rantai utang (2 transfer)", () => {
    const balances = { a: 30_000, b: -20_000, c: -10_000 };
    const { transfers, expectedMax } = transferCount(balances, ["a", "b", "c"]);

    expect(transfers).toHaveLength(2);
    expect(transfers).toHaveLength(expectedMax);
    expect(transfers.reduce((sum, t) => sum + t.amount, 0)).toBe(30_000);
    expect(transfers).toContainEqual({
      fromMemberId: "b",
      toMemberId: "a",
      amount: 20_000,
    });
    expect(transfers).toContainEqual({
      fromMemberId: "c",
      toMemberId: "a",
      amount: 10_000,
    });
  });

  it("kasus >2 orang: 4 anggota bermuatan tidak melebihi 3 transfer", () => {
    const balances = { a: 15_000, b: 10_000, c: -12_000, d: -13_000 };
    const { transfers, expectedMax } = transferCount(balances, [
      "a",
      "b",
      "c",
      "d",
    ]);

    expect(transfers).toHaveLength(3);
    expect(transfers).toHaveLength(expectedMax);
    expect(transfers.reduce((sum, t) => sum + t.amount, 0)).toBe(25_000);
  });

  it("kasus 5 orang dengan banyak netting", () => {
    const balances = {
      a: 50_000,
      b: 25_000,
      c: -20_000,
      d: -30_000,
      e: -25_000,
    };
    const { transfers, expectedMax } = transferCount(balances, [
      "a",
      "b",
      "c",
      "d",
      "e",
    ]);

    expect(transfers.length).toBeLessThanOrEqual(expectedMax);
    expect(transfers.length).toBeLessThanOrEqual(4);
    expect(
      transfers.every((t) => t.amount > 0),
    ).toBe(true);
    expect(transfers.reduce((sum, t) => sum + t.amount, 0)).toBe(75_000);
  });

  it("kasus semua lunas: tidak ada transfer", () => {
    expect(computeSettlement({ a: 0, b: 0, c: 0 })).toEqual([]);
    expect(computeSettlement({})).toEqual([]);
  });

  it("mengabaikan anggota bersaldo nol", () => {
    const transfers = computeSettlement({ a: 10_000, b: 0, c: -10_000 });

    expect(transfers).toEqual([
      { fromMemberId: "c", toMemberId: "a", amount: 10_000 },
    ]);
    expect(transfers.some((t) => t.fromMemberId === "b" || t.toMemberId === "b"))
      .toBe(false);
  });

  it("menyelesaikan pembulatan rupiah (tidak ada pecahan)", () => {
    const balances = { a: 3_334, b: -3_333, c: -1 };
    const transfers = computeSettlement(balances);

    expect(transfers.every((t) => Number.isInteger(t.amount))).toBe(true);
    expect(transfers.reduce((sum, t) => sum + t.amount, 0)).toBe(3_334);
    expect(transfers).toContainEqual({
      fromMemberId: "b",
      toMemberId: "a",
      amount: 3_333,
    });
    expect(transfers).toContainEqual({
      fromMemberId: "c",
      toMemberId: "a",
      amount: 1,
    });
  });

  it("tidak memutasi argumen saldo", () => {
    const balances = { a: 5_000, b: -5_000 };
    computeSettlement(balances);

    expect(balances).toEqual({ a: 5_000, b: -5_000 });
  });

  it("menolak saldo yang tidak berjumlah nol", () => {
    expect(() => computeSettlement({ a: 100, b: -50 })).toThrow(
      "Total saldo harus nol.",
    );
  });

  it("selalu menghasilkan transfer yang melunasi seluruh saldo", () => {
    const balances = { a: 1, b: 2, c: 3, d: -2, e: -4 };
    const transfers = computeSettlement(balances);
    const net: Record<string, number> = { ...balances };

    for (const t of transfers) {
      net[t.fromMemberId] += t.amount;
      net[t.toMemberId] -= t.amount;
    }

    expect(net).toEqual({ a: 0, b: 0, c: 0, d: 0, e: 0 });
  });
});
