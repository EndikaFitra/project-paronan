import { NextResponse } from "next/server";

import { apiError } from "@/src/lib/api";
import { findRoomByCode, toRoomSummary } from "@/src/lib/rooms";

// GET /api/rooms/[code] — detail room: anggota, bill aktif, saldo, settlement.
export async function GET(
  _request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;
  const room = await findRoomByCode(code);

  if (!room) {
    return apiError("Room tidak ditemukan. Periksa kembali kode room.", 404);
  }

  return NextResponse.json({ message: "Detail room.", room: toRoomSummary(room) });
}
