/** Kelas Tailwind yang dipakai bersama di beberapa komponen. */

/**
 * Input bergaris kapur: isi board-deep, teks kapur, placeholder dim ≥4.5:1,
 * fokus = cincin kuning kapur yang jelas.
 */
export const inputClass =
  "w-full rounded-lg border border-chalk/40 bg-board-deep px-3.5 py-2.5 text-base text-chalk outline-none transition " +
  "placeholder:text-chalk-dim " +
  "focus:border-chalk-yellow focus:ring-2 focus:ring-chalk-yellow/70 " +
  "hover:border-chalk/60 " +
  "disabled:cursor-not-allowed disabled:border-chalk/25 disabled:text-chalk-dim disabled:opacity-70";

export const labelClass =
  "mb-1.5 block text-sm font-medium text-chalk-dim uppercase tracking-wide";

/** Tombol utama: kapur kuning dengan tinta gelap. */
export const primaryButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-chalk-yellow px-5 py-2.5 text-base font-semibold text-board-deep shadow-press " +
  "transition hover:bg-[#f0d175] hover:shadow-paper active:translate-y-px active:shadow-none " +
  "disabled:cursor-not-allowed disabled:opacity-60";

/** Tombol sekunder: garis kapur. */
export const secondaryButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-chalk/50 px-4 py-2.5 text-base font-semibold text-chalk " +
  "transition hover:border-chalk hover:bg-chalk/10 active:translate-y-px " +
  "disabled:cursor-not-allowed disabled:opacity-60";

/** Tombol destruktif di permukaan kertas (nota): merah tinta gelap khas
 * dunia kertas, bukan kapur merah papan. #8f2f22 di atas #f5eeda = 6.98:1.
 */
export const paperDangerButtonClass =
  "inline-flex items-center justify-center gap-1.5 rounded-md border border-[#8f2f22]/60 bg-[#8f2f22]/5 px-2.5 py-1 text-xs font-semibold text-[#8f2f22] " +
  "transition hover:border-[#8f2f22] hover:bg-[#8f2f22] hover:text-paper active:translate-y-px " +
  "disabled:cursor-not-allowed disabled:opacity-60";

export const errorTextClass =
  "text-sm font-medium text-chalk-red [text-shadow:0_1px_2px_rgb(0_0_0/0.4)]";

/** Chip label kertas untuk rincian split pada nota. */
export const paperChipClass =
  "min-w-0 rounded-sm border border-[#5a5245]/40 bg-[#201c16]/5 px-2 py-0.5 text-xs text-paper-muted";
