"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";

import {
  NETWORK_ERROR_MESSAGE,
  readApiResponse,
} from "@/src/lib/client-api";
import {
  errorTextClass,
  inputClass,
  labelClass,
  primaryButtonClass,
} from "@/src/components/styles";
import { Spinner } from "@/src/components/Spinner";

const MAX_NAME_LENGTH = 50;

export function CreateRoomForm() {
  const router = useRouter();
  const [roomName, setRoomName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setError(null);
    if (!roomName.trim()) {
      setError("Nama room wajib diisi.");
      return;
    }
    if (!creatorName.trim()) {
      setError("Nama kamu wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: roomName.trim(),
          creatorName: creatorName.trim(),
        }),
      });
      const result = await readApiResponse(response);

      if (!result.ok) {
        setError(result.message ?? "Gagal membuat room. Coba lagi.");
        return;
      }

      const code = result.data.code;
      if (typeof code !== "string" || !code) {
        setError("Server tidak mengembalikan kode room. Coba lagi.");
        return;
      }

      router.push(`/r/${code}`);
    } catch {
      setError(NETWORK_ERROR_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <div>
        <label className={labelClass} htmlFor="create-room-name">
          Nama room
        </label>
        <input
          id="create-room-name"
          className={inputClass}
          type="text"
          value={roomName}
          onChange={(event) => setRoomName(event.target.value)}
          placeholder="Contoh: Makan malam Sabtu"
          maxLength={MAX_NAME_LENGTH}
          autoComplete="off"
          disabled={submitting}
          required
        />
      </div>

      <div>
        <label className={labelClass} htmlFor="create-creator-name">
          Nama kamu
        </label>
        <input
          id="create-creator-name"
          className={inputClass}
          type="text"
          value={creatorName}
          onChange={(event) => setCreatorName(event.target.value)}
          placeholder="Contoh: Dika"
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
        {submitting ? "Membuat room…" : "Buat Room"}
      </button>
    </form>
  );
}
