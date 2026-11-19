"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { RoomSummary } from "@/src/lib/api";
import {
  NETWORK_ERROR_MESSAGE,
  readApiResponse,
} from "@/src/lib/client-api";
import { formatRupiah, formatTanggal } from "@/src/lib/format";
import {
  errorTextClass,
  paperChipClass,
  paperDangerButtonClass,
} from "@/src/components/styles";
import { Spinner } from "@/src/components/Spinner";
import { XIcon } from "@/src/components/icons";
import { BillEditForm } from "@/src/components/room/BillEditForm";

interface BillListProps {
  room: RoomSummary;
  isAdmin: boolean;
}

type Bill = RoomSummary["bills"][number];

/** Konfirmasi hapus inline: sobekan nota kecil di dalam nota tagihan. */
function DeleteConfirm({
  bill,
  deleting,
  onConfirm,
  onCancel,
}: {
  bill: Bill;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  // Fokus pindah ke aksi konfirmasi saat slip terbuka; kembali ke pemicu
  // ditangani lewat tombol pemicu di komponen induk (lihat handleDelete).
  useEffect(() => {
    confirmButtonRef.current?.focus();
  }, []);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.stopPropagation();
      onCancel();
    }
  }

  const confirmId = `hapus-confirm-${bill.id}`;

  return (
    <div
      id={confirmId}
      className="relative -mt-1 min-w-0 rounded-t-sm border-2 border-dashed border-[#8f2f22]/50 bg-[#f0e6cd] px-4 pb-2.5 pt-3 shadow-paper"
      role="alertdialog"
      aria-modal={false}
      aria-labelledby={`${confirmId}-title`}
      aria-describedby={`${confirmId}-desc`}
      onKeyDown={handleKeyDown}
    >
      <div
        aria-hidden
        className="absolute -top-1.5 left-1/2 h-3 w-1.5 -translate-x-1/2 rounded-full bg-wood-dark"
      />
      <p
        id={`${confirmId}-title`}
        className="font-chalk text-lg text-[#201c16]"
      >
        Hapus tagihan ini?
      </p>
      <p
        id={`${confirmId}-desc`}
        className="mt-0.5 min-w-0 text-xs break-words text-[#5a5245]"
      >
        &quot;{bill.description}&quot; ({formatRupiah(bill.amount)}) — saldo
        dihitung ulang dan tagihan tidak bisa dikembalikan.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          ref={confirmButtonRef}
          type="button"
          onClick={onConfirm}
          disabled={deleting}
          className={`${paperDangerButtonClass} min-h-11 px-3`}
        >
          {deleting ? <Spinner className="h-3 w-3" /> : null}
          {deleting ? "Menghapus…" : "Ya, hapus"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={deleting}
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#201c16]/40 px-3 text-xs font-semibold text-[#201c16] transition hover:bg-[#201c16]/10 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        >
          Batal
        </button>
      </div>
    </div>
  );
}

/** Daftar tagihan aktif; tombol hapus (soft delete) hanya untuk admin. */
export function BillList({ room, isAdmin }: BillListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const deleteTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>(
    {},
  );
  const editTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>(
    {},
  );
  // Fokus dipulihkan ke pemicu "Ubah" setelah form tertutup.
  const pendingEditFocusId = useRef<string | null>(null);
  // Tombol pemicu di-unmount selama slip konfirmasi terbuka, jadi fokusnya
  // dikembalikan setelah render ulang, bukan saat state masih berubah.
  const pendingFocusId = useRef<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  // Tagihan paling baru mendapat gerak "ditulis kapur" sekali.
  const newestBillId = room.bills.at(-1)?.id ?? null;
  if (newestBillId !== lastAddedId) {
    setLastAddedId(newestBillId);
  }

  const nameById = new Map(
    room.members.map((member) => [member.id, member.name]),
  );

  // Bila nota dihapus dari daftar saat slipnya terbuka, tutup slip
  // dan kembalikan fokus ke pemicu kalau masih ada.
  useEffect(() => {
    if (
      confirmingId !== null &&
      !room.bills.some((bill) => bill.id === confirmingId)
    ) {
      setConfirmingId(null);
    }
  }, [room.bills, confirmingId]);

  function closeConfirm(billId: string) {
    pendingFocusId.current = billId;
    setConfirmingId((current) => (current === billId ? null : current));
  }

  // Setelah slip tertutup dan tombol pemicu kembali ke DOM, pulihkan fokus.
  useEffect(() => {
    const id = pendingFocusId.current;
    if (!id || confirmingId === id) return;
    const trigger = deleteTriggerRefs.current[id];
    if (trigger) {
      pendingFocusId.current = null;
      trigger.focus();
    }
  }, [confirmingId]);

  // Bila nota dihapus dari daftar saat form ubahnya terbuka, tutup form.
  useEffect(() => {
    if (
      editingId !== null &&
      !room.bills.some((bill) => bill.id === editingId)
    ) {
      setEditingId(null);
    }
  }, [room.bills, editingId]);

  // Setelah form ubah tertutup, pulihkan fokus ke pemicu "Ubah".
  useEffect(() => {
    const id = pendingEditFocusId.current;
    if (!id || editingId === id) return;
    const trigger = editTriggerRefs.current[id];
    if (trigger) {
      pendingEditFocusId.current = null;
      trigger.focus();
    }
  }, [editingId]);

  function openEdit(billId: string) {
    // Hanya satu nota yang boleh dalam mode ubah; buka ubah menutup hapus.
    setConfirmingId(null);
    setEditingId(billId);
  }

  function closeEdit(billId: string) {
    pendingEditFocusId.current = billId;
    setEditingId((current) => (current === billId ? null : current));
  }

  async function handleDelete(bill: Bill) {
    if (deletingId) return;

    setError(null);
    setDeletingId(bill.id);
    pendingFocusId.current = bill.id;
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
      setConfirmingId((current) => (current === bill.id ? null : current));
    }
  }

  return (
    <section aria-labelledby="tagihan-title">
      <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="tagihan-title" className="font-chalk text-3xl text-chalk">
          Nota di Papan
        </h2>
        {room.bills.length > 0 ? (
          <span className="tnum text-sm text-chalk-dim">
            Total{" "}
            {formatRupiah(room.bills.reduce((sum, bill) => sum + bill.amount, 0))}
          </span>
        ) : null}
      </div>

      {error ? (
        <p className={`${errorTextClass} mb-4`} role="alert">
          {error}
        </p>
      ) : null}

      {room.bills.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-chalk/30 px-5 py-10 text-center">
          <p className="font-chalk text-xl text-chalk">Belum ada tagihan.</p>
          <p className="mt-1 text-sm text-chalk-dim">
            Catat tagihan pertama!
          </p>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2">
          {room.bills.map((bill, index) => {
            const isNewest = bill.id === lastAddedId && index === room.bills.length - 1;
            const confirming = confirmingId === bill.id;
            const editing = editingId === bill.id;
            return (
              <li
                key={bill.id}
                className={`paper-grain paper-torn relative rounded-t-sm bg-paper px-4 pt-4 pb-8 text-paper-ink shadow-paper ${
                  editing ? "sm:col-span-2" : ""
                } ${index % 2 === 0 ? "-rotate-1" : "rotate-1"} ${isNewest ? "bill-write" : ""}`}
                style={{ animationDelay: isNewest ? "0.05s" : undefined }}
              >
                <div
                  aria-hidden
                  className="absolute -top-2 left-1/2 h-4 w-1.5 -translate-x-1/2 rounded-full bg-wood-dark"
                />
                {editing ? (
                  <div className="min-w-0">
                    <h3 className="font-chalk text-lg text-paper-ink">
                      Ubah tagihan
                    </h3>
                    <BillEditForm
                      room={room}
                      bill={bill}
                      onCancel={() => closeEdit(bill.id)}
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-chalk break-words text-xl leading-snug text-paper-ink">
                          {bill.description}
                        </h3>
                        <p className="mt-1 text-xs text-paper-muted">
                          Dibayar oleh{" "}
                          <span className="font-semibold text-paper-ink">
                            {bill.payerName}
                          </span>{" "}
                          · {formatTanggal(bill.createdAt)} ·{" "}
                          {bill.splitMode === "EQUALS" ? "Merata" : "Sesuai porsi"}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-2">
                        <span className="tnum text-lg font-bold text-paper-ink">
                          {formatRupiah(bill.amount)}
                        </span>
                        {isAdmin && !confirming ? (
                          <div className="flex items-center gap-2">
                            <button
                              ref={(node) => {
                                editTriggerRefs.current[bill.id] = node;
                              }}
                              type="button"
                              onClick={() => {
                                // Buka ubah menutup slip hapus lain.
                                setConfirmingId(null);
                                openEdit(bill.id);
                              }}
                              disabled={deletingId !== null}
                              className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-md border border-[#5a5245]/50 bg-[#201c16]/5 px-3 py-1 text-xs font-semibold text-paper-ink transition hover:border-paper-ink hover:bg-[#201c16]/10 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              Ubah
                            </button>
                            <button
                              ref={(node) => {
                                deleteTriggerRefs.current[bill.id] = node;
                              }}
                              type="button"
                              onClick={() => {
                                // Buka hapus menutup form ubah.
                                setEditingId(null);
                                setConfirmingId(bill.id);
                              }}
                              disabled={deletingId !== null}
                              className={`${paperDangerButtonClass} -my-3.5 min-h-11`}
                            >
                              <XIcon />
                              Hapus
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {bill.splits.map((split) => (
                        <li
                          key={split.memberId}
                          className={paperChipClass}
                        >
                          <span className="font-medium text-paper-ink">
                            {nameById.get(split.memberId) ?? "Anggota"}
                          </span>{" "}
                          <span className="tnum font-semibold text-paper-ink">
                            {formatRupiah(split.amount)}
                          </span>
                          {bill.splitMode === "SHARES" ? (
                            <span> ({split.shares} porsi)</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>

                    {confirming ? (
                      <div className="mt-3">
                        <DeleteConfirm
                          bill={bill}
                          deleting={deletingId === bill.id}
                          onConfirm={() => handleDelete(bill)}
                          onCancel={() => closeConfirm(bill.id)}
                        />
                      </div>
                    ) : null}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
