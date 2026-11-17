import { describe, expect, it } from "vitest";

import {
  LAST_ROOM_STORAGE_KEY,
  parseLastRoom,
  serializeLastRoom,
} from "./last-room";

describe("LAST_ROOM_STORAGE_KEY", () => {
  it("memakai kunci tetap paronan:last-room", () => {
    expect(LAST_ROOM_STORAGE_KEY).toBe("paronan:last-room");
  });
});

describe("serializeLastRoom", () => {
  it("menghasilkan JSON dengan hanya field code dan name", () => {
    expect(serializeLastRoom({ code: "AB7KQ2MN4C", name: "Rapat Rutin" })).toBe(
      '{"code":"AB7KQ2MN4C","name":"Rapat Rutin"}',
    );
  });

  it("menangani nama berisi tanda kutip dan unicode", () => {
    const room = { code: "AB7KQ2MN4C", name: `Rapat "Kantor" — Déjà Vu` };
    expect(parseLastRoom(serializeLastRoom(room))).toEqual({
      code: "AB7KQ2MN4C",
      name: `Rapat "Kantor" — Déjà Vu`,
    });
  });
});

describe("parseLastRoom", () => {
  it("pulang-pergi dengan hasil yang sama persis", () => {
    const parsed = parseLastRoom(
      serializeLastRoom({ code: "AB7KQ2MN4C", name: "Rapat Rutin" }),
    );
    expect(parsed).toEqual({ code: "AB7KQ2MN4C", name: "Rapat Rutin" });
  });

  it("menormalkan kode yang tersimpan dengan spasi/tanda hubung/huruf kecil", () => {
    const parsed = parseLastRoom(
      JSON.stringify({ code: " ab7k-q2mn 4c ", name: "Rapat Rutin" }),
    );
    expect(parsed).toEqual({ code: "AB7KQ2MN4C", name: "Rapat Rutin" });
  });

  it("mengembalikan null untuk input null atau string kosong", () => {
    expect(parseLastRoom(null)).toBeNull();
    expect(parseLastRoom("")).toBeNull();
  });

  it("mengembalikan null untuk JSON tidak valid", () => {
    expect(parseLastRoom('{"code":"AB7KQ2MN4C","name":"Rap')).toBeNull();
    expect(parseLastRoom("bukan json@@@")).toBeNull();
  });

  it('mengembalikan null untuk JSON "null" dan "undefined"', () => {
    expect(parseLastRoom("null")).toBeNull();
    expect(parseLastRoom("undefined")).toBeNull();
  });

  it("mengembalikan null untuk array, angka, string, dan boolean JSON", () => {
    expect(parseLastRoom('["AB7KQ2MN4C","Rapat"]')).toBeNull();
    expect(parseLastRoom("42")).toBeNull();
    expect(parseLastRoom('"teks"')).toBeNull();
    expect(parseLastRoom("true")).toBeNull();
  });

  it("mengembalikan null bila field code atau name hilang", () => {
    expect(parseLastRoom('{"name":"Rapat Rutin"}')).toBeNull();
    expect(parseLastRoom('{"code":"AB7KQ2MN4C"}')).toBeNull();
    expect(parseLastRoom("{}")).toBeNull();
  });

  it("mengembalikan null bila tipe field salah", () => {
    expect(
      parseLastRoom('{"code":123,"name":"Rapat Rutin"}'),
    ).toBeNull();
    expect(
      parseLastRoom('{"code":"AB7KQ2MN4C","name":{"x":1}}'),
    ).toBeNull();
    expect(
      parseLastRoom('{"code":null,"name":null}'),
    ).toBeNull();
  });

  it("mengembalikan null untuk nama kosong atau hanya spasi", () => {
    expect(
      parseLastRoom('{"code":"AB7KQ2MN4C","name":"   "}'),
    ).toBeNull();
    expect(parseLastRoom('{"code":"AB7KQ2MN4C","name":""}')).toBeNull();
  });

  it("mengembalikan null untuk nama melebihi 50 karakter", () => {
    expect(
      parseLastRoom(
        JSON.stringify({ code: "AB7KQ2MN4C", name: "a".repeat(51) }),
      ),
    ).toBeNull();
  });

  it("menerima nama tepat 50 karakter dan memangkas spasi di tepi", () => {
    expect(
      parseLastRoom(
        JSON.stringify({ code: "AB7KQ2MN4C", name: ` ${"a".repeat(50)} ` }),
      ),
    ).toEqual({ code: "AB7KQ2MN4C", name: "a".repeat(50) });
  });

  it("mengembalikan null untuk kode dengan panjang salah", () => {
    expect(
      parseLastRoom(
        JSON.stringify({ code: "AB7KQ2MN4", name: "Rapat Rutin" }),
      ),
    ).toBeNull();
    expect(
      parseLastRoom(
        JSON.stringify({ code: "AB7KQ2MN4CXX", name: "Rapat Rutin" }),
      ),
    ).toBeNull();
  });

  it("mengembalikan null untuk kode dengan karakter ambigu", () => {
    expect(
      parseLastRoom(
        JSON.stringify({ code: "AB7KQ2MN40", name: "Rapat Rutin" }),
      ),
    ).toBeNull();
    expect(
      parseLastRoom(
        JSON.stringify({ code: "AB7KQ2MN4L", name: "Rapat Rutin" }),
      ),
    ).toBeNull();
  });

  it("tetap mengembalikan null tanpa melempar untuk string sampah panjang", () => {
    const adversarial = "x".repeat(10000) + '{"code":"AB7KQ2MN4C"';
    expect(() => parseLastRoom(adversarial)).not.toThrow();
    expect(parseLastRoom(adversarial)).toBeNull();
  });
});
