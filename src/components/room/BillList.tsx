"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import type { RoomSummary } from "@/src/lib/api";
import {
  NETWORK_ERROR_MESSAGE,
  readApiResponse,
} from "@/src/lib/client-api";
import { formatRupiah, formatTanggal } from "@/src/lib/format";
import { errorTextClass } from "@/src/components/styles";
import { Spinner } from "@/src/components/Spinner";

interface BillListProps {
  room: RoomSummary;
  isAdmin: boolean;
}

type Bill = RoomSummary["bills"][number];

/** Daftar tagihan aktif; tombol hapus (soft delete) hanya untuk admin. */
export function BillList({ room, isAdmin }: BillListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const nameById = new Map(
    room.members.map((member) => [member.id, member.name]),
  );

  async function handleDelete(bill: Bill) {
    if (deletingId) return;

    const confirmed = window.confirm(
      `Hapus tagihan "${bill.description}" (${formatRupiah(bill.amount)})? Saldo akan dihitung ulang dan tagihan tidak bisa dikembalikan.`,
    );
    if (!confirmed) return;

    setError(null);
    setDeletingId(bill.id);
    try {
      const response = await fetch(
        `/api/rooms/${encodeURIComponent(room.code)}/expenses/${encodeURIComponent(bill.id)}`,
        { method: "DELETE" },
      );
      const result = await readApiResponse(response);

      if (!result.ok) {
        setError(result.message ?? "Gagal menghapus tagihan. Coba lagi.");
        return;
      }

      router.refresh();
    } catch {
      setError(NETWORK_ERROR_MESSAGE);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section aria-labelledby="tagihan-title">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 id="tagihan-title" className="text-lg font-semibold text-zinc-900">
          Daftar Tagihan
        </h2>
        {room.bills.length > 0 ? (
          <span className="text-sm text-zinc-500">
            Total {formatRupiah(room.bills.reduce((sum, bill) => sum + bill.amount, 0))}
          </span>
        ) : null}
      </div>

      {error ? (
        <p className={`${errorTextClass} mb-3`} role="alert">
          {error}
        </p>
      ) : null}

      {room.bills.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-5 py-10 text-center">
          <p className="text-base font-medium text-zinc-800">
            Belum ada tagihan.
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Catat tagihan pertama!
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {room.bills.map((bill) => (
            <li
              key={bill.id}
              className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-zinc-900">
                    {bill.description}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-500">
                    Dibayar oleh{" "}
                    <span className="font-medium text-zinc-700">
                      {bill.payerName}
                    </span>{" "}
                    · {formatTanggal(bill.createdAt)} ·{" "}
                    {bill.splitMode === "EQUALS" ? "Merata" : "Sesuai porsi"}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  <span className="text-base font-bold text-zinc-900 tabular-nums">
                    {formatRupiah(bill.amount)}
                  </span>
                  {isAdmin ? (
                    <button
                      type="button"
                      onClick={() => handleDelete(bill)}
                      disabled={deletingId !== null}
                      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {deletingId === bill.id ? <Spinner className="h-3 w-3" /> : null}
                      {deletingId === bill.id ? "Menghapus…" : "Hapus"}
                    </button>
                  ) : null}
                </div>
              </div>

              <ul className="mt-3 flex flex-wrap gap-1.5">
                {bill.splits.map((split) => (
                  <li
                    key={split.memberId}
                    className="rounded-lg bg-zinc-100 px-2 py-1 text-xs text-zinc-700"
                  >
                    {nameById.get(split.memberId) ?? "Anggota"}{" "}
                    <span className="font-semibold tabular-nums">
                      {formatRupiah(split.amount)}
                    </span>
                    {bill.splitMode === "SHARES" ? (
                      <span className="text-zinc-500"> ({split.shares} porsi)</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
