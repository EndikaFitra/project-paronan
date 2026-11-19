"use client";

import { useMemo, useState } from "react";

import type { RoomSummary } from "@/src/lib/api";
import type { BillPayload } from "@/src/lib/bill-payload";

type SplitMode = "EQUALS" | "SHARES";

/** Nilai awal draf, dipakai form tambah (kosong) dan form ubah (dari nota). */
export interface BillDraftInitial {
  description: string;
  amount: number;
  payerId: string;
  splitMode: SplitMode;
  /** Peserta terpilih beserta porsinya (porsi dipakai hanya di mode SHARES). */
  participants: { memberId: string; shares: number }[];
}

export interface UseBillDraftOptions {
  members: RoomSummary["members"];
  /** Payer default saat tidak ada nilai awal (anggota aktif browser ini). */
  defaultPayerId: string;
  initial?: BillDraftInitial;
}

/**
 * State + aturan form tagihan yang dipakai bersama form tambah dan form ubah.
 * Semua pesan validasi dalam Bahasa Indonesia dan identik di kedua form.
 */
export function useBillDraft({
  members,
  defaultPayerId,
  initial,
}: UseBillDraftOptions) {
  const memberIds = members.map((member) => member.id);

  const [description, setDescription] = useState(initial?.description ?? "");
  const [amountDigits, setAmountDigits] = useState(() =>
    initial && initial.amount > 0 ? String(initial.amount) : "",
  );
  const [payerId, setPayerId] = useState(
    initial?.payerId && memberIds.includes(initial.payerId)
      ? initial.payerId
      : defaultPayerId,
  );
  const [mode, setMode] = useState<SplitMode>(initial?.splitMode ?? "EQUALS");
  const [selected, setSelected] = useState<Record<string, boolean>>(() => {
    if (!initial) {
      return Object.fromEntries(memberIds.map((id) => [id, true]));
    }
    // Bila tidak ada peserta awal sama sekali, semua ikut menanggung.
    if (initial.participants.length === 0) {
      return Object.fromEntries(memberIds.map((id) => [id, true]));
    }
    const selectedIds = new Set(
      initial.participants.map((participant) => participant.memberId),
    );
    return Object.fromEntries(
      memberIds.map((id) => [id, selectedIds.has(id)]),
    );
  });
  const [shares, setShares] = useState<Record<string, string>>(() => {
    if (!initial) return {};
    return Object.fromEntries(
      initial.participants.map((participant) => [
        participant.memberId,
        String(participant.shares),
      ]),
    );
  });

  // Anggota baru yang masuk saat form terbuka otomatis ikut terpilih.
  const isSelected = (memberId: string) => selected[memberId] ?? true;

  const participants = useMemo(
    () => members.filter((member) => selected[member.id] ?? true),
    [members, selected],
  );
  const amount = amountDigits ? Number(amountDigits) : 0;

  function handleAmountChange(value: string) {
    // Simpan hanya digit, maksimal 12 digit (sampai 999 miliar rupiah).
    const digits = value
      .replace(/\D/g, "")
      .replace(/^0+(?=\d)/, "")
      .slice(0, 12);
    setAmountDigits(digits);
  }

  function toggleParticipant(memberId: string) {
    if (memberId === payerId) return; // Pembayar wajib ikut menanggung.
    setSelected((current) => ({
      ...current,
      [memberId]: !(current[memberId] ?? true),
    }));
  }

  function handlePayerChange(nextPayerId: string) {
    setPayerId(nextPayerId);
    setSelected((current) => ({ ...current, [nextPayerId]: true }));
  }

  function reset() {
    setDescription("");
    setAmountDigits("");
    setMode("EQUALS");
    setSelected(Object.fromEntries(memberIds.map((id) => [id, true])));
    setShares({});
  }

  function validate(): string | null {
    if (!description.trim()) return "Deskripsi tagihan wajib diisi.";
    if (amount <= 0) return "Nominal tagihan harus lebih dari 0.";
    if (participants.length === 0) {
      return "Pilih minimal satu peserta yang ikut menanggung tagihan.";
    }
    if (!isSelected(payerId)) {
      return "Pembayar harus termasuk peserta yang ikut menanggung tagihan.";
    }
    if (mode === "SHARES") {
      for (const member of participants) {
        const value = Number(shares[member.id] ?? "1");
        if (!Number.isInteger(value) || value < 1) {
          return `Porsi untuk ${member.name} harus bilangan bulat minimal 1.`;
        }
      }
    }
    return null;
  }

  function buildPayload(): BillPayload {
    return {
      description: description.trim(),
      amount,
      payerId,
      splitMode: mode,
      participants: participants.map((member) => ({
        memberId: member.id,
        shares: Number(shares[member.id] ?? "1"),
      })),
    };
  }

  return {
    description,
    setDescription,
    amountDigits,
    handleAmountChange,
    amount,
    payerId,
    setPayerId,
    handlePayerChange,
    mode,
    setMode,
    isSelected,
    selected,
    shares,
    setShares,
    toggleParticipant,
    participants,
    reset,
    validate,
    buildPayload,
  };
}
