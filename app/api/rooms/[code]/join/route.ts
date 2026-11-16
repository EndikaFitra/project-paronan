import { NextResponse } from "next/server";

import {
  apiError,
  isNonEmptyString,
  MAX_NAME_LENGTH,
  readJson,
} from "@/src/lib/api";
import { setMemberCookie } from "@/src/lib/cookies";
import { prisma } from "@/src/lib/db";

// POST /api/rooms/[code]/join — tambah anggota baru ke room.
export async function POST(
  request: Request,
  context: { params: Promise<{ code: string }> },
) {
  const { code } = await context.params;
  const body = await readJson(request);
  if (!body) {
    return apiError("Body harus berupa JSON yang valid.", 400);
  }

  const { name } = body;
  if (!isNonEmptyString(name)) {
    return apiError("Nama anggota wajib diisi.", 400);
  }
  const trimmedName = name.trim();
  if (trimmedName.length > MAX_NAME_LENGTH) {
    return apiError(`Nama anggota maksimal ${MAX_NAME_LENGTH} karakter.`, 400);
  }

  const room = await prisma.room.findUnique({
    where: { code },
    select: { id: true },
  });
  if (!room) {
    return apiError("Room tidak ditemukan. Periksa kembali kode room.", 404);
  }

  const existing = await prisma.member.findUnique({
    where: { roomId_name: { roomId: room.id, name: trimmedName } },
  });
  if (existing) {
    return apiError("Nama sudah dipakai anggota lain di room ini.", 409);
  }

  const member = await prisma.member.create({
    data: { roomId: room.id, name: trimmedName },
  });

  await setMemberCookie(room.id, member.id);

  return NextResponse.json(
    { message: "Berhasil bergabung ke room.", memberId: member.id },
    { status: 201 },
  );
}
