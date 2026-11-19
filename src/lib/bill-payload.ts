/**
 * Validasi payload tagihan yang dipakai bersama server dan klien.
 *
 * Modul ini sengaja bebas dari `next/server` dan Prisma supaya aman
 * diimpor komponen client. Semua aturan "tagihan yang sah" hidup di
 * sini: route POST, route PATCH, dan form di browser memanggil fungsi
 * yang sama sehingga tidak mungkin berbeda pendapat.
 */

import { MAX_DESCRIPTION_LENGTH } from "./limits";
import {
  computeEqualSplit,
  computeSharesSplit,
  type SplitMode,
  type SplitResult,
} from "./split";

export interface BillParticipantInput {
  memberId: string;
  shares: number;
}

export interface BillPayload {
  description: string;
  amount: number;
  payerId: string;
  splitMode: SplitMode;
  participants: BillParticipantInput[];
}

export type ParseBillResult =
  | { ok: true; value: BillPayload }
  | { ok: false; message: string };

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

function isSplitMode(value: unknown): value is SplitMode {
  return value === "EQUALS" || value === "SHARES";
}

/**
 * Peserta menerima dua bentuk, tergantung mode:
 * - EQUALS: `["id", ...]` atau `[{ memberId }, ...]`
 * - SHARES: `[{ memberId, shares }, ...]` dengan shares >= 1
 */
function parseParticipants(
  value: unknown,
  mode: SplitMode,
): BillParticipantInput[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;

  const participants: BillParticipantInput[] = [];
  for (const item of value) {
    if (mode === "EQUALS" && isNonEmptyString(item)) {
      participants.push({ memberId: item, shares: 1 });
      continue;
    }
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      return null;
    }
    const entry = item as Record<string, unknown>;
    if (!isNonEmptyString(entry.memberId)) return null;

    if (mode === "EQUALS") {
      participants.push({ memberId: entry.memberId, shares: 1 });
    } else if (isPositiveInteger(entry.shares)) {
      participants.push({ memberId: entry.memberId, shares: entry.shares });
    } else {
      return null;
    }
  }
  return participants;
}

/**
 * Ubah body mentah menjadi payload tagihan yang tervalidasi.
 * `memberIds` adalah anggota room yang sah; peserta dan pembayar
 * wajib termasuk di dalamnya.
 */
export function parseBillPayload(
  body: Record<string, unknown>,
  memberIds: string[],
): ParseBillResult {
  const { description, amount, payerId, splitMode } = body;

  if (!isNonEmptyString(description)) {
    return { ok: false, message: "Deskripsi tagihan wajib diisi." };
  }
  if (description.trim().length > MAX_DESCRIPTION_LENGTH) {
    return {
      ok: false,
      message: `Deskripsi tagihan maksimal ${MAX_DESCRIPTION_LENGTH} karakter.`,
    };
  }
  if (!isPositiveInteger(amount)) {
    return {
      ok: false,
      message: "Nominal tagihan harus bilangan bulat rupiah lebih dari 0.",
    };
  }
  if (!isNonEmptyString(payerId)) {
    return { ok: false, message: "Pembayar wajib dipilih." };
  }
  if (!isSplitMode(splitMode)) {
    return { ok: false, message: "Mode split harus EQUALS atau SHARES." };
  }

  const memberIdSet = new Set(memberIds);
  if (!memberIdSet.has(payerId)) {
    return { ok: false, message: "Pembayar bukan anggota room ini." };
  }

  const participants = parseParticipants(
    splitMode === "EQUALS" ? body.participants : body.shares,
    splitMode,
  );
  if (!participants) {
    return {
      ok: false,
      message:
        splitMode === "EQUALS"
          ? "Peserta wajib diisi minimal satu anggota."
          : "Porsi wajib diisi untuk setiap peserta (minimal 1).",
    };
  }

  const uniqueIds = new Set(participants.map((item) => item.memberId));
  if (uniqueIds.size !== participants.length) {
    return { ok: false, message: "Peserta tidak boleh duplikat." };
  }
  for (const participant of participants) {
    if (!memberIdSet.has(participant.memberId)) {
      return { ok: false, message: "Ada peserta yang bukan anggota room ini." };
    }
  }

  return {
    ok: true,
    value: {
      description: description.trim(),
      amount,
      payerId,
      splitMode,
      participants,
    },
  };
}

/**
 * Hitung bagian tiap peserta. Pembulatan dibebankan ke pembayar
 * sehingga jumlah bagian selalu sama persis dengan nominal tagihan.
 * Melempar `Error` bila aturan split dilanggar.
 */
export function computeBillSplits(payload: BillPayload): SplitResult[] {
  return payload.splitMode === "EQUALS"
    ? computeEqualSplit(
        payload.amount,
        payload.participants.map((item) => item.memberId),
        payload.payerId,
      )
    : computeSharesSplit(payload.amount, payload.participants, payload.payerId);
}
