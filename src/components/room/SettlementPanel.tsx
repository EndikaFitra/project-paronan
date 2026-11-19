import type { RoomSummary } from "@/src/lib/api";
import { formatRupiah } from "@/src/lib/format";
import { ChalkArrow } from "@/src/components/icons";
import { ChalkCircle } from "@/src/components/chalk";

interface SettlementPanelProps {
  room: RoomSummary;
  /** ID anggota yang sedang melihat halaman; null bila belum bergabung. */
  currentMemberId?: string | null;
}

/** Lingkaran kapur "Lunas". */
function LunasMark() {
  return (
    <div className="relative inline-block px-6 py-2">
      <span className="font-chalk text-3xl font-bold text-chalk">
        Lunas semua
      </span>
      <ChalkCircle className="inset-0" />
    </div>
  );
}

/** Catatan kapur kecil: apa yang harus dilakukan pemirsa. */
function ViewerNote({
  room,
  currentMemberId,
}: {
  room: RoomSummary;
  currentMemberId: string;
}) {
  const outgoing = room.settlement.filter(
    (transfer) => transfer.fromMemberId === currentMemberId,
  );
  const nameById = new Map(
    room.members.map((member) => [member.id, member.name]),
  );
  const balance = room.balances[currentMemberId] ?? 0;

  return (
    <div className="mb-4 space-y-1 rounded-lg border border-chalk/20 bg-board-deep px-4 py-3 text-sm text-chalk-dim">
      {outgoing.length > 0 ? (
        outgoing.map((transfer, index) => (
          <p key={index} className="flex items-center gap-1.5 text-chalk">
            <span>Kamu</span>
            <ChalkArrow className="h-4 w-9 shrink-0 text-chalk-yellow" />
            <span className="min-w-0 break-words font-semibold">
              {nameById.get(transfer.toMemberId) ?? "Anggota"}
            </span>
            <span className="tnum ml-auto shrink-0 font-bold">
              {formatRupiah(transfer.amount)}
            </span>
          </p>
        ))
      ) : balance > 0 ? (
        <p className="text-chalk">
          Kamu menerima{" "}
          <span className="tnum font-bold">{formatRupiah(balance)}</span>.
        </p>
      ) : (
        <p className="text-chalk">Kamu tidak perlu transfer.</p>
      )}
    </div>
  );
}

/** Daftar transfer minimal untuk melunasi semua saldo. */
export function SettlementPanel({
  room,
  currentMemberId = null,
}: SettlementPanelProps) {
  const nameById = new Map(
    room.members.map((member) => [member.id, member.name]),
  );

  return (
    <section
      className="rounded-2xl border border-chalk/25 bg-board-deep/60 p-5 sm:p-6"
      aria-labelledby="settlement-title"
    >
      <div className="mb-5">
        <h2 id="settlement-title" className="font-chalk text-2xl text-chalk">
          Siapa Transfer ke Siapa
        </h2>
        <p className="mt-1 text-sm text-chalk-dim">
          Transfer seminimal mungkin supaya semua lunas.
        </p>
      </div>

      {currentMemberId ? (
        <ViewerNote room={room} currentMemberId={currentMemberId} />
      ) : null}

      {room.settlement.length === 0 ? (
        <div className="flex justify-center rounded-xl border-2 border-dashed border-chalk/30 px-4 py-6 text-center">
          <div>
            <LunasMark />
            <p className="mt-2 text-sm text-chalk-dim">
              Tidak ada yang perlu transfer.
            </p>
          </div>
        </div>
      ) : (
        <ol className="space-y-3">
          {room.settlement.map((transfer, index) => (
            <li
              key={`${transfer.fromMemberId}-${transfer.toMemberId}-${index}`}
              className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-chalk/20 bg-board-deep px-4 py-3.5 text-sm text-chalk"
            >
              <span className="min-w-0 break-words font-semibold text-chalk">
                {nameById.get(transfer.fromMemberId) ?? "Anggota"}
              </span>
              <ChalkArrow className="h-6 w-14 shrink-0 text-chalk-yellow" />
              <span className="min-w-0 break-words font-semibold text-chalk">
                {nameById.get(transfer.toMemberId) ?? "Anggota"}
              </span>
              <span className="tnum ml-auto shrink-0 text-lg font-bold text-chalk-yellow">
                {formatRupiah(transfer.amount)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
