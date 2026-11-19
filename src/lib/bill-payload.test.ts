import { describe, expect, it } from "vitest";

import {
  computeBillSplits,
  parseBillPayload,
  type BillPayload,
} from "./bill-payload";
import { MAX_DESCRIPTION_LENGTH } from "./limits";

const memberIds = ["a", "b", "c"];

const total = (parts: { amount: number }[]) =>
  parts.reduce((sum, part) => sum + part.amount, 0);

const basePayload = {
  description: "Makan malam",
  amount: 30_000,
  payerId: "a",
  splitMode: "EQUALS",
} as const;

function parse(body: Record<string, unknown>) {
  return parseBillPayload({ ...basePayload, ...body }, memberIds);
}

describe("parseBillPayload", () => {
  it("menerima payload EQUALS dengan participants string", () => {
    const result = parse({ participants: ["a", "b"] });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.participants).toEqual([
        { memberId: "a", shares: 1 },
        { memberId: "b", shares: 1 },
      ]);
    }
  });

  it("menerima payload EQUALS dengan participants objek", () => {
    const result = parse({ participants: [{ memberId: "a" }, { memberId: "b" }] });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.participants).toEqual([
        { memberId: "a", shares: 1 },
        { memberId: "b", shares: 1 },
      ]);
    }
  });

  it("menerima payload SHARES dengan porsi", () => {
    const result = parse({
      splitMode: "SHARES",
      shares: [
        { memberId: "a", shares: 2 },
        { memberId: "b", shares: 1 },
      ],
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.splitMode).toBe("SHARES");
      expect(result.value.participants).toEqual([
        { memberId: "a", shares: 2 },
        { memberId: "b", shares: 1 },
      ]);
    }
  });

  it("menolak deskripsi kosong", () => {
    expect(parse({ description: "" })).toEqual({
      ok: false,
      message: "Deskripsi tagihan wajib diisi.",
    });
  });

  it("menolak deskripsi whitespace saja", () => {
    expect(parse({ description: "   " })).toEqual({
      ok: false,
      message: "Deskripsi tagihan wajib diisi.",
    });
  });

  it("menolak deskripsi melebihi batas karakter", () => {
    const result = parse({ description: "x".repeat(MAX_DESCRIPTION_LENGTH + 1) });

    expect(result).toEqual({
      ok: false,
      message: `Deskripsi tagihan maksimal ${MAX_DESCRIPTION_LENGTH} karakter.`,
    });
  });

  it("menolak nominal 0", () => {
    expect(parse({ amount: 0 })).toEqual({
      ok: false,
      message: "Nominal tagihan harus bilangan bulat rupiah lebih dari 0.",
    });
  });

  it("menolak nominal negatif", () => {
    expect(parse({ amount: -1000 })).toEqual({
      ok: false,
      message: "Nominal tagihan harus bilangan bulat rupiah lebih dari 0.",
    });
  });

  it("menolak nominal tidak bulat", () => {
    expect(parse({ amount: 1000.5 })).toEqual({
      ok: false,
      message: "Nominal tagihan harus bilangan bulat rupiah lebih dari 0.",
    });
  });

  it("menolak nominal berupa string", () => {
    expect(parse({ amount: "30000" })).toEqual({
      ok: false,
      message: "Nominal tagihan harus bilangan bulat rupiah lebih dari 0.",
    });
  });

  it("menolak pembayar di luar anggota room", () => {
    expect(parse({ payerId: "x", participants: ["a", "b"] })).toEqual({
      ok: false,
      message: "Pembayar bukan anggota room ini.",
    });
  });

  it("menolak participants kosong", () => {
    expect(parse({ participants: [] })).toEqual({
      ok: false,
      message: "Peserta wajib diisi minimal satu anggota.",
    });
  });

  it("menolak participants yang bukan array", () => {
    expect(parse({ participants: "a,b" })).toEqual({
      ok: false,
      message: "Peserta wajib diisi minimal satu anggota.",
    });
  });

  it("menolak peserta duplikat", () => {
    expect(parse({ participants: ["a", "a"] })).toEqual({
      ok: false,
      message: "Peserta tidak boleh duplikat.",
    });
  });

  it("menolak peserta yang bukan anggota room", () => {
    expect(parse({ participants: ["a", "x"] })).toEqual({
      ok: false,
      message: "Ada peserta yang bukan anggota room ini.",
    });
  });

  it("menolak SHARES dengan porsi 0", () => {
    expect(
      parse({
        splitMode: "SHARES",
        shares: [
          { memberId: "a", shares: 0 },
          { memberId: "b", shares: 1 },
        ],
      }),
    ).toEqual({
      ok: false,
      message: "Porsi wajib diisi untuk setiap peserta (minimal 1).",
    });
  });

  it("menolak SHARES dengan porsi pecahan", () => {
    expect(
      parse({
        splitMode: "SHARES",
        shares: [
          { memberId: "a", shares: 1.5 },
          { memberId: "b", shares: 1 },
        ],
      }),
    ).toEqual({
      ok: false,
      message: "Porsi wajib diisi untuk setiap peserta (minimal 1).",
    });
  });
});

describe("computeBillSplits", () => {
  it("membagi EQUALS habis dan berjumlah tepat", () => {
    const payload: BillPayload = {
      description: "Makan malam",
      amount: 30_000,
      payerId: "a",
      splitMode: "EQUALS",
      participants: [
        { memberId: "a", shares: 1 },
        { memberId: "b", shares: 1 },
        { memberId: "c", shares: 1 },
      ],
    };

    const result = computeBillSplits(payload);
    expect(total(result)).toBe(30_000);
    expect(result).toEqual([
      { memberId: "a", shares: 1, amount: 10_000 },
      { memberId: "b", shares: 1, amount: 10_000 },
      { memberId: "c", shares: 1, amount: 10_000 },
    ]);
  });

  it("EQUALS dengan sisa tetap berjumlah tepat", () => {
    const payload: BillPayload = {
      description: "Makan malam",
      amount: 10_000,
      payerId: "b",
      splitMode: "EQUALS",
      participants: [
        { memberId: "a", shares: 1 },
        { memberId: "b", shares: 1 },
        { memberId: "c", shares: 1 },
      ],
    };

    const result = computeBillSplits(payload);
    expect(total(result)).toBe(10_000);
    expect(result.find((r) => r.memberId === "b")?.amount).toBe(3_334);
    expect(result.find((r) => r.memberId === "a")?.amount).toBe(3_333);
    expect(result.find((r) => r.memberId === "c")?.amount).toBe(3_333);
  });

  it("SHARES berjumlah tepat dengan sisa", () => {
    const payload: BillPayload = {
      description: "Belanja",
      amount: 10_000,
      payerId: "a",
      splitMode: "SHARES",
      participants: [
        { memberId: "a", shares: 2 },
        { memberId: "b", shares: 1 },
      ],
    };

    const result = computeBillSplits(payload);
    expect(total(result)).toBe(10_000);
    expect(result.find((r) => r.memberId === "a")?.amount).toBe(6_667);
    expect(result.find((r) => r.memberId === "b")?.amount).toBe(3_333);
  });
});
