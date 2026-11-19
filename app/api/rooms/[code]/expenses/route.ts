import { NextResponse } from "next/server";

import { apiError, readJson } from "@/src/lib/api";
import { prisma } from "@/src/lib/db";
import { computeBillSplits, parseBillPayload } from "@/src/lib/bill-payload";
import { findRoomByCode, toRoomSummary } from "@/src/lib/rooms";

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

  const room = await findRoomByCode(code);
  if (!room) {
    return apiError("Room tidak ditemukan. Periksa kembali kode room.", 404);
  }

  const result = parseBillPayload(
    body,
    room.members.map((member) => member.id),
  );
  if (!result.ok) {
    return apiError(result.message, 400);
  }

  let splitResults;
  try {
    splitResults = computeBillSplits(result.value);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Perhitungan split gagal.";
    return apiError(message, 400);
  }

  const payload = result.value;
  const expense = await prisma.expense.create({
    data: {
      roomId: room.id,
      description: payload.description,
      amount: payload.amount,
      payerId: payload.payerId,
      splitMode: payload.splitMode,
      splits: {
        create: splitResults.map((split) => ({
          memberId: split.memberId,
          shares: split.shares,
          amount: split.amount,
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
