import type { RoomSummary } from "@/src/lib/api";
import { formatSignedRupiah } from "@/src/lib/format";

interface BalanceSummaryProps {
  room: RoomSummary;
  /** ID anggota yang sedang melihat halaman; null bila belum bergabung. */
  currentMemberId?: string | null;
}

/** Inisial anggota sebagai penanda baca, tanpa bentuk wadah. */
function MemberMark({ name }: { name: string }) {
  const initials = name
    .split(/\s+/)
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      aria-hidden
      className="w-6 shrink-0 font-chalk text-sm font-bold text-chalk-dim"
    >
      {initials || "?"}
    </span>
  );
}

/** Ringkasan saldo net per anggota (kuning = menerima, merah = berutang). */
export function BalanceSummary({
  room,
  currentMemberId = null,
}: BalanceSummaryProps) {
  // Baris pemirsa diangkat ke atas; urutan anggota lain tidak diubah
  // supaya papan tidak "mengocok" setiap render.
  const members = currentMemberId
    ? [
        ...room.members.filter((member) => member.id === currentMemberId),
        ...room.members.filter((member) => member.id !== currentMemberId),
      ]
    : room.members;

  return (
    <section
      className="rounded-2xl border border-chalk/25 bg-board-deep/60 p-5 sm:p-6"
      aria-labelledby="saldo-title"
    >
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <h2 id="saldo-title" className="font-chalk text-2xl text-chalk">
          Ringkasan Saldo
        </h2>
      </div>
      <p className="mb-4 text-xs text-chalk-dim">
        Kuning dan bertanda plus = menerima · merah dan bertanda minus =
        berutang
      </p>

      {members.length === 0 ? (
        <p className="text-sm text-chalk-dim">Belum ada anggota di room ini.</p>
      ) : (
        <ul className="grid gap-3">
          {members.map((member) => {
            const balance = room.balances[member.id] ?? 0;
            const isViewer = member.id === currentMemberId;
            const tone =
              balance > 0
                ? "text-chalk-yellow"
                : balance < 0
                  ? "text-chalk-red"
                  : "text-chalk-dim";

            return (
              <li
                key={member.id}
                className={`flex min-w-0 items-center justify-between gap-3 rounded-lg border bg-board-deep px-3.5 py-3 ${
                  isViewer ? "border-chalk/50" : "border-chalk/20"
                }`}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <MemberMark name={member.name} />
                  <div className="min-w-0 max-w-full">
                    <p className="truncate text-sm font-medium text-chalk">
                      {member.name}
                    </p>
                    {isViewer ? (
                      <p className="font-chalk text-xs text-chalk-dim">
                        (kamu)
                      </p>
                    ) : null}
                  </div>
                </span>
                <span className={`tnum shrink-0 text-xl font-bold ${tone}`}>
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
