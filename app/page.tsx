import { CreateRoomForm } from "@/src/components/CreateRoomForm";
import { JoinRoomForm } from "@/src/components/JoinRoomForm";
import { BoardFrame } from "@/src/components/BoardFrame";
import { ChalkUnderline, ChalkCircle } from "@/src/components/chalk";
import { ChalkArrow } from "@/src/components/icons";
import { LastRoomButton } from "@/src/components/LastRoomButton";

/**
 * Nota contoh — demonstrasi mekanisme dengan data sintetis
 * yang diberi label jelas sebagai contoh.
 */
function ExampleReceipt() {
  const routes: Array<{ from: string; to: string; amount: string }> = [
    { from: "Bima", to: "Sari", amount: "Rp 60.000" },
    { from: "Bima", to: "Dika", amount: "Rp 40.000" },
  ];

  return (
    <aside
      aria-labelledby="contoh-title"
      className="relative mx-auto w-full max-w-sm"
    >
      <div
        aria-hidden
        className="absolute -top-2.5 left-1/2 h-5 w-2 -translate-x-1/2 rounded-full bg-wood-dark"
      />
      <div className="paper-grain paper-torn relative -rotate-2 rounded-t-sm bg-paper px-5 pt-5 pb-7 text-paper-ink shadow-paper">
        <p
          id="contoh-title"
          className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-paper-muted"
        >
          Contoh
        </p>
        <p className="mt-1 text-center font-chalk text-xl text-paper-ink">
          Makan Warung Bu Sri
        </p>
        <p className="mt-0.5 text-center text-xs text-paper-muted">
          Bima bayar semuanya
        </p>

        <div className="my-4 border-t border-dashed border-paper-muted/50" />

        <ul className="space-y-1 text-sm">
          <li className="flex justify-between">
            <span>Sari</span>
            <span className="tnum font-medium">Rp 60.000</span>
          </li>
          <li className="flex justify-between">
            <span>Dika</span>
            <span className="tnum font-medium">Rp 40.000</span>
          </li>
          <li className="flex justify-between">
            <span>Bima</span>
            <span className="tnum font-medium">Rp 50.000</span>
          </li>
        </ul>

        <div className="my-3 border-t border-dashed border-paper-muted/50" />

        <div className="relative inline-block px-4 py-1.5">
          <span className="font-chalk text-lg text-paper-ink">
            Total <span className="tnum font-semibold">Rp 150.000</span>
          </span>
          <ChalkCircle className="inset-0" />
        </div>

        <div className="my-4 border-t border-dashed border-paper-muted/50" />

        <p className="font-chalk text-base text-paper-ink">Rutenya:</p>
        <ol className="mt-2 space-y-1 text-sm">
          {routes.map((route) => (
            <li key={route.to} className="flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span className="font-semibold">{route.from}</span>
                <ChalkArrow className="h-4 w-10 text-paper-ink" />
                <span className="font-semibold">{route.to}</span>
              </span>
              <span className="tnum font-semibold">{route.amount}</span>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-xs text-paper-muted">
          Dua transfer saja — sudah lunas semua.
        </p>
      </div>
    </aside>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-6xl items-center px-3 py-6 sm:px-6 sm:py-10">
      <BoardFrame className="w-full">
        <div className="grid grid-cols-1 gap-10 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:px-12 lg:py-14">
          <section aria-labelledby="split-bill-title" className="min-w-0">
            <h1
              id="split-bill-title"
              className="font-chalk text-6xl font-bold leading-none text-chalk sm:text-7xl lg:text-8xl"
            >
              Split Bill
            </h1>
            <ChalkUnderline className="max-w-[280px] sm:max-w-sm" />
            <p className="mt-6 max-w-[38ch] text-base text-chalk-dim sm:text-lg">
              Tulis tagihan di papan ini, bagikan kodenya, dan semua orang
              langsung tahu harus transfer ke siapa.
            </p>

            <LastRoomButton />

            <div className="mt-10 grid gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-1 lg:gap-8">
              <section
                aria-labelledby="buat-room-title"
                className="rounded-xl border-2 border-chalk-yellow bg-chalk-yellow p-4 shadow-press sm:p-5"
              >
                <h2
                  id="buat-room-title"
                  className="font-chalk text-2xl text-[#201c16]"
                >
                  Buat Room
                </h2>
                <p className="mt-1 mb-4 text-sm font-medium text-[#4a4234]">
                  Kamu menjadi admin room dan bisa menghapus tagihan yang
                  keliru.
                </p>
                <CreateRoomForm filled />
              </section>

              <section
                aria-labelledby="gabung-room-title"
                className="rounded-xl border-2 border-chalk/50 p-4 sm:p-5"
              >
                <h2
                  id="gabung-room-title"
                  className="font-chalk text-2xl text-chalk"
                >
                  Gabung
                </h2>
                <p className="mt-1 mb-4 text-sm text-chalk-dim">
                  Punya kode dari teman? Masukkan kode dan namamu di sini.
                </p>
                <JoinRoomForm />
              </section>
            </div>
          </section>

          <div className="flex items-center">
            <ExampleReceipt />
          </div>
        </div>
      </BoardFrame>
    </main>
  );
}
