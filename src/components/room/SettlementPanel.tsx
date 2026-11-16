import type { RoomSummary } from "@/src/lib/api";
import { formatRupiah } from "@/src/lib/format";
import { cardClass } from "@/src/components/styles";

interface SettlementPanelProps {
  room: RoomSummary;
}

/** Daftar transfer minimal untuk melunasi semua saldo. */
export function SettlementPanel({ room }: SettlementPanelProps) {
  const nameById = new Map(
    room.members.map((member) => [member.id, member.name]),
  );

  return (
    <section className={cardClass} aria-labelledby="settlement-title">
      <div className="mb-4">
        <h2
          id="settlement-title"
          className="text-lg font-semibold text-zinc-900"
        >
          Siapa Transfer ke Siapa
        </h2>
        <p className="mt-1 text-sm text-zinc-600">
          Transfer seminimal mungkin supaya semua lunas.
        </p>
      </div>

      {room.settlement.length === 0 ? (
        <div className="rounded-xl border border-dashed border-emerald-300 bg-emerald-50 px-4 py-6 text-center">
          <p className="text-sm font-medium text-emerald-700">
            Semua sudah lunas. Tidak ada yang perlu transfer. 🎉
          </p>
        </div>
      ) : (
        <ol className="space-y-2.5">
          {room.settlement.map((transfer, index) => (
            <li
              key={`${transfer.fromMemberId}-${transfer.toMemberId}-${index}`}
              className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm"
            >
              <span className="font-semibold text-zinc-900">
                {nameById.get(transfer.fromMemberId) ?? "Anggota"}
              </span>
              <span className="text-zinc-500">harus transfer</span>
              <span className="font-bold text-indigo-700 tabular-nums">
                {formatRupiah(transfer.amount)}
              </span>
              <span className="text-zinc-500">ke</span>
              <span className="font-semibold text-zinc-900">
                {nameById.get(transfer.toMemberId) ?? "Anggota"}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
