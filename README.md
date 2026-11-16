# project-paronan — Split Bill App

Aplikasi web untuk membagi tagihan bersama tanpa registrasi. Lihat `PRD.md`
untuk ruang lingkup v1 dan `CLAUDE.md` untuk aturan kerja.

## Persiapan

```bash
npm install
cp .env.example .env   # DATABASE_URL="file:./dev.db"
npx prisma migrate dev --name init
```

## Perintah

```bash
npm run dev     # dev server di http://localhost:3000
npm run build   # build produksi (harus lolos TypeScript)
npm start       # jalankan hasil build di :3000
npm test        # unit test (belum ada)
```
