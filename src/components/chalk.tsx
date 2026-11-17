"use client";

/**
 * Primitif chalk: garis bawah tangan dan lingkaran tangan,
 * digambar dengan pathLength SVG (stroke-dashoffset) sebagai
 * gerak tulis-kapur bertanda tangan. Konten sudah terlihat
 * meski animasi dimatikan.
 *
 * Pemanggil memberi kotak gambar lewat className — biasanya
 * `inset-0`, sehingga lingkaran mengikuti ukuran baris teksnya.
 * Jangan andalkan `inset` negatif untuk melebarkan bentuk: svg
 * ini memakai `h-full w-full`, jadi ukurannya selalu kotak induk.
 * Untuk lingkaran yang melewati tepi teks, beri padding pada
 * induk atau margin negatif pada svg-nya.
 */

interface ChalkStrokeProps {
  className?: string;
}

/** Garis bawah bergelombang seperti goresan kapur. */
export function ChalkUnderline({ className = "" }: ChalkStrokeProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 300 14"
      preserveAspectRatio="none"
      className={`mt-2 h-3.5 w-full max-w-md text-chalk-yellow ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={3.5}
      strokeLinecap="round"
    >
      <path
        className="chalk-draw"
        pathLength={1}
        d="M4 9 C 40 4, 70 12, 110 8 S 190 4, 230 9 S 280 12, 296 7"
      />
    </svg>
  );
}

/** Lingkaran tangan untuk angka total. */
export function ChalkCircle({ className = "" }: ChalkStrokeProps) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 240 50"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute h-full w-full text-chalk-yellow ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.8}
      strokeLinecap="round"
    >
      {/* viewBox 240×50 sudah selebar bentuk tujuannya (baris total ±6:1),
          jadi regangan ke kotak asli hanya ±10% — goresan atas, bawah, dan
          samping tetap ±2,5–3,1px tanpa perlu vector-effect.
          vector-effect="non-scaling-stroke" sengaja TIDAK dipakai: bersama
          pathLength={1} Chromium menghitung pola dash di ruang layar
          sedangkan pathLength di ruang pengguna, sehingga hanya ~65%
          busur yang tergambar. */}
      <path
        className="chalk-draw"
        pathLength={1}
        d="M120 2.5 C 50 1.7, 12 11.7, 14 25 C 16 38.3, 60 47.5, 124 47.1 C 190 46.7, 228 37.5, 226 24.2 C 224 11.7, 184 2.5, 116 2.9"
      />
    </svg>
  );
}
