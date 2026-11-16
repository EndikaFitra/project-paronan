import { NextResponse } from "next/server";

import { apiError, readJson } from "@/src/lib/api";
import { getAdminCookie } from "@/src/lib/cookies";
import { prisma } from "@/src/lib/db";
import { findRoomByCode, toRoomSummary } from "@/src/lib/rooms";

async function readAdminTokenFromBody(request: Request): Promise<string | null> {
  // Body opsional: izinkan adminToken dikirim eksplisit selain via cookie.
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return null;
  }
  const body = await readJson(request);
  const token = body?.adminToken;
  return typeof token === "string" ? token : null;
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

  const cookieToken = await getAdminCookie();
  const bodyToken = await readAdminTokenFromBody(request);
  const token = cookieToken ?? bodyToken;
  if (!token || token !== room.adminToken) {
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
