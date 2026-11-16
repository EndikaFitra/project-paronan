# PRD — Split Bill App (project-paronan) v1

## 1. Latar & Tujuan
Aplikasi web untuk membagi tagihan bersama (makan bareng, arisan, trip) tanpa registrasi. Pembuat room membagikan link; anggota join dengan nama.

## 2. Pengguna & Skenario
- Kelompok kecil (2–15 orang), penggunaan sesional (per event/trip)
- Skenario utama: buat room → share link → catat bill → lihat siapa hutang ke siapa → lunasi

## 3. Fitur Wajib (v1)
- Buat room (nama room, nama pembuat) → dapat link + kode unik
- Join room via link/kode, cukup nama
- Catat bill: deskripsi, jumlah (IDR), pembayar, peserta
- Mode split: merata ATAU per-item dengan porsi (mis. A: 2 porsi, B: 1 porsi)
- Ringkasan saldo per anggota (net: +/-)
- Settlement: daftar transfer minimal (A → B Rp X) sampai semua lunas
- Tandai bill sebagai "lunas/dihapus" (soft delete), anggota bisa keluar dari room

## 4. Di Luar Scope v1
Login/registrasi, multi-currency, scan struk (OCR), notifikasi, chat, export PDF, mobile app

## 5. Requirement Teknis
- Next.js App Router + TypeScript, SQLite + Prisma, satu proses Node
- Jalur deployment: `npm run build && npm start` di VM (port 3000)
- Tanpa auth server; room code acak (unguessable) = kunci akses. Edit room dibatasi ke pembuat (admin token di cookie)
- Uang disimpan sebagai integer rupiah (tanpa desimal)
- Semua teks UI bahasa Indonesia
- Format uang: `Rp 12.500`

## 6. Acceptance Criteria v1
- Room + anggota + bill bisa dibuat via UI tanpa error
- Perhitungan split merata: pembulatan ke rupiah, selisih akumulasi dibebankan ke pembayar
- Settlement menghasilkan jumlah transfer = banyaknya anggota bermuatan minus maksimal 1 (algoritma greedy min-transfer)
- Build sukses tanpa error TypeScript; happy-path dites manual via dev server

## 7. Cara Kerja Agent
- Dikerjakan bertahap oleh Claude Code (print mode), satu tahap = satu commit + push
- Urutan: PRD+CLAUDE.md → skeleton Next.js+Prisma → model & API → UI room → UI bill → settlement → polish
