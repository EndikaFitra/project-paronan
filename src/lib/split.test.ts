import { describe, expect, it } from "vitest";

import { computeEqualSplit, computeSharesSplit } from "./split";

const total = (parts: { amount: number }[]) =>
  parts.reduce((sum, part) => sum + part.amount, 0);

describe("computeEqualSplit", () => {
  it("membagi rata tanpa sisa untuk pembagian habis", () => {
    const result = computeEqualSplit(30_000, ["a", "b", "c"], "a");

    expect(result).toEqual([
      { memberId: "a", shares: 1, amount: 10_000 },
      { memberId: "b", shares: 1, amount: 10_000 },
      { memberId: "c", shares: 1, amount: 10_000 },
    ]);
    expect(total(result)).toBe(30_000);
  });

  it("membebankan seluruh sisa pembulatan ke pembayar", () => {
    const result = computeEqualSplit(10_000, ["a", "b", "c"], "b");

    expect(result.find((r) => r.memberId === "b")?.amount).toBe(3_334);
    expect(result.find((r) => r.memberId === "a")?.amount).toBe(3_333);
    expect(result.find((r) => r.memberId === "c")?.amount).toBe(3_333);
    expect(total(result)).toBe(10_000);
  });

  it("membebankan sisa terbesar ke pembayar meski pembayar bukan peserta pertama", () => {
    const result = computeEqualSplit(7, ["x", "y", "z"], "z");

    expect(result.find((r) => r.memberId === "z")?.amount).toBe(3);
    expect(total(result)).toBe(7);
  });

  it("menangani dua peserta dengan selisih 1 rupiah", () => {
    const result = computeEqualSplit(5, ["a", "b"], "a");

    expect(result).toEqual([
      { memberId: "a", shares: 1, amount: 3 },
      { memberId: "b", shares: 1, amount: 2 },
    ]);
  });

  it("membagi ke satu peserta (seluruhnya ke pembayar)", () => {
    const result = computeEqualSplit(12_345, ["a"], "a");

    expect(result).toEqual([{ memberId: "a", shares: 1, amount: 12_345 }]);
  });

  it("menangani nominal nol", () => {
    const result = computeEqualSplit(0, ["a", "b"], "a");

    expect(result.every((r) => r.amount === 0)).toBe(true);
  });

  it("menolak daftar peserta kosong", () => {
    expect(() => computeEqualSplit(1000, [], "a")).toThrow(
      "Minimal satu peserta diperlukan.",
    );
  });

  it("menolak pembayar yang bukan peserta", () => {
    expect(() => computeEqualSplit(1000, ["a", "b"], "c")).toThrow(
      "Pembayar harus termasuk peserta.",
    );
  });

  it("menolak peserta duplikat, nominal negatif, dan nominal desimal", () => {
    expect(() => computeEqualSplit(1000, ["a", "a"], "a")).toThrow(
      "Peserta tidak boleh duplikat.",
    );
    expect(() => computeEqualSplit(-1, ["a"], "a")).toThrow(
      "Nominal tagihan tidak boleh negatif.",
    );
    expect(() => computeEqualSplit(1000.5, ["a"], "a")).toThrow(
      "Nominal tagihan harus berupa bilangan bulat rupiah.",
    );
  });
});

describe("computeSharesSplit", () => {
  it("membagi proporsional terhadap porsi", () => {
    const result = computeSharesSplit(
      30_000,
      [
        { memberId: "a", shares: 2 },
        { memberId: "b", shares: 1 },
      ],
      "a",
    );

    expect(result).toEqual([
      { memberId: "a", shares: 2, amount: 20_000 },
      { memberId: "b", shares: 1, amount: 10_000 },
    ]);
    expect(total(result)).toBe(30_000);
  });

  it("membebankan sisa pembulatan ke pembayar", () => {
    const result = computeSharesSplit(
      10_000,
      [
        { memberId: "a", shares: 1 },
        { memberId: "b", shares: 1 },
        { memberId: "c", shares: 1 },
      ],
      "a",
    );

    expect(result[0]).toEqual({ memberId: "a", shares: 1, amount: 3_334 });
    expect(total(result)).toBe(10_000);
  });

  it("membebankan sisa ke pembayar yang porsinya kecil", () => {
    const result = computeSharesSplit(
      100,
      [
        { memberId: "a", shares: 1 },
        { memberId: "b", shares: 2 },
        { memberId: "c", shares: 4 },
      ],
      "a",
    );

    // floor: a=14, b=28, c=57 → sisa 1 ke pembayar a
    expect(result.find((r) => r.memberId === "a")?.amount).toBe(15);
    expect(total(result)).toBe(100);
  });

  it("mendukung banyak porsi kecil dengan total pas", () => {
    const result = computeSharesSplit(
      9,
      [
        { memberId: "a", shares: 1 },
        { memberId: "b", shares: 1 },
        { memberId: "c", shares: 1 },
      ],
      "b",
    );

    expect(result.find((r) => r.memberId === "b")?.amount).toBe(3);
    expect(total(result)).toBe(9);
  });

  it("menolak porsi nol atau pecahan", () => {
    expect(() =>
      computeSharesSplit(1000, [{ memberId: "a", shares: 0 }], "a"),
    ).toThrow("Porsi harus bilangan bulat minimal 1.");
    expect(() =>
      computeSharesSplit(1000, [{ memberId: "a", shares: 1.5 }], "a"),
    ).toThrow("Porsi harus bilangan bulat minimal 1.");
  });

  it("menolak pembayar yang bukan peserta dan peserta duplikat", () => {
    expect(() =>
      computeSharesSplit(1000, [{ memberId: "a", shares: 1 }], "b"),
    ).toThrow("Pembayar harus termasuk peserta.");
    expect(() =>
      computeSharesSplit(
        1000,
        [
          { memberId: "a", shares: 1 },
          { memberId: "a", shares: 2 },
        ],
        "a",
      ),
    ).toThrow("Peserta tidak boleh duplikat.");
  });
});
