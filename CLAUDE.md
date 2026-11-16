# Project: project-paronan — Split Bill App

## Sumber kebenaran
- `PRD.md` adalah acuan resmi. Jangan menambah/mengubah fitur di luar scope v1 tanpa instruksi eksplisit.

## Stack
- Next.js (App Router) + TypeScript strict
- SQLite + Prisma (schema di `prisma/schema.prisma`, DB lokal `prisma/dev.db`, **gitignored**)
- Satu proses Node, tanpa layanan tambahan (tanpa Redis/Docker)

## Perintah
- `npm run dev` — dev server di :3000
- `npm run build` — build produksi; wajib lolos tanpa error TypeScript
- `npx prisma migrate dev --name <nama>` — migrasi skema
- `npm test` — unit test (jika sudah ada)

## Standar kode
- TypeScript strict; hindari `any`
- Uang = integer rupiah, tanpa desimal. Format tampilan: `Rp 12.500` (Intl.NumberFormat id-ID)
- Semua teks UI: Bahasa Indonesia
- Room code: nanoid, tidak mudah ditebak; kode = kunci akses room
- Expense memakai soft delete (kolom deletedAt), bukan hard delete
- Perhitungan split dan settlement murni fungsi TypeScript teruji unit test (dipisah dari layer UI/API)

## Aturan kerja
- Satu tugas = satu commit (conventional commits), lalu `git push`
- Commit hanya file yang relevan dengan tugas, jangan `git add -A` membawa fileGenerated build/`.next/`
- Jangan commit: `.env*`, `prisma/dev.db`, `node_modules`, `.next`
- Setelah menulis/mengedit kode, jalankan `npm run build` untuk memverifikasi
