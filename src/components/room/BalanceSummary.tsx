import type { RoomSummary } from "@/src/lib/api";
import { formatSignedRupiah } from "@/src/lib/format";
import { cardClass } from "@/src/components/styles";

interface BalanceSummaryProps {
  room: RoomSummary;
}

/** Ringkasan saldo net per anggota (hijau = menerima, merah = berutang). */
export function BalanceSummary({ room }: BalanceSummaryProps) {
  const members = room.members;

  return (
    <section className={cardClass} aria-labelledby="saldo-title">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <h2 id="saldo-title" className="text-lg font-semibold text-zinc-900">
          Ringkasan Saldo
        </h2>
        <span className="text-xs text-zinc-500">
          Hijau = menerima · Merah = berutang
        </span>
      </div>

      {members.length === 0 ? (
        <p className="text-sm text-zinc-600">Belum ada anggota di room ini.</p>
      ) : (
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {members.map((member) => {
            const balance = room.balances[member.id] ?? 0;
            const tone =
              balance > 0
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : balance < 0
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-zinc-200 bg-zinc-50 text-zinc-600";

            return (
              <li
                key={member.id}
                className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${tone}`}
              >
                <span className="min-w-0 truncate text-sm font-medium">
                  {member.name}
                </span>
                <span className="shrink-0 text-sm font-bold tabular-nums">
                  {formatSignedRupiah(balance)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
