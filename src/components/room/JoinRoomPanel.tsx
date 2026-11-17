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

/** Form bergabung ke room dari halaman room (kode sudah diketahui). */
export function JoinRoomPanel({ code }: { code: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    setError(null);
    if (!name.trim()) {
      setError("Nama kamu wajib diisi.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(
        `/api/rooms/${encodeURIComponent(code)}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim() }),
        },
      );
      const result = await readApiResponse(response);

      if (!result.ok) {
        setError(result.message ?? "Gagal bergabung ke room. Coba lagi.");
        return;
      }

      router.refresh();
    } catch {
      setError(NETWORK_ERROR_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="gabung-room-panel"
      className="scroll-mt-6 rounded-2xl border-2 border-dashed border-chalk-yellow/70 bg-chalk-yellow/10 p-5 sm:p-6"
      aria-labelledby="gabung-room-title"
    >
      <h2 id="gabung-room-title" className="font-chalk text-2xl text-chalk-yellow">
        Gabung ke room ini
      </h2>
      <p className="mt-1 text-sm text-chalk-dim">
        Masukkan namamu supaya teman-teman tahu kamu ikut menanggung tagihan.
      </p>

      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="flex-1">
          <label className={labelClass} htmlFor="join-room-name">
            Nama kamu
          </label>
          <input
            id="join-room-name"
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
        <button
          className={`${primaryButtonClass} sm:w-auto`}
          type="submit"
          disabled={submitting}
        >
          {submitting ? <Spinner /> : null}
          {submitting ? "Bergabung…" : "Gabung"}
        </button>
      </form>

      {error ? (
        <p className={`${errorTextClass} mt-3`} role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
