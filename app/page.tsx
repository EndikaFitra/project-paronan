import { CreateRoomForm } from "@/src/components/CreateRoomForm";
import { JoinRoomForm } from "@/src/components/JoinRoomForm";
import { cardClass } from "@/src/components/styles";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col justify-center px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700 uppercase">
          Tanpa registrasi
        </span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
          Split Bill
        </h1>
        <p className="mt-3 text-lg text-zinc-600">
          Bagi tagihan bareng, tanpa ribet. Buat room, bagikan kodenya, dan
          biarkan hitungannya beres.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <section className={cardClass} aria-labelledby="buat-room-title">
          <div className="mb-5">
            <h2
              id="buat-room-title"
              className="text-lg font-semibold text-zinc-900"
            >
              Buat Room Baru
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Kamu menjadi admin room dan bisa menghapus tagihan yang keliru.
            </p>
          </div>
          <CreateRoomForm />
        </section>

        <section className={cardClass} aria-labelledby="gabung-room-title">
          <div className="mb-5">
            <h2
              id="gabung-room-title"
              className="text-lg font-semibold text-zinc-900"
            >
              Gabung Room
            </h2>
            <p className="mt-1 text-sm text-zinc-600">
              Punya kode dari teman? Masukkan kode dan namamu di sini.
            </p>
          </div>
          <JoinRoomForm />
        </section>
      </div>

      <p className="mt-8 text-center text-sm text-zinc-500">
        Cukup bagikan link room ke teman-teman — tidak perlu bikin akun.
      </p>
    </main>
  );
}
