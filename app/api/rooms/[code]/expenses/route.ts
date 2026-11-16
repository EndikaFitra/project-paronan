import { NextResponse } from "next/server";

import {
  apiError,
  isPositiveInteger,
  isNonEmptyString,
  MAX_DESCRIPTION_LENGTH,
  readJson,
} from "@/src/lib/api";
import { prisma } from "@/src/lib/db";
import { computeEqualSplit, computeSharesSplit } from "@/src/lib/split";
import { findRoomByCode, toRoomSummary } from "@/src/lib/rooms";

interface ParticipantInput {
  memberId: string;
  shares?: number;
}

/**
 * - EQUALS: `participants: ["id", ...]` (string), juga menerima `[{ memberId }]`.
 * - SHARES: `shares: [{ memberId, shares }, ...]`, shares wajib >= 1.
 */
function parseParticipants(
  value: unknown,
  mode: "EQUALS" | "SHARES",
): ParticipantInput[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;

  const participants: ParticipantInput[] = [];
  for (const item of value) {
    if (mode === "EQUALS" && isNonEmptyString(item)) {
      participants.push({ memberId: item });
      continue;
    }
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      return null;
    }
    const entry = item as Record<string, unknown>;
    if (!isNonEmptyString(entry.memberId)) return null;

    if (mode === "EQUALS") {
      participants.push({ memberId: entry.memberId });
    } else if (isPositiveInteger(entry.shares)) {
      participants.push({ memberId: entry.memberId, shares: entry.shares });
    } else {
      return null;
    }
  }
  return participants;
}

function isSplitMode(value: unknown): value is "EQUALS" | "SHARES" {
  return value === "EQUALS" || value === "SHARES";
}

// POST /api/rooms/[code]/expenses — catat bill baru.
export async function POST(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;
  const body = await readJson(request);
  if (!body) {
    return apiError("Body harus berupa JSON yang valid.", 400);
  }

  const { description, amount, payerId, splitMode } = body;
  if (!isNonEmptyString(description)) {
    return apiError("Deskripsi tagihan wajib diisi.", 400);
  }
  if (description.trim().length > MAX_DESCRIPTION_LENGTH) {
    return apiError(
      `Deskripsi tagihan maksimal ${MAX_DESCRIPTION_LENGTH} karakter.`,
      400,
    );
  }
  if (!isPositiveInteger(amount)) {
    return apiError("Nominal tagihan harus bilangan bulat rupiah lebih dari 0.", 400);
  }
  if (!isNonEmptyString(payerId)) {
    return apiError("Pembayar wajib dipilih.", 400);
  }
  if (!isSplitMode(splitMode)) {
    return apiError("Mode split harus EQUALS atau SHARES.", 400);
  }

  const room = await findRoomByCode(code);
  if (!room) {
    return apiError("Room tidak ditemukan. Periksa kembali kode room.", 404);
  }

  const memberIds = new Set(room.members.map((member) => member.id));
  if (!memberIds.has(payerId)) {
    return apiError("Pembayar bukan anggota room ini.", 400);
  }

  // Bentuk input peserta berbeda per mode:
  // - EQUALS: { participants: ["id", ...] }
  // - SHARES: { shares: [{ memberId, shares }, ...] }
  const participants = parseParticipants(
    splitMode === "EQUALS" ? body.participants : body.shares,
    splitMode,
  );
  if (!participants) {
    return apiError(
      splitMode === "EQUALS"
        ? "Peserta wajib diisi minimal satu anggota."
        : "Porsi wajib diisi untuk setiap peserta (minimal 1).",
      400,
    );
  }

  const uniqueIds = new Set(participants.map((item) => item.memberId));
  if (uniqueIds.size !== participants.length) {
    return apiError("Peserta tidak boleh duplikat.", 400);
  }
  for (const participant of participants) {
    if (!memberIds.has(participant.memberId)) {
      return apiError("Ada peserta yang bukan anggota room ini.", 400);
    }
  }

  let splitResults;
  try {
    splitResults =
      splitMode === "EQUALS"
        ? computeEqualSplit(
            amount,
            participants.map((item) => item.memberId),
            payerId,
          )
        : computeSharesSplit(
            amount,
            participants.map((item) => ({
              memberId: item.memberId,
              shares: item.shares ?? 1,
            })),
            payerId,
          );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Perhitungan split gagal.";
    return apiError(message, 400);
  }

  const expense = await prisma.expense.create({
    data: {
      roomId: room.id,
      description: description.trim(),
      amount,
      payerId,
      splitMode,
      splits: {
        create: splitResults.map((result) => ({
          memberId: result.memberId,
          shares: result.shares,
          amount: result.amount,
        })),
      },
    },
    include: { splits: true },
  });

  const updatedRoom = await findRoomByCode(code);
  return NextResponse.json(
    {
      message: "Tagihan berhasil dicatat.",
      expense: {
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        payerId: expense.payerId,
        splitMode: expense.splitMode,
        splits: expense.splits.map((split) => ({
          memberId: split.memberId,
          shares: split.shares,
          amount: split.amount,
        })),
      },
      room: updatedRoom ? toRoomSummary(updatedRoom) : null,
    },
    { status: 201 },
  );
}
