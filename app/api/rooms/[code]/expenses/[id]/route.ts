import { NextResponse } from "next/server";

import { apiError, readJson } from "@/src/lib/api";
import { computeBillSplits, parseBillPayload } from "@/src/lib/bill-payload";
import { getAdminCookie } from "@/src/lib/cookies";
import { prisma } from "@/src/lib/db";
import { findRoomByCode, toRoomSummary } from "@/src/lib/rooms";

type Room = NonNullable<Awaited<ReturnType<typeof findRoomByCode>>>;

interface AdminCheck {
  allowed: boolean;
  body: Record<string, unknown> | null;
}

/**
 * Cek token admin: cookie (khusus) atau body `adminToken`, mana saja
 * yang tersedia. Dipakai bersama DELETE dan PATCH supaya tidak drift.
 * Body hanya dibaca satu kali di sini dan dikembalikan agar handler
 * tidak perlu membaca ulang (stream request tidak bisa di-rewind).
 */
async function checkAdmin(
  request: Request,
  room: Room,
): Promise<AdminCheck> {
  const cookieToken = await getAdminCookie(room.id);

  let body: Record<string, unknown> | null = null;
  if (request.headers.get("content-type")?.includes("application/json")) {
    body = await readJson(request);
  }

  const token = cookieToken ?? (typeof body?.adminToken === "string" ? body.adminToken : null);
  return { allowed: token !== null && token === room.adminToken, body };
}

// DELETE /api/rooms/[code]/expenses/[id] — soft delete bill (deletedAt).
export async function DELETE(
  request: Request,
  context: { params: Promise<{ code: string; id: string }> },
) {
  const { code, id } = await context.params;
  const room = await findRoomByCode(code);
  if (!room) {
    return apiError("Room tidak ditemukan. Periksa kembali kode room.", 404);
  }

  const { allowed } = await checkAdmin(request, room);
  if (!allowed) {
    return apiError(
      "Hanya pembuat room yang boleh menghapus tagihan. Token admin tidak valid.",
      403,
    );
  }

  const expense = await prisma.expense.findFirst({
    where: { id, roomId: room.id, deletedAt: null },
  });
  if (!expense) {
    return apiError("Tagihan tidak ditemukan atau sudah dihapus.", 404);
  }

  await prisma.expense.update({
    where: { id: expense.id },
    data: { deletedAt: new Date() },
  });

  const updatedRoom = await findRoomByCode(code);
  return NextResponse.json({
    message: "Tagihan berhasil dihapus.",
    room: updatedRoom ? toRoomSummary(updatedRoom) : null,
  });
}

// PATCH /api/rooms/[code]/expenses/[id] — ubah bill yang masih aktif.
export async function PATCH(
  request: Request,
  context: { params: Promise<{ code: string; id: string }> },
) {
  const { code, id } = await context.params;
  const room = await findRoomByCode(code);
  if (!room) {
    return apiError("Room tidak ditemukan. Periksa kembali kode room.", 404);
  }

  const { allowed, body } = await checkAdmin(request, room);
  if (!allowed) {
    return apiError(
      "Hanya pembuat room yang boleh mengubah tagihan. Token admin tidak valid.",
      403,
    );
  }

  // Cek tagihan aktif sebelum validasi body supaya 404 tetap konsisten.
  const expense = await prisma.expense.findFirst({
    where: { id, roomId: room.id, deletedAt: null },
  });
  if (!expense) {
    return apiError("Tagihan tidak ditemukan atau sudah dihapus.", 404);
  }

  if (!body) {
    return apiError("Body harus berupa JSON yang valid.", 400);
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
  await prisma.$transaction([
    prisma.expense.update({
      where: { id: expense.id },
      data: {
        description: payload.description,
        amount: payload.amount,
        payerId: payload.payerId,
        splitMode: payload.splitMode,
      },
    }),
    prisma.expenseSplit.deleteMany({ where: { expenseId: expense.id } }),
    prisma.expenseSplit.createMany({
      data: splitResults.map((split) => ({
        expenseId: expense.id,
        memberId: split.memberId,
        shares: split.shares,
        amount: split.amount,
      })),
    }),
  ]);

  const updatedRoom = await findRoomByCode(code);
  return NextResponse.json({
    message: "Tagihan berhasil diperbarui.",
    room: updatedRoom ? toRoomSummary(updatedRoom) : null,
  });
}
