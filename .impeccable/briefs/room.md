# Surface brief — Room (/r/[code])

- Mode: Operate. Tugas utama: memahami posisi uang sekarang, mencatat tagihan, dan melihat transfer minimal.
- Frekuensi: dipakai berulang selama satu acara, sering di HP dengan satu tangan, kadang di laptop saat rekap.
- State wajib: belum jadi anggota (panel gabung), tanpa tagihan (empty), saldo nol/semua lunas, error API, loading saat navigasi, tagihan panjang, nama panjang, admin vs non-admin, form tambah tagihan terbuka/tertutup, mode merata vs porsi.
- Batasan: perilaku API/form, cookie, dan teks yang sudah ada dipertahankan; nominal rupiah bulat; semua teks Bahasa Indonesia; aksesibel keyboard dan kontras AA.

## Direction contract

THESIS: Room adalah papan meja untuk acara tertentu: nama, kode, dan total ditulis di atas; saldo dan rute transfer adalah angka yang dilingkari; tagihan adalah nota kertas yang ditempel di bawahnya. Menolak dashboard kartu putih berjajar.

OWN-WORLD: Mewarisi dunia papan tulis warung dari beranda — papan hijau-hitam bertekstur, bingkai kayu, kapur putih/kuning/merah, judul tulisan tangan, angka mono presisi. Tagihan tampil sebagai potongan nota krem berperforasi dengan cap; admin ditandai cap kecil; kontrol memakai kotak bergaris kapur, bukan kartu SaaS.

STORY: Anggota langsung tahu "aku menerima/berutang berapa" dan "siapa transfer ke siapa", percaya pada angka karena asalnya terlihat di nota tagihan, lalu menambah tagihan atau membagikan link tanpa ragu.

FIRST VIEWPORT: Bingkai papan dengan header: nama room kapur besar, kode room dalam kotak kapur, jumlah anggota · tagihan, tombol salin link dan gabung. Di bawahnya satu baris total tagihan yang dilingkari tangan, lalu grid dua kolom: Ringkasan Saldo (kiri) dan Siapa Transfer ke Siapa (kanan). Aksi utama "Tambah Tagihan" adalah blok kapur kuning yang menonjol; di mobile menjadi bilah bawah yang selalu terlihat. Daftar tagihan menyusul sebagai nota-nota yang ditempel.

SIGNATURE: Saat tagihan disimpan, baris baru "ditulis" ke papan lewat stroke kapur (mask/clip + opacity, bukan fade seragam), lalu total dilingkari ulang. Semua gerak menghormati prefers-reduced-motion dan tetap menampilkan konten tanpa animasi.

FORM: Ekstensi arah grounded #4 (papan menu warung) di dalam dunia yang sama. seed:344dc5f4b83e454d

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Unresolved

- Tidak ada ilustrasi/stock; tekstur dan ikon digambar sendiri (CSS/SVG), satu keluarga stroke.
