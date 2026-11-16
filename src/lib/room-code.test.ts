import { describe, expect, it } from "vitest";

import { normalizeRoomCode } from "./room-code";

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
