# 🌙 Somnia — Penganalisis Jurnal Mimpi

Platform **jurnal mimpi bertenaga AI** untuk refleksi diri. Catat mimpi, dapatkan analisis AI (emosi, simbol, tema, refleksi), ubah mimpi jadi **karya seni AI**, pantau tren emosi, terima laporan kesejahteraan, ngobrol dengan **Teman AI yang mengingat seluruh riwayat mimpimu**, dan bagikan mimpi secara anonim ke komunitas.

**Seluruh antarmuka & keluaran AI berbahasa Indonesia.** Aplikasi ini utuh (frontend + backend jadi satu app Next.js).

- 🖥️ **Repo ini (aplikasi lengkap, bisa langsung jalan):** frontend + API + database + AI
- 🗄️ **Repo backend (kode server + panduan Supabase):** https://github.com/muhamadabel/somnia-be-

> **Disclaimer** — Somnia adalah alat refleksi diri, bukan perangkat medis. Insight AI bersifat reflektif & edukatif, bukan diagnosis, dan tak menggantikan bantuan profesional kesehatan mental.

---

## 🚀 Menjalankan (lokal, tanpa setup apa pun)

Butuh **Node.js 18.18+** (diuji di Node 24).

```bash
npm install        # pasang dependensi
npm run setup      # prisma generate + buat database SQLite + isi data demo
npm run dev        # buka http://localhost:3000
```

Selesai — tanpa layanan eksternal, tanpa API key, tanpa server database. Database memakai file SQLite (`prisma/dev.db`) sehingga langsung jalan.

### Akun demo (sudah terisi)

| Peran | Email | Kata sandi | Isinya |
|-------|-------|------------|--------|
| User  | `demo@somnia.app`  | `dream1234` | 19 mimpi selama ~6 minggu + analisis, seni mimpi, laporan, percakapan AI, komunitas |
| Admin | `admin@somnia.app` | `admin1234` | Semua di atas + `/admin` (antrean moderasi, pengguna, jejak audit) |

Skrip lain: `npm run build` / `npm start` (produksi), `npm run db:reset` (hapus + isi ulang).

---

## ✨ Fitur

| Fitur | Keterangan |
|-------|-----------|
| 📝 Catat Mimpi | CRUD + draf, arsip, mood emoji, durasi tidur, lampiran gambar |
| 🧠 Analisis AI | Ringkasan, emosi + alasan, simbol + alasan, tema, refleksi, deteksi pola lintas mimpi, analisis berversi |
| 🎨 Visualisasi Mimpi | **Gambar AI asli** dari emosi & simbol mimpi (bukan upload) |
| 📈 Tren Emosi | Grafik positivitas, frekuensi emosi, keseimbangan positif/negatif |
| 📅 Kalender | Riwayat mimpi kronologis dengan penanda emosi |
| ✨ Pustaka Simbol | 40+ simbol + interpretasi + mimpi terkait + bookmark |
| 📋 Laporan Kesejahteraan | Ringkasan mingguan/bulanan/tahunan + ekspor PDF |
| 💬 Teman AI | Chat yang membaca **seluruh riwayat mimpi** — menyebut mimpi spesifik & pola |
| 🤝 Komunitas | Berbagi anonim (nama samaran), komentar, reaksi, laporan konten |
| 🔔 Notifikasi · ⚙️ Pengaturan · 🛡️ Admin | Notifikasi, profil/privasi/tema, moderasi |

---

## 🤖 Mode AI — gratis secara default, tanpa API key

Subsistem AI bersifat **provider-agnostic**. Secara default semua **gratis tanpa key**:

| Fitur | Default gratis | Cara kerja |
|-------|----------------|------------|
| **Teman AI** | LLM gratis via **Pollinations.ai** | Seluruh riwayat mimpi dikirim ke prompt → "ingat semua" |
| **Visualisasi** | Gambar AI via **Pollinations Flux** | Emosi + simbol → prompt → gambar diffusion asli |
| **Analisis & laporan** | Mesin lokal bawaan (instan, andal) | Deteksi emosi/simbol berbasis kamus + refleksi Indonesia |

Setiap panggilan gratis punya **fallback otomatis**: jika Pollinations tak terjangkau, Teman AI memakai mesin lokal dan gambar memakai seni SVG prosedural bawaan — jadi tak pernah error, bahkan offline (`AI_MODE=local`).

Isi `ANTHROPIC_API_KEY` di `.env` untuk mengarahkan **semuanya** ke **Claude**. Mode aktif selalu terlihat di sidebar & tiap kartu analisis.

---

## 🧱 Teknologi

| Pilihan | Alasan |
|---------|--------|
| **Next.js 15 (App Router) + TypeScript** | Satu codebase untuk UI + API, server components, deploy mudah |
| **Prisma ORM + SQLite** | Nol-setup untuk demo; **pindah ke PostgreSQL/Supabase cukup ubah 2 baris** di `schema.prisma` |
| **Tailwind CSS v4** | Design token konsisten, dark mode, tema "langit malam" |
| **Recharts** | Grafik yang mudah dibaca non-teknis |
| **Auth sesi cookie httpOnly + bcrypt** | Mandiri, aman, siap-OAuth |

---

## 📂 Struktur

```
app/
  (auth)/        login, register
  (app)/         halaman terproteksi (dashboard, dreams, calendar, dst.)
  api/           30 route handler (backend)
components/       UI kit + komponen fitur
lib/
  db, auth, api, validation, constants, utils
  services/      analysis, reports, trends, storage
  ai/            subsistem AI (pollinations, anthropic, local, image, art)
prisma/          schema (19 model) + seed
docs/            dokumen spesifikasi (00–16)
```

---

## ☁️ Deploy / jalankan di server sendiri

📘 **Panduan lengkap ada di [`DEPLOY.md`](DEPLOY.md)** — cara menjalankan di komputer/laptop sendiri sebagai server, dari jaringan lokal sampai diakses dari internet.

Karena aplikasi ini **mandiri** (SQLite + penyimpanan lokal + AI gratis), di server dengan disk permanen tinggal:

```bash
npm install
npm run setup          # buat DB + data demo
# edit .env → isi SESSION_SECRET
npm run build && npm start   # http://localhost:3000
```

Biar tetap nyala: pakai `pm2` (lihat [DEPLOY.md](DEPLOY.md)). Untuk diakses dari HP lain di WiFi yang sama: `http://<IP-server>:3000`. Untuk dari internet: **Cloudflare Tunnel** (gratis).

**Opsional — PostgreSQL/Supabase:** kalau mau database server-grade, panduannya di [repo backend](https://github.com/muhamadabel/somnia-be-#-setup-database-di-supabase).

---

## 🔒 Keamanan & privasi

- Kata sandi di-hash **bcrypt**; sesi = token acak di cookie **httpOnly/SameSite**, bisa dicabut server-side.
- **Kepemilikan divalidasi** di setiap akses — pengguna hanya bisa mengakses datanya sendiri.
- **Rate limiting**, **soft delete**, komunitas **anonim** (nama samaran), pengguna mengontrol memori AI.
- Upload divalidasi (tipe + ukuran), disimpan di luar web-root, dilayani hanya ke sesi terautentikasi.
- File `.env` (berisi `SESSION_SECRET`) & database lokal tidak ikut ke Git.
