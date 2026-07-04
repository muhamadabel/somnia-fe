# 🚀 Panduan Deploy Frontend Somnia (Vercel, gratis)

Frontend Somnia adalah **SPA Next.js** yang memanggil backend lewat HTTP. Panduan ini men-deploy **frontend** ke Vercel secara gratis. Backend di-deploy terpisah oleh temanku (lihat repo `somnia-be-`).

> **Urutan yang benar:** pastikan **backend jalan dulu** dan kamu tahu URL-nya (mis. `https://be-somnia.hallojanu.xyz`). Baru deploy frontend dan arahkan ke URL itu.

---

## 0. Yang perlu disiapkan

- Akun **GitHub** (repo `somnia-fe` sudah ada).
- Akun **Vercel** gratis — daftar di https://vercel.com pakai GitHub.
- **URL backend** yang sudah aktif dari temanku.

---

## 1. Deploy ke Vercel (cara termudah — lewat web)

1. Buka https://vercel.com → **Add New… → Project**.
2. **Import Git Repository** → pilih `muhamadabel/somnia-fe`.
3. Vercel otomatis mendeteksi **Next.js** — biarkan setting build default:
   - Build Command: `next build`
   - Output: otomatis
4. Buka **Environment Variables**, tambahkan satu variabel:

   | Name | Value | Keterangan |
   |------|-------|-----------|
   | `NEXT_PUBLIC_API_URL` | `https://be-somnia.hallojanu.xyz` | URL backend, **tanpa** garis miring di akhir |

5. Klik **Deploy**. Tunggu selesai → dapat domain, mis. `https://somnia-fe.vercel.app`.

---

## 2. Sambungkan CORS di backend (WAJIB)

Backend hanya mengizinkan permintaan dari origin yang terdaftar. Setelah tahu domain frontend dari Vercel:

- Di **backend** (repo `somnia-be-`), set env:
  ```env
  FRONTEND_URL="https://somnia-fe.vercel.app"
  ```
  (ganti dengan domain frontend-mu; kalau pakai domain kustom, pakai itu)
- **Restart / redeploy backend** agar CORS berlaku.

> Kalau langkah ini dilewati, browser akan memblokir permintaan dengan error CORS dan halaman tampak "gagal memuat".

---

## 3. Uji

1. Buka domain frontend di browser.
2. **Daftar** akun baru → harusnya masuk ke onboarding lalu dashboard.
3. Catat satu mimpi → analisis muncul, dan (jika backend online) gambar AI dibuat.

Kalau login berhasil tapi data tidak muncul: cek **Console** browser. Error CORS → langkah 2 belum beres. Error 404 di `/api/...` → backend belum versi terbaru (lihat catatan di bawah).

---

## 4. Ganti URL backend nanti

`NEXT_PUBLIC_API_URL` "dibakar" ke dalam bundel saat build. Jadi kalau backend pindah alamat:

1. Ubah `NEXT_PUBLIC_API_URL` di **Vercel → Project → Settings → Environment Variables**.
2. **Redeploy** (Deployments → tombol ⋯ → Redeploy). Perubahan env saja tidak cukup tanpa build ulang.

---

## 5. Domain kustom (opsional)

Vercel → Project → **Settings → Domains** → tambahkan domain (mis. `somnia.hallojanu.xyz`), ikuti instruksi DNS. Setelah aktif, **perbarui `FRONTEND_URL` di backend** ke domain baru itu.

---

## 6. Alternatif: menjalankan frontend di server sendiri

Kalau mau frontend juga di laptop server (bukan Vercel):

```bash
git clone https://github.com/muhamadabel/somnia-fe.git
cd somnia-fe
npm install
cp .env.example .env.local        # isi NEXT_PUBLIC_API_URL
npm run build
npm start                         # http://localhost:3000
```

Biar tetap nyala pakai **PM2**: `pm2 start npm --name somnia-fe -- start`. Ekspos ke internet pakai **Cloudflare Tunnel** (`cloudflared tunnel --url http://localhost:3000`).

---

## ⚠️ Catatan penting soal versi backend

Frontend ini butuh backend versi **token auth** (login/daftar mengembalikan `token`) dan endpoint gabungan baru (`/api/dashboard`, `/api/trends`, `/api/gallery`, `/api/symbols`, `/api/admin/overview`, dll).

Kalau backend yang ter-deploy masih versi lama, gejalanya: **daftar berhasil tapi tidak bisa masuk**, atau `/api/dashboard` **404**. Solusinya: temanku **pull terbaru `somnia-be-` lalu redeploy**.

---

## 🆘 Troubleshooting

| Masalah | Solusi |
|---------|--------|
| Halaman blank / "Gagal memuat" | Cek Console browser. CORS → set `FRONTEND_URL` di backend (langkah 2) |
| Login/daftar tidak menyimpan sesi | Backend versi lama (belum token auth) → temanku redeploy backend terbaru |
| `/api/...` 404 | Backend belum punya endpoint baru → redeploy backend terbaru |
| Ganti alamat backend tidak berpengaruh | Ubah env di Vercel **lalu redeploy** (env dibakar saat build) |
| Gambar AI tidak muncul | Backend butuh internet (Pollinations); tanpa internet ada fallback SVG |
