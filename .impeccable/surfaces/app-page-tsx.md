---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/r/[code]/page.tsx"]
---

# Surface brief — Beranda (/)

- Mode: Persuade. Satu-satunya tindakan yang harus terjadi: membuat room atau bergabung ke room lewat kode.
- Audiens: kelompok 2–15 orang yang baru selesai makan/arisan/trip dan membuka link di HP atau laptop. Bahasa Indonesia santai, tanpa jargon.
- Bukti yang tersedia: mekanisme nyata (buat room, join, split, saldo, settlement minimal). Tidak ada testimoni, pelanggan, atau angka pemasaran — jangan mengarang.
- Batasan: nol registrasi; kode room = kunci akses; nominal rupiah bulat; semua teks Bahasa Indonesia; perilaku API/form yang ada tidak boleh berubah.

## Direction contract

THESIS: Rumah produk adalah satu papan tulis warung yang dipakai bersama di meja; ia menolak grid kartu SaaS putih dengan dua kartu aksi sederajat.

OWN-WORLD: Papan hijau-hitam bertekstur kapur (#16211d) berbingkai kayu hangat (#5a4130); kapur putih (#f3efe4), kapur kuning (#e6c45c) untuk uang yang diterima dan aksi utama, kapur merah (#d9776a) untuk utang; judul ditulis tangan, semua angka dalam mono presisi, label UI sans netral; garis kapur tangan, total dilingkari, nota kertas krem ditempel miring.

STORY: Pengunjung paham dalam beberapa detik bahwa ini papan patungan: buat room atau gabung, lihat contoh siapa transfer ke siapa, lalu bertindak. Tidak ada akun, tidak ada langkah tersembunyi.

FIRST VIEWPORT: Papan penuh dalam bingkai kayu. Kiri: "Split Bill" kapur besar dengan garis bawah tangan, satu kalimat, lalu dua pintu aksi sebagai blok kapur — Buat Room (isi kapur kuning) dan Gabung (garis kapur) — masing-masing langsung berisi field yang dibutuhkan, bukan tautan ke halaman lain. Kanan: nota kertas krem ditempel miring berisi contoh 3 orang, total dilingkari, dan rute transfer bergaya panah kapur; ini demonstrasi mekanisme, bukan dekorasi. Mobile: judul, nota contoh ringkas, lalu dua blok aksi bertumpuk dengan tombol selebar layar.

FORM: Arah grounded #4 dari 7 (papan menu warung / chalkboard). seed:344dc5f4b83e454d

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved

- Tidak ada aset foto/ilustrasi nyata; tekstur kapur dan kayu harus digambar sendiri (CSS/SVG), tanpa gambar stok.
