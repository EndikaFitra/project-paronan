import { NextResponse } from "next/server";

import {
  apiError,
  isNonEmptyString,
  MAX_NAME_LENGTH,
  readJson,
} from "@/src/lib/api";
import { createAdminToken } from "@/src/lib/codes";
import { setAdminCookie, setMemberCookie } from "@/src/lib/cookies";
import { prisma } from "@/src/lib/db";
import { generateUniqueRoomCode } from "@/src/lib/rooms";

// POST /api/rooms — buat room baru + member pembuat.
export async function POST(request: Request) {
  const body = await readJson(request);
  if (!body) {
    return apiError("Body harus berupa JSON yang valid.", 400);
  }

  const { name, creatorName } = body;
  if (!isNonEmptyString(name)) {
    return apiError("Nama room wajib diisi.", 400);
  }
  if (name.trim().length > MAX_NAME_LENGTH) {
    return apiError(`Nama room maksimal ${MAX_NAME_LENGTH} karakter.`, 400);
  }
  if (!isNonEmptyString(creatorName)) {
    return apiError("Nama pembuat wajib diisi.", 400);
  }
  if (creatorName.trim().length > MAX_NAME_LENGTH) {
    return apiError(`Nama pembuat maksimal ${MAX_NAME_LENGTH} karakter.`, 400);
  }

  const code = await generateUniqueRoomCode();
  const adminToken = createAdminToken();

  const room = await prisma.room.create({
    data: {
      name: name.trim(),
      code,
      adminToken,
      members: {
        create: { name: creatorName.trim() },
      },
    },
    include: { members: true },
  });

  const creator = room.members[0];
  await setAdminCookie(room.id, adminToken);
  await setMemberCookie(room.id, creator.id);

  return NextResponse.json(
    {
      message: "Room berhasil dibuat.",
      code: room.code,
      adminToken,
      memberId: creator.id,
    },
    { status: 201 },
  );
}
