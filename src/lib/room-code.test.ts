import { describe, expect, it } from "vitest";

import {
  ROOM_CODE_LENGTH,
  isRoomCode,
  normalizeRoomCode,
} from "./room-code";

describe("normalizeRoomCode", () => {
  it("menjadikan input huruf kecil menjadi huruf besar", () => {
    expect(normalizeRoomCode("ab7kq2")).toBe("AB7KQ2");
  });

  it("membuang spasi dan tanda hubung hasil salin-tempel", () => {
    expect(normalizeRoomCode(" AB7K-Q2MN ")).toBe("AB7KQ2MN");
  });

  it("mengembalikan string kosong untuk input kosong", () => {
    expect(normalizeRoomCode("   ")).toBe("");
  });
});

describe("ROOM_CODE_LENGTH", () => {
  it("bernilai 10 karakter", () => {
    expect(ROOM_CODE_LENGTH).toBe(10);
  });
});

describe("isRoomCode", () => {
  it("menerima kode yang tampak seperti hasil generator", () => {
    expect(isRoomCode("AB7KQ2MN4C")).toBe(true);
  });

  it("menolak string kosong", () => {
    expect(isRoomCode("")).toBe(false);
  });

  it("menolak kode yang terlalu pendek", () => {
    expect(isRoomCode("AB7KQ2MN4")).toBe(false);
  });

  it("menolak kode yang terlalu panjang", () => {
    expect(isRoomCode("AB7KQ2MN4CX")).toBe(false);
  });

  it("menolak huruf kecil", () => {
    expect(isRoomCode("ab7kq2mn4c")).toBe(false);
  });

  it("menolak karakter ambigu 0 O 1 I L", () => {
    expect(isRoomCode("AB7KQ2MN40")).toBe(false);
    expect(isRoomCode("AB7KQ2MN4O")).toBe(false);
    expect(isRoomCode("AB7KQ2MN41")).toBe(false);
    expect(isRoomCode("AB7KQ2MN4I")).toBe(false);
    expect(isRoomCode("AB7KQ2MN4L")).toBe(false);
  });

  it("menolak tanda hubung dan spasi tanpa trimming", () => {
    expect(isRoomCode("AB7KQ2-MN4C")).toBe(false);
    expect(isRoomCode(" AB7KQ2MN4C")).toBe(false);
    expect(isRoomCode("AB7KQ2MN4C ")).toBe(false);
  });

  it("menolak input non-string", () => {
    expect(isRoomCode(null)).toBe(false);
    expect(isRoomCode(undefined)).toBe(false);
    expect(isRoomCode(123)).toBe(false);
    expect(isRoomCode({})).toBe(false);
  });
});
