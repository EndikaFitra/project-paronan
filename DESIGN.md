---
name: Split Bill
description: Papan tulis warung tempat sekelompok orang menulis, membagi, dan melunasi satu tagihan.
colors:
  board: "#16211d"
  board-deep: "#0e1714"
  chalk: "#f3efe4"
  chalk-dim: "#b9c2ba"
  chalk-faint: "#8d9a92"
  chalk-yellow: "#e6c45c"
  chalk-yellow-lift: "#f0d175"
  chalk-red: "#d9776a"
  wood: "#5a4130"
  wood-light: "#6b4d38"
  wood-mid: "#4a3425"
  wood-dark: "#3e2b1f"
  paper: "#f5eeda"
  paper-ink: "#201c16"
  paper-muted: "#5a5245"
  paper-danger: "#8f2f22"
typography:
  display:
    fontFamily: "Kalam, 'Segoe Print', 'Bradley Hand', cursive"
    fontSize: "6rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "Kalam, 'Segoe Print', 'Bradley Hand', cursive"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.15
  title:
    fontFamily: "Kalam, 'Segoe Print', 'Bradley Hand', cursive"
    fontSize: "1.875rem"
    fontWeight: 400
    lineHeight: 1.25
  body:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Figtree, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.025em"
  figure:
    fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0em"
rounded:
  note: "4px"
  control: "6px"
  action: "8px"
  block: "12px"
  panel: "16px"
  frame: "24px"
  pill: "999px"
spacing:
  tight: "6px"
  snug: "12px"
  base: "20px"
  section: "32px"
  block: "40px"
  panel: "48px"
  frame: "10px"
components:
  button-primary:
    backgroundColor: "{colors.chalk-yellow}"
    textColor: "{colors.board-deep}"
    rounded: "{rounded.action}"
    padding: "10px 20px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.chalk-yellow-lift}"
    textColor: "{colors.board-deep}"
    rounded: "{rounded.action}"
    padding: "10px 20px"
    height: "44px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.chalk}"
    rounded: "{rounded.action}"
    padding: "10px 16px"
    height: "44px"
  button-danger-paper:
    backgroundColor: "{colors.paper-danger}0d"
    textColor: "{colors.paper-danger}"
    rounded: "{rounded.control}"
    padding: "4px 10px"
    height: "44px"
  input-chalk:
    backgroundColor: "{colors.board-deep}"
    textColor: "{colors.chalk}"
    rounded: "{rounded.action}"
    padding: "10px 14px"
  input-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.action}"
    padding: "10px 14px"
  paper-note:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.note}"
    padding: "16px 16px 32px"
  action-block-filled:
    backgroundColor: "{colors.chalk-yellow}"
    textColor: "{colors.paper-ink}"
    rounded: "{rounded.block}"
    padding: "20px"
  action-block-outline:
    backgroundColor: "transparent"
    textColor: "{colors.chalk}"
    rounded: "{rounded.block}"
    padding: "20px"
  chip-paper:
    backgroundColor: "{colors.paper-ink}0d"
    textColor: "{colors.paper-muted}"
    rounded: "{rounded.note}"
    padding: "2px 8px"
---

# Design System: Split Bill

## Overview

**Creative North Star: "Papan Tulis Warung"**

Aplikasi ini bukan dasbor. Ia satu papan tulis warung yang dipakai bersama di atas meja: hijau-hitam berdebu kapur, berbingkai kayu hangat, dengan nota kertas krem ditempel miring di permukaannya. Semua yang penting ditulis dan dilingkari tangan; semua yang dihitung dicetak rapi dalam angka mono. Papan itu sendiri adalah satu-satunya benda — tidak ada grid kartu, tidak ada panel putih mengambang, tidak ada dekorasi yang tidak membawa uang.

Kepadatan mengikuti meja yang sesak tapi tertata: kelompok rapat di dalam satu baris, jarak lega antar blok. Kontras dibawa oleh material (kapur di atas batu tulis, tinta di atas kertas), bukan oleh bayangan. Gerak hanya satu: kapur yang menulis — garis bawah, lingkaran total, dan baris nota baru. Semua konten terlihat penuh tanpa animasi.

Sistem menolak tiga hal secara sadar: kartu SaaS putih sederajat dengan sudut membulat seragam, gradien teks dan kilau dekoratif, serta dialog browser asli sebagai satu-satunya permukaan asing di dalam dunia ini.

**Key Characteristics:**

- Satu papan berbingkai kayu sebagai kanvas seluruh halaman.
- Uang selalu dirender mono tabular dan sering dilingkari; teks naratif tidak pernah memakai font angka.
- Kuning = uang yang diterima dan aksi utama; merah = utang dan hapus; keduanya selalu disertai tanda atau label, tidak pernah warna saja.
- Kertas adalah material kedua: nota tagihan, contoh struk, dan sobekan konfirmasi.
- Tepi kertas sobek di bawah, bersih dan berpin kayu di atas.
- Nol gambar raster; semua tekstur digambar di CSS/SVG.

## Colors

Palet dua material — batu tulis dan kertas — dengan satu aksen kuning kapur yang selalu berarti uang masuk.

### Primary

- **Kapur Kuning Warung** (#e6c45c): satu-satunya aksen terang. Dipakai untuk aksi utama ("Buat Room", "Simpan Tagihan", "Gabung"), angka saldo positif, total yang dilingkari, dan panah rute transfer. Warnanya menandai "ini yang menguntungkanmu atau ini yang harus kamu tekan".
- **Kapur Kuning Terangkat** (#f0d175): hanya state hover dari aksen di atas; tidak pernah dipakai sebagai isi diam.

### Secondary

- **Kapur Merah Tanah Liat** (#d9776a): uang yang harus keluar dan hal yang bisa menghapus. Hanya boleh muncul di atas papan; di atas kertas ia gagal kontras dan harus diganti tinta oksida.

### Tertiary

- **Tinta Oksida Kertas** (#8f2f22): merah versi kertas. Dipakai untuk aksi hapus dan garis sobekan konfirmasi di dalam nota. Satu-satunya merah yang sah di atas krem.

### Neutral

- **Batu Tulis Hijau-Hitam** (#16211d): permukaan papan. Latar semua teks kapur.
- **Batu Tulis Dalam** (#0e1714): latar halaman di luar bingkai, isi input, dan dasar baris saldo. Lebih gelap dari papan supaya papan terbaca sebagai benda yang berdiri di depannya.
- **Kapur Putih** (#f3efe4): teks utama di papan — judul, nama, isi nota yang ditulis kapur.
- **Kapur Redup** (#b9c2ba): teks sekunder di papan — deskripsi, label, keterangan. Turunan dari warna kapur, bukan abu-abu netral.
- **Kapur Samar** (#8d9a92): teks tersier dan placeholder di papan; batas bawah keterbacaan.
- **Kayu Bingkai** (#5a4130): warna dasar bingkai dan ibu jari scrollbar.
- **Kayu Terang** (#6b4d38) dan **Kayu Tengah** (#4a3425): dua ujung gradien serat kayu — terang di atas, tengah di bawah — dan laci kapur. Mereka stop gradien, bukan warna bidang; tidak pernah dipakai sebagai isian datar.
- **Kayu Bayangan** (#3e2b1f): tepi tergelap gradien, pin nota, dan dasar laci.
- **Kertas Krem** (#f5eeda): permukaan nota dan struk contoh.
- **Tinta Kertas** (#201c16): semua teks di atas kertas; 14,6:1 terhadap krem.
- **Tinta Kertas Redup** (#5a5245): metadata nota — tanggal, pembayar, chip porsi. Tetap terlihat sekunder, tetap 6,6:1.

### Named Rules

**The Two Reds Rule.** Kapur merah hanya hidup di atas papan; merah kertas hanya hidup di atas kertas. Tidak pernah ditukar, tidak pernah dipakai bersama di satu bidang.

**The Tinted Secondary Rule.** Teks sekunder di papan diturunkan dari kapur (`chalk-dim`, `chalk-faint`), dan di atas kertas diturunkan dari tinta (`paper-muted`). Tidak ada abu-abu netral di dunia ini.

**The Money Is Yellow Rule.** Kuning menandai uang yang diterima atau aksi utama, dan hanya itu. Kalau sebuah elemen kuning tidak berarti salah satunya, warnanya salah.

## Typography

**Display Font:** Kalam (dengan Segoe Print, Bradley Hand, cursive)
**Body Font:** Figtree (dengan system-ui, sans-serif)
**Label/Mono Font:** Geist Mono (dengan ui-monospace, Menlo)

**Character:** Tiga suara yang tidak boleh bertukar peran. Kalam adalah tangan yang menulis di papan — miring, cepat, sedikit tidak rata; ia hanya untuk judul, nama blok, dan label tulisan tangan. Figtree adalah orang yang menjelaskan — netral, tenang, mudah dipindai. Geist Mono adalah mesin hitung — semua rupiah, kode room, dan jumlah anggota, selalu tabular supaya digit tidak bergeser saat angka berubah.

### Hierarchy

- **Display** (Kalam 700, 3.75rem → 4.5rem → 6rem, line-height 1): hanya judul "Split Bill" di beranda. Satu per halaman.
- **Headline** (Kalam 700, 2.25rem → 3rem, line-height 1.15): nama room di header. Terpotong dengan elipsis, tidak pernah membungkus menjadi tiga baris.
- **Title** (Kalam 400–700, 1.5rem–1.875rem, line-height 1.25): judul blok — "Buat Room", "Gabung", "Ringkasan Saldo", "Siapa Transfer ke Siapa", "Nota di Papan", judul nota.
- **Body** (Figtree 400, 1rem → 1.125rem, line-height 1.6, 38–45ch): penjelasan dan paragraf. Ukuran naik satu langkah di `sm`.
- **Label** (Figtree 500–600, 0.875rem, tracking 0.025em, uppercase): label form. Keterangan meta memakai 0.75rem tanpa uppercase.
- **Figure** (Geist Mono 500–700, 1rem–1.5rem, tabular): setiap nominal, kode, dan hitungan.

### Named Rules

**The Figures Are Mono Rule.** Setiap rupiah, kode room, dan jumlah memakai Geist Mono dengan `tabular-nums`. Kalam tidak pernah merender digit uang; Figtree tidak pernah merender nominal.

**The Chalk Hand Is Big Rule.** Tulisan tangan hanya dipakai pada ukuran judul (≥1.5rem). Kalam di ukuran label terbaca sebagai kesalahan render, bukan sebagai tulisan tangan.

## Layout

Satu papan mengisi lebar kontainer. Beranda memakai lebar maksimum 72rem; room 64rem; halaman status 48rem. Di mobile papan diberi napas 12px dari tepi; di `sm` 24px.

Bingkai kayu membungkus papan dengan padding 10px (mobile) sampai 14px (`sm`). Di dalam papan, padding 20px/32px (beranda) dan 16px/24px (room) tumbuh ke 48px/56px dan 40px/40px di `lg`.

Grid beranda: satu kolom di mobile — judul, kalimat, dua blok aksi bertumpuk selebar layar, lalu struk contoh. Di `sm` dua blok aksi berdampingan dalam dua kolom. Di `lg` papan terbelah `1.15fr / 0.85fr`: kolom tulisan dan aksi di kiri, struk contoh menggantung miring di kanan.

Grid room: satu kolom; di `lg` "Ringkasan Saldo" dan "Siapa Transfer ke Siapa" berdampingan sebagai dua kolom setara. Header room selalu satu blok penuh di atas keduanya.

Ritme vertikal: `space-y-8` antar blok besar di room, `gap-5` antar nota, `gap-3` antar baris saldo, `gap-1.5` di dalam kelompok rapat. Jarak di atas judul selalu lebih besar daripada di bawahnya. Nomor baris uang memakai lebar tetap supaya tanda plus dan minus tidak menggeser angka.

Bilah "Tambah Tagihan" menempel di bawah layar hanya di bawah `lg`; konten papan diberi padding bawah 7rem supaya nota terakhir tidak pernah tertutup.

## Elevation & Depth

Sistem ini memakai bayangan fisik, bukan bayangan dekoratif: benda-benda di dunia ini punya berat. Papan melempar bayangan ke dinding di belakangnya (offset ke bawah, blur lebar). Bingkai kayu punya bevel — tepi atas menangkap cahaya, tepi bawah lebih gelap — dan laci kapur kecil menjorok di bawahnya. Nota kertas menempel dengan bayangan pendek dan tajam karena ia ditekan ke papan, bukan melayang.

Tidak ada halo beroffset nol, tidak ada glow berwarna. Kalau sebuah bayangan tidak bisa dijelaskan sebagai "benda ini lebih dekat ke mata", bayangan itu dihapus.

### Shadow Vocabulary

- **Papan ke dinding** (`box-shadow: 0 24px 48px -12px rgb(0 0 0 / 0.65), 0 8px 16px -8px rgb(0 0 0 / 0.5)`): hanya di bingkai papan. Offset besar, blur besar, tidak pernah simetris.
- **Nota di papan** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.3), 0 10px 20px -8px rgb(0 0 0 / 0.5)`): nota kertas dan blok aksi terisi. Kontak tajam dekat benda, sebaran lembut di bawah.
- **Tombol ditekan** (`box-shadow: 0 3px 10px -2px rgb(0 0 0 / 0.45)`): state diam tombol utama; hilang saat `active` dan tombol turun 1px.
- **Bevel bingkai** (`box-shadow: inset 0 2px 3px rgb(243 239 228 / 0.14), inset 0 -3px 5px rgb(0 0 0 / 0.55)`): pertemuan kayu dan batu tulis.
- **Ceruk papan** (`box-shadow: inset 0 2px 10px rgb(0 0 0 / 0.55)`): tepi dalam permukaan tulis.

### Named Rules

**The Physical Board Rule.** Setiap bayangan harus punya offset dan blur, dan harus bisa dijelaskan sebagai benda yang lebih dekat ke mata. Halo berwarna beroffset nol bukan kedalaman — itu dekorasi, dan dihapus.

**The Pin Rule.** Kertas tidak pernah melayang. Nota selalu punya pin kayu di tepi atas dan bayangan kontak pendek.

**The Gradient Stop Rule.** Kayu tidak pernah berupa satu warna datar: setiap permukaan kayu adalah gradien tiga stop (`wood-light` → `wood` → `wood-dark` atau `wood-light` → `wood-mid` → kayu lebih gelap). Satu warna kayu datar membaca sebagai plastik cokelat.

## Shapes

Bentuk dasarnya persegi panjang dengan sudut kecil dan tidak seragam, karena setiap benda punya asal: bingkai kayu membulat 24px seperti potongan papan jadi, papan di dalamnya 16px, panel dan blok aksi 12–16px, tombol dan input 8px, tombol kecil di dalam kertas 6px, chip dan tepi nota 4px. Inisial anggota sengaja tidak punya bentuk wadah sama sekali — hanya teks Kalam di slot selebar 24px, supaya tidak ada cincin yang bersaing dengan judul di atasnya.

Garis lebih sering dipakai daripada isian: input adalah kotak bergaris kapur di atas batu tulis gelap, tombol sekunder adalah garis kapur tanpa isi, panel saldo adalah kotak bergaris tipis di dalam papan. Isian penuh hanya untuk dua hal — tombol utama kuning dan satu blok aksi "Buat Room" — supaya isian berarti keputusan, bukan gaya.

Kertas punya tepi bawah sobek (mask SVG bergerigi) dan tepi atas bersih yang dipin. Ia tidak pernah punya sudut membulat besar; ia sobekan, bukan kartu. Hitam murni (`#000`) hanya boleh muncul sebagai isian mask — ia saluran alfa, bukan warna yang terlihat.

### Named Rules

**The Outline First Rule.** Di papan, bentuk default adalah garis kapur di atas batu tulis. Isian penuh menandai aksi atau uang, tidak pernah menandai wadah biasa.

**The Torn Bottom Rule.** Kertas hanya disobek di tepi bawah. Tepi atas selalu bersih karena di sana ada pin; sobekan di atas akan membaca sebagai kertas rusak, bukan kertas ditempel.

**The Wide viewBox Rule.** Goresan kapur yang meregang mengikuti baris teks (lingkaran total, lingkaran "Lunas semua") memakai `viewBox` yang sudah selebar bentuk tujuannya — 240×50 untuk baris ±6:1 — plus `h-full w-full` pada `<svg>`. Dua jebakan yang sudah terbukti: `inset-0` tanpa tinggi eksplisit membuat `<svg viewBox>` bersudut 1:1 menyelesaikan tinggi dari lebarnya (lingkaran 266×266 menelan panel di bawahnya), dan `vector-effect="non-scaling-stroke"` yang digabung `pathLength={1}` membuat Chromium menghitung pola dash di ruang layar sementara `pathLength` di ruang pengguna, sehingga hanya ±65% busur yang tergambar. Lebih baik `viewBox` yang tepat daripada dua tambalan itu.

## Components

### Buttons

- **Shape:** persegi panjang bergaris, radius 8px; tinggi minimum 44px di semua varian.
- **Primary:** isi kapur kuning, teks batu tulis dalam, padding 10px/20px, teks 1rem semibold. Selalu menjadi satu-satunya tombol terisi di bloknya.
- **Hover / Focus:** hover mengangkat kuning ke `chalk-yellow-lift` dan menambah bayangan; `active` menurunkan tombol 1px dan membuang bayangan. Fokus keyboard memakai cincin 2px kapur kuning dengan offset 2px, di luar garis komponen supaya tetap terlihat di atas isian kuning.
- **Secondary:** garis kapur 50% tanpa isi, teks kapur; hover menaikkan garis ke kapur penuh dan menambahkan lapisan kapur 10%.
- **Destructive:** dua rasa. Di papan memakai kapur merah; di atas nota memakai tinta oksida dengan isian 5% dan garis 60%, yang berbalik menjadi isian penuh saat hover.

### Chips

- **Style:** label kertas kecil — garis tinta 40%, isian tinta 5%, radius 2px, teks 0.75rem `paper-muted` dengan nama dan nominal ditebalkan ke `paper-ink`.
- **State:** statis; chip porsi menambahkan "(n porsi)" dalam mono. Tidak ada chip yang bisa ditekan — chip adalah catatan, bukan filter.

### Cards / Containers

- **Corner Style:** panel papan 16px, blok aksi 12px, nota hanya 2px di tepi atas.
- **Background:** panel papan memakai `board-deep` 60%; blok aksi "Gabung" transparan bergaris kapur; blok aksi "Buat Room" isi kuning penuh.
- **Shadow Strategy:** lihat Elevation & Depth. Panel di dalam papan tidak berbayang; hanya papan dan kertas yang berbayang.
- **Border:** 1px kapur 25% untuk panel, 2px kapur 50% untuk blok aksi sekunder, 2px kuning untuk fokus blok tagihan.
- **Internal Padding:** 20–24px panel, 16–20px blok aksi, 16px nota.

### Inputs / Fields

- **Style:** dua rasa. Di papan: isi `board-deep`, garis kapur 40%, teks kapur, placeholder `chalk-dim`, radius 8px. Di dalam blok kuning: isi kertas krem, garis tinta 40%, teks tinta, placeholder `paper-muted` — input menjadi nota kecil di atas bidang kuning.
- **Focus:** garis pindah ke kuning (di papan) atau tinta (di kertas) plus cincin 2px senada 50–70%.
- **Error / Disabled:** error adalah teks kapur merah di bawah form dengan `role="alert"`, tidak pernah hanya warna garis. Disabled menurunkan opasitas dan meredupkan garis, tapi teks tetap ≥4,5:1.
- **Checkbox:** kotak 20px dengan aksen kuning; seluruh baris adalah label yang bisa diklik sehingga target sentuh tetap ≥44px.

### Navigation

- **Style:** satu tautan "Beranda" di atas nama room — teks 0.875rem `chalk-dim` bergaris bawah kapur samar, kotak sentuh 44px walau teks tetap kecil. Hover menaikkan teks dan garis ke kapur penuh.
- **Aksi header:** "Gabung" (isi kuning, hanya untuk non-anggota) dan "Salin link" (garis kapur) berjajar; konfirmasi salin diumumkan lewat `aria-live`, bukan toast.
- **Mobile:** tidak ada menu tersembunyi. Aksi utama pindah ke bilah bawah tetap.

### Board Frame (signature)

Bingkai kayu bertekstur 240×120 noise, radius 24px, padding 10–14px. Tiga lapis kedalaman: bayangan lempar ke dinding, bevel dalam di pertemuan kayu dan papan, dan laci kapur tipis yang menjorok 10px di bawah dengan gradien kayu gelap. Papan di dalamnya memakai noise kapur, latar `board`, radius 16px, dan ceruk dalam 60px. Bingkai adalah satu-satunya elemen halaman yang boleh berbayang besar.

### Paper Note (signature)

Nota tagihan: kertas krem bertekstur fiber, mask sobek di tepi bawah setinggi 12px, radius 2px di atas, dipin kayu 6×16px di tengah tepi atas, dimiringkan ±1° bergantian kiri-kanan. Isi: judul tangan, metadata redup, nominal mono tebal di kanan atas, chip porsi, dan (untuk admin) aksi hapus kecil. Nota terbaru menulis dirinya lewat wipe `clip-path` dari kiri; nota lain diam.

### Inline Delete Confirm (signature)

Sobekan nota kedua yang muncul di dalam nota, bukan overlay: garis putus-putus oksida, isian krem lebih gelap, pin kecil, teks tangan "Hapus tagihan ini?" plus kalimat yang menyebut deskripsi dan nominal. `role="alertdialog"` dengan `aria-modal="false"`, label dan deskripsi terikat ke id lokal. Fokus pindah ke "Ya, hapus" saat terbuka; Escape membatalkan; fokus kembali ke tombol "Hapus" setelah slip tertutup. Tidak ada focus trap karena tidak ada lapisan layar penuh.

### Sticky Add-Bill Bar (mobile)

Bilah kapsul kuning selebar kontainer di bawah layar (hanya <`lg`), tinggi minimum 48px, teks batu tulis, dengan padding aman `env(safe-area-inset-bottom)`. Ia membuka panel tagihan dan menggulir ke sana. Papan selalu diberi padding bawah yang cukup sehingga nota terakhir tidak pernah berada di bawahnya.

## Do's and Don'ts

### Do:

- **Do** render setiap nominal rupiah, kode room, dan hitungan dalam Geist Mono tabular — tanda plus/minus tidak boleh menggeser digit.
- **Do** turunkan teks sekunder dari materialnya: `chalk-dim`/`chalk-faint` di papan, `paper-muted` di kertas.
- **Do** lingkari angka total dengan goresan tangan yang digambar ulang saat nilainya berubah.
- **Do** pakai dua material saja — batu tulis dan kertas — dan jelaskan setiap elemen sebagai salah satunya.
- **Do** jaga target sentuh ≥44px, termasuk tautan teks kecil dan tombol hapus di dalam nota.
- **Do** biarkan konten terlihat penuh tanpa animasi; animasi hanya menambah goresan kapur di atas konten yang sudah ada.
- **Do** menulis semua teks UI dalam Bahasa Indonesia dengan nada santai dan jelas.

### Don't:

- **Don't** memakai kartu putih SaaS, grid kartu sederajat, atau panel mengambang dengan sudut membulat seragam.
- **Don't** memakai kapur merah di atas kertas atau tinta oksida di atas papan.
- **Don't** memakai gradien teks, emoji sebagai ikon, badge kicker di atas judul, kaca/blur dekoratif, atau garis kiri berwarna.
- **Don't** memakai bayangan beroffset nol atau halo berwarna sebagai kedalaman.
- **Don't** membungkus angka uang dalam Kalam atau teks naratif dalam Geist Mono.
- **Don't** memunculkan dialog browser asli (`alert`, `confirm`, `prompt`) sebagai satu-satunya permukaan asing di dalam dunia ini.
- **Don't** menyembunyikan konten di balik animasi masuk; pengguna dengan `prefers-reduced-motion` harus melihat hasil yang sama persis.
- **Don't** memakai bahasa Inggris, tanda seru pemasaran, atau klaim yang tidak ada buktinya di UI.
