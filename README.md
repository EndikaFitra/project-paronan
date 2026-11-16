# project-paronan — Split Bill App

Aplikasi web untuk membagi tagihan bersama (makan bareng, arisan, trip) tanpa
registrasi. Pembuat room membagikan link/kode, anggota bergabung cukup dengan
nama, lalu setiap orang bisa melihat saldo dan siapa harus transfer ke siapa.
Spesifikasi lengkap ada di `PRD.md`, aturan kerja di `CLAUDE.md`.

## Fitur v1

- Buat room dengan nama room + nama pembuat; dapat link dan kode unik 10 karakter
- Gabung room lewat link atau kode, cukup isi nama
- Catat tagihan: deskripsi, nominal (IDR), pembayar, dan peserta
- Dua mode split: merata (`EQUALS`) atau per porsi (`SHARES`, mis. A: 2 porsi, B: 1 porsi)
- Ringkasan saldo net per anggota (positif = menerima, negatif = berutang)
- Settlement berupa daftar transfer minimal (algoritma greedy) sampai semua lunas
- Hapus tagihan secara soft delete (hanya pembuat room) — data tetap tersimpan
- Semua nominal uang berupa integer rupiah dan ditampilkan sebagai `Rp 12.500`

## Setup

Prasyarat: Node.js 20+.

```bash
npm install
cp .env.example .env
npx prisma migrate deploy
npm run build
npm start
```

Aplikasi berjalan di `http://localhost:3000`.

Catatan: `.env` berisi `DATABASE_URL="file:./dev.db"`, sehingga database SQLite
tersimpan di `prisma/dev.db` (tidak ikut di-commit). Untuk pengembangan dengan
hot reload, gunakan `npm run dev`.

## Test

```bash
npx vitest run
```

atau `npm test`. Unit test mencakup perhitungan split (merata & porsi), saldo,
settlement, format rupiah, dan pembuatan kode room.

## Stack

- Next.js (App Router) + TypeScript strict, Tailwind CSS
- SQLite + Prisma (skema di `prisma/schema.prisma`)
- Satu proses Node, tanpa layanan pendukung seperti Redis atau Docker
- Logika split/settlement berupa fungsi TypeScript murni di `src/lib/` yang
  dipisahkan dari layer UI/API agar mudah diuji
- Tanpa auth server: kode room acak difungsikan sebagai kunci akses, dan aksi
  admin dibatasi lewat token admin di cookie
