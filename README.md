# 🌙 Somnia — Penganalisis Jurnal Mimpi (Frontend)

Antarmuka **jurnal mimpi bertenaga AI** untuk refleksi diri: catat mimpi, dapatkan analisis AI (emosi, simbol, tema, refleksi), ubah mimpi jadi **karya seni AI**, pantau tren emosi, terima laporan kesejahteraan, ngobrol dengan **Teman AI yang mengingat seluruh riwayat mimpimu**, dan bagikan mimpi secara anonim ke komunitas.

**Seluruh antarmuka & keluaran AI berbahasa Indonesia.**

Ini adalah **frontend saja** — sebuah SPA Next.js yang memanggil backend lewat HTTP. Backend (data + AI) ada di repo terpisah.

- 🖥️ **Repo ini — Frontend (SPA):** https://github.com/muhamadabel/somnia-fe
- 🗄️ **Repo Backend (API + database + AI):** https://github.com/muhamadabel/somnia-be-

> **Disclaimer** — Somnia adalah alat refleksi diri, bukan perangkat medis. Insight AI bersifat reflektif & edukatif, bukan diagnosis, dan tak menggantikan bantuan profesional kesehatan mental.

---

## 🧩 Arsitektur (dua aplikasi terpisah)

```
┌────────────────────────┐        HTTPS + Bearer token       ┌────────────────────────┐
│   Frontend (repo ini)  │  ──────────────────────────────▶  │   Backend (somnia-be)  │
│   Next.js SPA           │   fetch(NEXT_PUBLIC_API_URL/...)  │   Next.js API + Prisma │
│   Deploy: Vercel (gratis)│  ◀──────────────────────────────  │   Deploy: server temanku│
└────────────────────────┘        JSON envelope + gambar      └────────────────────────┘
```

- Frontend **tidak** punya database atau AI — semua lewat API backend.
- Login/daftar mengembalikan **token**, disimpan di `localStorage`, dikirim sebagai `Authorization: Bearer <token>` di tiap permintaan.
- Gambar (seni mimpi/upload) juga diambil dari backend (`/api/files/...`).
- Satu-satunya konfigurasi yang dibutuhkan frontend: **`NEXT_PUBLIC_API_URL`** (alamat backend).

---

## 🚀 Menjalankan lokal

Butuh **Node.js 18.18+** dan **backend yang sudah jalan** (lihat repo `somnia-be-`).

```bash
npm install
cp .env.example .env.local      # lalu isi NEXT_PUBLIC_API_URL
npm run dev                     # buka http://localhost:3000
```

Isi `.env.local`:

```env
# Arahkan ke backend yang sedang berjalan:
NEXT_PUBLIC_API_URL="http://localhost:3001"      # kalau backend lokal di port 3001
# atau backend produksi temanku:
# NEXT_PUBLIC_API_URL="https://be-somnia.hallojanu.xyz"
```

> Frontend dan backend jalan di port berbeda (mis. FE 3000, BE 3001). Backend harus mengizinkan origin frontend lewat `FRONTEND_URL` (CORS) — lihat README backend.

Skrip: `npm run dev` (pengembangan), `npm run build` + `npm start` (produksi), `npm run lint`.

---

## ☁️ Deploy ke Vercel (gratis)

1. Push repo ini ke GitHub (sudah).
2. Di [vercel.com](https://vercel.com) → **New Project** → impor `somnia-fe`.
3. **Environment Variables** → tambahkan:
   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_API_URL` | `https://be-somnia.hallojanu.xyz` (URL backend, tanpa `/` di akhir) |
4. **Deploy**. Vercel mendeteksi Next.js otomatis (build `next build`).
5. Setelah dapat domain frontend (mis. `https://somnia.vercel.app` atau domain kustom), **beri tahu backend**: set `FRONTEND_URL` di backend = domain itu, supaya CORS mengizinkannya.

> `NEXT_PUBLIC_API_URL` "dibakar" saat build. Kalau alamat backend berubah, ubah env di Vercel lalu **redeploy**.

Panduan langkah demi langkah ada di [`DEPLOY.md`](DEPLOY.md).

---

## ✨ Fitur

| Fitur | Keterangan |
|-------|-----------|
| 📝 Catat Mimpi | CRUD + draf, arsip, mood emoji, durasi tidur, lampiran gambar |
| 🧠 Analisis AI | Ringkasan, emosi + alasan, simbol + alasan, tema, refleksi, pola lintas mimpi |
| 🎨 Visualisasi Mimpi | **Gambar AI asli** dari emosi & simbol mimpi (bukan upload) |
| 📈 Tren Emosi | Grafik positivitas, frekuensi emosi, keseimbangan positif/negatif |
| 📅 Kalender | Riwayat mimpi kronologis dengan penanda emosi |
| ✨ Pustaka Simbol | 40+ simbol + interpretasi + mimpi terkait + bookmark |
| 📋 Laporan Kesejahteraan | Ringkasan mingguan/bulanan/tahunan + ekspor PDF |
| 💬 Teman AI | Chat yang membaca **seluruh riwayat mimpi** — menyebut mimpi spesifik & pola |
| 🤝 Komunitas | Berbagi anonim (nama samaran), komentar, reaksi, laporan konten |
| 🔔 Notifikasi · ⚙️ Pengaturan · 🛡️ Admin | Notifikasi, profil/privasi/tema, moderasi |

---

## 🧱 Teknologi (frontend)

| Pilihan | Alasan |
|---------|--------|
| **Next.js 15 (App Router) + TypeScript** | Semua halaman client component, di-deploy sebagai SPA |
| **Tailwind CSS v4** | Design token konsisten, dark mode, tema "langit malam" |
| **Recharts** | Grafik yang mudah dibaca non-teknis |
| **lucide-react** | Ikon |
| **Auth Bearer token (localStorage)** | Cocok untuk frontend & backend beda origin |

---

## 📂 Struktur

```
app/
  (auth)/        login, register        (setToken → localStorage)
  (app)/         halaman terproteksi (dashboard, dreams, calendar, dst.)
  onboarding/    perkenalan
  layout.tsx     root (tema), (app)/layout.tsx = penjaga sesi + sidebar
components/       UI kit + komponen fitur (semua client)
lib/
  client.ts      pembungkus fetch → API backend (Bearer token, fileUrl)
  session.ts     simpan/ambil/hapus token di localStorage
  use-api.ts     hook pemuat data (data/loading/error/reload)
  api-types.ts   tipe respons API (aman untuk client)
  constants, utils
  ai/lexicon.ts  label simbol/emosi Indonesia (data murni, dipakai UI)
docs/            dokumen spesifikasi (00–16)
```

---

## 🔒 Catatan keamanan

- Token disimpan di `localStorage` dan dikirim sebagai header `Authorization: Bearer`.
- Respons `401` otomatis menghapus token dan mengarahkan ke `/login`.
- File `.env.local` (berisi `NEXT_PUBLIC_API_URL`) tidak ikut ke Git.
- Semua validasi kepemilikan, rate limiting, hashing kata sandi, dan penyimpanan file ada di **backend**.
