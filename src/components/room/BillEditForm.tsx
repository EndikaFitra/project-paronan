"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";

import type { RoomSummary } from "@/src/lib/api";
import {
  NETWORK_ERROR_MESSAGE,
  readApiResponse,
} from "@/src/lib/client-api";
import { formatRupiahInput } from "@/src/lib/format";
import { useBillDraft } from "@/src/lib/use-bill-draft";
import {
  paperErrorTextClass,
  paperInputClass,
  primaryButtonClass,
} from "@/src/components/styles";
import { Spinner } from "@/src/components/Spinner";

type Bill = RoomSummary["bills"][number];

interface BillEditFormProps {
  room: RoomSummary;
  bill: Bill;
  /** Dipanggil saat selesai (batal, sukses, atau gagal fokus ulang). */
  onCancel: () => void;
}

const MAX_DESCRIPTION_LENGTH = 100;

/** Label form di atas kertas: tinta redup, bukan kapur. */
const paperLabelClass =
  "mb-1.5 block text-sm font-medium text-paper-muted uppercase tracking-wide";

/** Form ubah tagihan inline di dalam nota — rasa kertas, bukan papan. */
export function BillEditForm({ room, bill, onCancel }: BillEditFormProps) {
  const router = useRouter();
  const fieldId = useId();
  const descriptionRef = useRef<HTMLInputElement>(null);

  const {
    description,
    setDescription,
    amount,
    amountDigits,
    handleAmountChange,
    payerId,
    handlePayerChange,
    mode,
    setMode,
    isSelected,
    shares,
    setShares,
    toggleParticipant,
    participants,
    validate,
    buildPayload,
  } = useBillDraft({
    members: room.members,
    defaultPayerId: bill.payerId,
    initial: {
      description: bill.description,
      amount: bill.amount,
      payerId: bill.payerId,
      splitMode: bill.splitMode,
      participants: bill.splits.map((split) => ({
        memberId: split.memberId,
        shares: split.shares,
      })),
    },
  });

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fokus langsung ke deskripsi saat form terbuka.
  useEffect(() => {
    descriptionRef.current?.focus();
  }, []);

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      event.stopPropagation();
      if (!submitting) onCancel();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      const payload = buildPayload();
      const response = await fetch(
        `/api/rooms/${encodeURIComponent(room.code)}/expenses/${encodeURIComponent(bill.id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: payload.description,
            amount: payload.amount,
            payerId: payload.payerId,
            splitMode: payload.splitMode,
            participants: participants.map((member) => member.id),
            shares: participants.map((member) => ({
              memberId: member.id,
              shares: Number(shares[member.id] ?? "1"),
            })),
          }),
        },
      );
      const result = await readApiResponse(response);

      if (!result.ok) {
        setError(result.message ?? "Gagal menyimpan perubahan. Coba lagi.");
        return;
      }

      onCancel();
      router.refresh();
    } catch {
      setError(NETWORK_ERROR_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      className="mt-2 space-y-4"
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            className={paperLabelClass}
            htmlFor={`${fieldId}-description`}
          >
            Deskripsi
          </label>
          <input
            ref={descriptionRef}
            id={`${fieldId}-description`}
            className={paperInputClass}
            type="text"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Contoh: Makan malam di Warung Pak Kumis"
            maxLength={MAX_DESCRIPTION_LENGTH}
            disabled={submitting}
            required
          />
        </div>

        <div>
          <label className={paperLabelClass} htmlFor={`${fieldId}-amount`}>
            Nominal (rupiah)
          </label>
          <div className="relative">
            <span className="tnum pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-medium text-paper-muted">
              Rp
            </span>
            <input
              id={`${fieldId}-amount`}
              className={`${paperInputClass} tnum pl-11 pr-3.5 text-right text-base`}
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={amountDigits ? formatRupiahInput(amount) : ""}
              onChange={(event) => handleAmountChange(event.target.value)}
              placeholder="0"
              disabled={submitting}
              required
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={paperLabelClass} htmlFor={`${fieldId}-payer`}>
            Pembayar
          </label>
          <select
            id={`${fieldId}-payer`}
            className={`${paperInputClass} appearance-none`}
            value={payerId}
            onChange={(event) => handlePayerChange(event.target.value)}
            disabled={submitting}
          >
            {room.members.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>
        </div>

        <fieldset>
          <legend className={paperLabelClass}>Mode split</legend>
          <div className="grid grid-cols-2 gap-1.5 rounded-lg border-2 border-[#5a5245]/50 bg-[#201c16]/5 p-1.5">
            {(
              [
                { value: "EQUALS", label: "Merata" },
                { value: "SHARES", label: "Porsi" },
              ] as const
            ).map((option) => {
              const active = mode === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setMode(option.value)}
                  disabled={submitting}
                  aria-pressed={active}
                  className={`min-h-11 rounded-md px-3 py-2 font-chalk text-base transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    active
                      ? "bg-chalk-yellow font-bold text-board-deep"
                      : "text-paper-muted hover:text-paper-ink"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <div>
        <div className="mb-1.5 flex items-baseline justify-between gap-3">
          <span className="text-sm font-medium text-paper-muted">
            Peserta yang ikut menanggung
          </span>
          <span className="tnum text-xs text-paper-muted">
            {participants.length} dari {room.members.length} anggota
          </span>
        </div>

        <ul className="divide-y divide-[#5a5245]/25 rounded-lg border-2 border-[#5a5245]/40">
          {room.members.map((member) => {
            const isPayer = member.id === payerId;
            const checked = isSelected(member.id);
            const checkboxId = `${fieldId}-member-${member.id}`;

            return (
              <li
                key={member.id}
                className="flex flex-wrap items-center gap-3 px-4 py-3"
              >
                <input
                  id={checkboxId}
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleParticipant(member.id)}
                  disabled={submitting || isPayer}
                  className="h-5 w-5 shrink-0 self-center accent-chalk-yellow disabled:opacity-70"
                />
                <label
                  htmlFor={checkboxId}
                  className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-center py-2 text-sm text-paper-ink"
                >
                  <span className="break-words">{member.name}</span>
                  {isPayer ? (
                    <span className="ml-2 rounded-sm border border-[#5a5245]/40 bg-[#201c16]/5 px-1.5 py-0.5 text-xs font-medium text-paper-muted">
                      Pembayar
                    </span>
                  ) : null}
                </label>

                {mode === "SHARES" && checked ? (
                  <div className="flex shrink-0 items-center gap-1.5">
                    <label
                      className="text-xs text-paper-muted"
                      htmlFor={`${checkboxId}-shares`}
                    >
                      Porsi
                    </label>
                    <input
                      id={`${checkboxId}-shares`}
                      type="number"
                      min={1}
                      step={1}
                      inputMode="numeric"
                      className="tnum w-16 rounded-md border border-[#5a5245]/40 bg-paper px-2 py-1 text-right text-sm text-paper-ink outline-none focus:border-paper-ink focus:ring-2 focus:ring-paper-ink/30 disabled:opacity-70"
                      value={shares[member.id] ?? "1"}
                      onChange={(event) =>
                        setShares((current) => ({
                          ...current,
                          [member.id]: event.target.value,
                        }))
                      }
                      disabled={submitting}
                    />
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      {error ? (
        <p className={paperErrorTextClass} role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#201c16]/40 px-4 py-2.5 text-base font-semibold text-paper-ink transition hover:bg-[#201c16]/10 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onCancel}
          disabled={submitting}
        >
          Batal
        </button>
        <button
          className={primaryButtonClass}
          type="submit"
          disabled={submitting}
        >
          {submitting ? <Spinner /> : null}
          {submitting ? "Menyimpan…" : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
