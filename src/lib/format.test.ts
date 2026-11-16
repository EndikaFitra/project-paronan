import { describe, expect, it } from "vitest";

import {
  formatRupiah,
  formatRupiahInput,
  formatSignedRupiah,
  formatTanggal,
  parseRupiahInput,
} from "./format";

describe("formatRupiah", () => {
  it("memakai pemisah ribuan Indonesia", () => {
    expect(formatRupiah(12_500)).toBe("Rp 12.500");
    expect(formatRupiah(1_000_000)).toBe("Rp 1.000.000");
  });

  it("menangani nol dan nominal kecil", () => {
    expect(formatRupiah(0)).toBe("Rp 0");
    expect(formatRupiah(7)).toBe("Rp 7");
  });

  it("meletakkan tanda minus sebelum Rp", () => {
    expect(formatRupiah(-5_000)).toBe("-Rp 5.000");
  });
});

describe("formatSignedRupiah", () => {
  it("memberi tanda plus untuk saldo positif", () => {
    expect(formatSignedRupiah(12_500)).toBe("+Rp 12.500");
  });

  it("memberi tanda minus untuk saldo negatif", () => {
    expect(formatSignedRupiah(-5_000)).toBe("-Rp 5.000");
  });

  it("tidak memberi tanda untuk saldo nol", () => {
    expect(formatSignedRupiah(0)).toBe("Rp 0");
  });
});

describe("parseRupiahInput", () => {
  it("membaca angka yang sudah diformat maupun mentah", () => {
    expect(parseRupiahInput("12.500")).toBe(12_500);
    expect(parseRupiahInput("Rp 12.500")).toBe(12_500);
    expect(parseRupiahInput("12500")).toBe(12_500);
  });

  it("mengabaikan bagian desimal", () => {
    expect(parseRupiahInput("12.500,75")).toBe(12_500);
  });

  it("mengembalikan null untuk input tanpa angka", () => {
    expect(parseRupiahInput("")).toBeNull();
    expect(parseRupiahInput("abc")).toBeNull();
  });
});

describe("formatRupiahInput", () => {
  it("memberi pemisah ribuan tanpa awalan Rp", () => {
    expect(formatRupiahInput(12_500)).toBe("12.500");
    expect(formatRupiahInput(0)).toBe("0");
  });
});

describe("formatTanggal", () => {
  it("menampilkan tanggal dalam Bahasa Indonesia (WIB)", () => {
    // 2026-11-16T18:30:00Z = 17 November 2026 01:30 WIB.
    expect(formatTanggal("2026-11-16T18:30:00.000Z")).toBe("17 November 2026");
  });

  it("mengembalikan strip untuk tanggal tidak valid", () => {
    expect(formatTanggal("bukan-tanggal")).toBe("-");
  });
});
