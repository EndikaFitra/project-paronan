import type { PrismaClient } from "@prisma/client";

import { prisma } from "./db";
import type { RoomSummary } from "./api";
import { computeBalances, computeSettlement } from "./settlement";
import type { SplitMode } from "./split";
import { ensureRoomCode } from "./codes";

type Db = Pick<PrismaClient, "room">;

export const roomInclude = {
  members: { orderBy: { createdAt: "asc" as const } },
  expenses: {
    where: { deletedAt: null },
    orderBy: { createdAt: "asc" as const },
    include: {
      payer: { select: { id: true, name: true } },
      splits: true,
    },
  },
};

/** Ambil room aktif lengkap dengan anggota dan bill aktif; null bila tidak ada. */
export async function findRoomByCode(code: string) {
  return prisma.room.findUnique({
    where: { code },
    include: roomInclude,
  });
}

export async function generateUniqueRoomCode(db: Db = prisma): Promise<string> {
  // Loop sangat jarang berulang; kode 10 karakter acak dari 36 simbol.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const code = ensureRoomCode();
    const existing = await db.room.findUnique({ where: { code } });
    if (!existing) return code;
  }
  throw new Error("Gagal membuat kode room unik.");
}

export function toRoomSummary(room: Awaited<ReturnType<typeof findRoomByCode>>): RoomSummary {
  if (!room) {
    throw new Error("Room tidak ditemukan.");
  }

  const memberIds = room.members.map((member) => member.id);
  const baseBalances: Record<string, number> = {};
  for (const id of memberIds) baseBalances[id] = 0;

  const balances = computeBalances(
    room.expenses.map((expense) => ({
      payerId: expense.payerId,
      amount: expense.amount,
      splits: expense.splits.map((split) => ({
        memberId: split.memberId,
        amount: split.amount,
      })),
    })),
    baseBalances,
  );

  return {
    id: room.id,
    name: room.name,
    code: room.code,
    createdAt: room.createdAt.toISOString(),
    members: room.members.map((member) => ({
      id: member.id,
      name: member.name,
      createdAt: member.createdAt.toISOString(),
    })),
    bills: room.expenses.map((expense) => ({
      id: expense.id,
      description: expense.description,
      amount: expense.amount,
      payerId: expense.payerId,
      payerName: expense.payer.name,
      splitMode: expense.splitMode as SplitMode,
      createdAt: expense.createdAt.toISOString(),
      splits: expense.splits.map((split) => ({
        memberId: split.memberId,
        shares: split.shares,
        amount: split.amount,
      })),
    })),
    balances,
    settlement: computeSettlement(balances),
  };
}
