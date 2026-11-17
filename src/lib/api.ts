import { NextResponse } from "next/server";

/** Bentuk error seragam: { message } dalam Bahasa Indonesia. */
export function apiError(message: string, status: number): NextResponse {
  return NextResponse.json({ message }, { status });
}

export interface RoomSummary {
  id: string;
  name: string;
  code: string;
  createdAt: string;
  members: { id: string; name: string; createdAt: string }[];
  bills: {
    id: string;
    description: string;
    amount: number;
    payerId: string;
    payerName: string;
    splitMode: "EQUALS" | "SHARES";
    createdAt: string;
    splits: { memberId: string; shares: number; amount: number }[];
  }[];
  balances: Record<string, number>;
  settlement: { fromMemberId: string; toMemberId: string; amount: number }[];
}

/** Parse body JSON; kembalikan null bila body bukan JSON objek. */
export async function readJson(
  request: Request,
): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return null;
    }
    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value > 0;
}

// Batas panjang teks tinggal di `limits.ts` (bebas `next/server`)
// sehingga aman dipakai modul yang ikut ke bundle klien.
export { MAX_NAME_LENGTH, MAX_DESCRIPTION_LENGTH } from "./limits";
