"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

import {
  NETWORK_ERROR_MESSAGE,
  readApiResponse,
} from "@/src/lib/client-api";
import { normalizeRoomCode } from "@/src/lib/room-code";
import {
  errorTextClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/src/components/styles";
import { Spinner } from "@/src/components/Spinner";

const MAX_NAME_LENGTH = 50;

/**
 * Alur gabung room dari halaman home:
 * 1. Bila kode room belum diketahui, buka halaman room untuk mengisi nama.
 * 2. Bila kode sudah valid, langsung join lewat API lalu redirect.
 */
export function JoinRoomForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setError(null);
    const normalizedCode = normalizeRoomCode(code);
    if (!normalizedCode) {
      setError("Kode room wajib diisi.");
      return;
    }
    if (!name.trim()) {
      setError("Nama kamu wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      // Validasi kode sekaligus memastikan room benar-benar ada.
      const roomResponse = await fetch(
        `/api/rooms/${encodeURIComponent(normalizedCode)}`,
        { cache: "no-store" },
      );
      const roomResult = await readApiResponse(roomResponse);
      if (!roomResult.ok) {
        setError(
          roomResult.message ?? "Room tidak ditemukan. Periksa kembali kode room.",
        );
        return;
      }

      const joinResponse = await fetch(
        `/api/rooms/${encodeURIComponent(normalizedCode)}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim() }),
        },
      );
      const joinResult = await readApiResponse(joinResponse);
      if (!joinResult.ok) {
        setError(joinResult.message ?? "Gagal bergabung ke room. Coba lagi.");
        return;
      }

      router.push(`/r/${normalizedCode}`);
    } catch {
      setError(NETWORK_ERROR_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div>
        <label className={labelClass} htmlFor="join-room-code">
          Kode room
        </label>
        <input
          id="join-room-code"
          className={`${inputClass} font-mono tracking-[0.2em] uppercase`}
          type="text"
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="KODE ROOM"
          maxLength={20}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          disabled={submitting}
          required
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="join-name">
          Nama kamu
        </label>
        <input
          id="join-name"
          className={inputClass}
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Contoh: Sari"
          maxLength={MAX_NAME_LENGTH}
          autoComplete="name"
          disabled={submitting}
          required
        />
      </div>

      {error ? (
        <p className={errorTextClass} role="alert">
          {error}
        </p>
      ) : null}

      <button
        className={`${primaryButtonClass} w-full`}
        type="submit"
        disabled={submitting}
      >
        {submitting ? <Spinner /> : null}
        {submitting ? "Bergabung…" : "Gabung Room"}
      </button>
    </form>
  );
}
