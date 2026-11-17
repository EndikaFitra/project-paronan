# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Kelompok kecil 2–15 orang — teman, keluarga, rekan kerja — yang baru saja makan bareng, patungan arisan, atau trip bersama. Pemakaian sesional per acara, sering dibuka di HP tepat setelah tagihan keluar. Satu orang berperan pembuat room (admin); anggota lain bergabung hanya dengan nama, tanpa akun.

## Product Purpose

Membagi tagihan bersama tanpa registrasi: satu orang membuat room, membagikan link/kode, semua anggota mencatat pengeluaran, lalu setiap orang melihat saldo bersih dan daftar transfer minimal sampai lunas. Sukses berarti tidak ada lagi hitung-hitungan manual di grup chat dan tidak ada yang merasa dirugikan pembulatan.

## Positioning

Tanpa akun sama sekali: kode room acak berfungsi sebagai kunci akses, dan hak admin dipegang lewat token di cookie. Perhitungan split serta settlement minimal (greedy) dikerjakan sebagai fungsi murni yang teruji, bukan estimasi visual.

## Operating Context

- Room dibuat di tengah acara, lalu link dibagikan lewat WhatsApp/chat.
- Anggota membuka link di HP, mengisi nama, dan langsung melihat posisi mereka.
- Nominal selalu rupiah bulat; tidak ada desimal maupun multi-currency.
- Seluruh teks UI berbahasa Indonesia.
- Satu proses Node + SQLite; deploy `npm run build && npm start` di VM port 3000.

## Capabilities and Constraints

Fitur v1: buat room (nama room + nama pembuat, dapat link dan kode 10 karakter); join via link/kode dengan nama; catat tagihan (deskripsi, nominal IDR, pembayar, peserta); split merata (`EQUALS`) atau per porsi (`SHARES`); ringkasan saldo net per anggota; settlement berupa transfer minimal; soft delete tagihan oleh admin.

Di luar scope v1: login/registrasi, anggota keluar room, multi-currency, OCR struk, notifikasi, chat, export PDF, aplikasi mobile native.

Batasan: uang disimpan sebagai integer rupiah dan ditampilkan `Rp 12.500`; room code tidak mudah ditebak; data tagihan yang dihapus tetap tersimpan (`deletedAt`).

## Brand Commitments

- Nama produk di UI: **Split Bill** (repositori: project-paronan).
- Bahasa Indonesia, nada santai tetapi jelas; hindari jargon teknis di UI.
- Tidak ada aset merek, logo, atau warna wajib yang ditetapkan; belum ada komitmen visual formal.

## Evidence on Hand

- `PRD.md` — sumber kebenaran fitur dan acceptance criteria v1.
- `README.md` — setup, stack, dan ringkasan fitur.
- `CLAUDE.md` — standar kode dan aturan kerja.
- Aplikasi berjalan dengan alur nyata: home, room, tagihan, saldo, settlement.
- Tidak ada testimoni, pelanggan, benchmark, atau materi pemasaran nyata; jangan mengarang klaim tersebut.

## Product Principles

1. Nol friksi masuk: kalau butuh akun, produk ini gagal.
2. Angka harus bisa dipercaya: setiap rupiah terlihat asalnya dan pembulatannya.
3. Satu layar menjawab "aku harus transfer berapa ke siapa".
4. Cepat dipakai di HP dengan satu tangan, di tempat acara berlangsung.
5. Kejelasan mengalahkan hiasan; keputusan uang tidak boleh ambigu.

## Accessibility & Inclusion

Open decision: baseline implementasi memakai target sentuh nyaman di HP, fokus keyboard terlihat, dan kontras teks AA. Standar formal belum ditetapkan pemilik produk.
