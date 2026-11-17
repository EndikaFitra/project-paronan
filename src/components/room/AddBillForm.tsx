"use client";

import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import type { FormEvent } from "react";

import type { RoomSummary } from "@/src/lib/api";
import {
  NETWORK_ERROR_MESSAGE,
  readApiResponse,
} from "@/src/lib/client-api";
import { formatRupiahInput, parseRupiahInput } from "@/src/lib/format";
import {
  errorTextClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/src/components/styles";
import { Spinner } from "@/src/components/Spinner";
import { PlusIcon } from "@/src/components/icons";

const MAX_DESCRIPTION_LENGTH = 100;

type SplitMode = "EQUALS" | "SHARES";

interface AddBillFormProps {
  room: RoomSummary;
  /** Anggota yang sedang memakai browser ini (dari cookie), bila ada. */
  currentMemberId: string | null;
}

/** Form catat tagihan baru — collapsible, dengan mode split merata/porsi. */
export function AddBillForm({ room, currentMemberId }: AddBillFormProps) {
  const router = useRouter();
  const fieldId = useId();
  const memberIds = room.members.map((member) => member.id);
  const defaultPayerId =
    currentMemberId && memberIds.includes(currentMemberId)
      ? currentMemberId
      : (memberIds[0] ?? "");

  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amountDigits, setAmountDigits] = useState("");
  const [payerId, setPayerId] = useState(defaultPayerId);
  const [mode, setMode] = useState<SplitMode>("EQUALS");
  const [selected, setSelected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(memberIds.map((id) => [id, true])),
  );
  const [shares, setShares] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Anggota baru yang masuk saat form terbuka otomatis ikut terpilih.
  const isSelected = (memberId: string) => selected[memberId] ?? true;

  const participants = useMemo(
    () => room.members.filter((member) => selected[member.id] ?? true),
    [room.members, selected],
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

  function resetForm() {
    setDescription("");
    setAmountDigits("");
    setMode("EQUALS");
    setSelected(Object.fromEntries(memberIds.map((id) => [id, true])));
    setShares({});
    setError(null);
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
      const response = await fetch(
        `/api/rooms/${encodeURIComponent(room.code)}/expenses`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: description.trim(),
            amount,
            payerId,
            splitMode: mode,
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
        setError(result.message ?? "Gagal menyimpan tagihan. Coba lagi.");
        return;
      }

      resetForm();
      setOpen(false);
      router.refresh();
    } catch {
      setError(NETWORK_ERROR_MESSAGE);
    } finally {
      setSubmitting(false);
    }
  }

  if (room.members.length === 0) return null;

  return (
    <section
      className="rounded-2xl border-2 border-chalk-yellow bg-chalk-yellow/10"
      aria-labelledby="tambah-tagihan-title"
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left sm:px-6"
        aria-expanded={open}
        aria-controls={`${fieldId}-panel`}
      >
        <span>
          <span
            id="tambah-tagihan-title"
            className="block font-chalk text-2xl text-chalk-yellow"
          >
            Tambah Tagihan
          </span>
          <span className="mt-0.5 block text-sm text-chalk-dim">
            Catat pengeluaran yang perlu dibagi bareng.
          </span>
        </span>
        <span
          aria-hidden
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-chalk-yellow text-chalk-yellow transition-transform ${
            open ? "rotate-45" : ""
          }`}
        >
          <PlusIcon />
        </span>
      </button>

      {open ? (
        <form
          id={`${fieldId}-panel`}
          className="chalk-dust relative space-y-5 border-t-2 border-chalk-yellow/40 px-5 py-5 sm:px-6"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass} htmlFor={`${fieldId}-description`}>
                Deskripsi
              </label>
              <input
                id={`${fieldId}-description`}
                className={inputClass}
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
              <label className={labelClass} htmlFor={`${fieldId}-amount`}>
                Nominal (rupiah)
              </label>
              <div className="relative">
                <span className="tnum pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-medium text-chalk-dim">
                  Rp
                </span>
                <input
                  id={`${fieldId}-amount`}
                  className={`${inputClass} tnum pl-11 pr-3.5 text-right text-base`}
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
              <label className={labelClass} htmlFor={`${fieldId}-payer`}>
                Pembayar
              </label>
              <select
                id={`${fieldId}-payer`}
                className={`${inputClass} appearance-none`}
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
              <legend className={labelClass}>Mode split</legend>
              <div className="grid grid-cols-2 gap-1.5 rounded-lg border-2 border-chalk/40 bg-board-deep p-1.5">
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
                      className={`min-h-10 rounded-md px-3 py-2 font-chalk text-base transition disabled:cursor-not-allowed disabled:opacity-60 ${
                        active
                          ? "bg-chalk-yellow font-bold text-board-deep"
                          : "text-chalk-dim hover:text-chalk"
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
              <span className="text-sm font-medium text-chalk-dim">
                Peserta yang ikut menanggung
              </span>
              <span className="tnum text-xs text-chalk-faint">
                {participants.length} dari {room.members.length} anggota
              </span>
            </div>

            <ul className="divide-y divide-chalk/15 rounded-lg border-2 border-chalk/30 bg-board-deep">
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
                      className="h-5 w-5 shrink-0 accent-chalk-yellow disabled:opacity-70"
                    />
                    <label
                      htmlFor={checkboxId}
                      className="min-w-0 flex-1 cursor-pointer text-sm text-chalk"
                    >
                      <span className="break-words">{member.name}</span>
                      {isPayer ? (
                        <span className="ml-2 rounded-sm border border-chalk/40 bg-chalk/10 px-1.5 py-0.5 text-xs font-medium text-chalk-dim">
                          Pembayar
                        </span>
                      ) : null}
                    </label>

                    {mode === "SHARES" && checked ? (
                      <div className="flex shrink-0 items-center gap-1.5">
                        <label
                          className="text-xs text-chalk-faint"
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
                          className="tnum w-16 rounded-md border border-chalk/40 bg-board-deep px-2 py-1 text-right text-sm text-chalk outline-none focus:border-chalk-yellow focus:ring-2 focus:ring-chalk-yellow/70 disabled:opacity-70"
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
            <p className={errorTextClass} role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className={secondaryButtonClass}
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
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
              {submitting ? "Menyimpan…" : "Simpan Tagihan"}
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
}
