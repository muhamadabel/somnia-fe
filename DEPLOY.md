# 🚀 Panduan Setup & Menjalankan Somnia di Server Sendiri

Panduan ini untuk menjalankan Somnia di **komputer/laptop sendiri yang dijadikan server**. Aplikasinya **mandiri** — tidak butuh database server terpisah, tidak butuh layanan berbayar. Cukup Node.js.

> Ada beberapa pilihan (jaringan lokal saja, atau diakses dari internet, atau pakai PostgreSQL). Ikuti bagian **1–4** dulu (wajib), lalu pilih bagian lain sesuai kebutuhan.

---

## 0. Yang perlu disiapkan

- **Node.js 18.18 atau lebih baru** (disarankan versi LTS 20/22). Cek: `node -v`
  Belum ada? Download di https://nodejs.org
- **Git** untuk mengambil kode (atau bisa juga salin foldernya langsung).

---

## 1. Ambil kodenya

```bash
git clone https://github.com/muhamadabel/somnia-fe.git
cd somnia-fe
npm install
```

> Repo `somnia-fe` = **aplikasi lengkap** (frontend + backend jadi satu). Ini yang dijalankan. (Repo `somnia-be-` hanya kode server untuk referensi, tidak dijalankan sendiri.)

---

## 2. Konfigurasi `.env`

```bash
cp .env.example .env
```

Buka `.env`, lalu:

1. **Isi `SESSION_SECRET`** dengan string acak (WAJIB). Buat cepat:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```
   Salin hasilnya ke `SESSION_SECRET="...."`.

2. **`DATABASE_URL`** — biarkan default `file:./dev.db` (SQLite). Untuk server sendiri ini sudah cukup dan andal.

3. **AI** — biarkan `ANTHROPIC_API_KEY` kosong = pakai **AI gratis** (Pollinations, butuh internet). Kalau server **tanpa internet**, set `AI_MODE="local"` supaya semua AI jalan offline.

---

## 3. Buat database + data contoh

```bash
npm run setup
```

Ini membuat database SQLite + mengisi akun & jurnal demo.

Akun demo:
- User: `demo@somnia.app` / `dream1234`
- Admin: `admin@somnia.app` / `admin1234`

> Mau mulai dari kosong (tanpa data demo)? Jalankan `npx prisma db push` saja (lewati `db seed`).

---

## 4. Build & jalankan

```bash
npm run build
npm start
```

Aplikasi jalan di **http://localhost:3000**. Buka di browser laptop server → harusnya sudah muncul.

> Ganti port kalau 3000 dipakai: `npm start -- -p 8080` (atau set `PORT=8080`).

---

## 5. Biar tetap nyala (tidak mati saat terminal ditutup)

Cara paling gampang pakai **PM2**:

```bash
npm install -g pm2
pm2 start npm --name somnia -- start
pm2 save
pm2 startup     # ikuti instruksi yang muncul → nyala otomatis saat laptop dihidupkan
```

Perintah berguna: `pm2 logs somnia` (lihat log), `pm2 restart somnia`, `pm2 stop somnia`.

<details>
<summary>Alternatif tanpa PM2</summary>

- **Windows:** jalankan lewat **Task Scheduler** (trigger "At startup", action `npm start` di folder app), atau pakai [NSSM](https://nssm.cc) untuk jadikan service.
- **Linux:** buat service **systemd** (`/etc/systemd/system/somnia.service`) berisi `ExecStart=/usr/bin/npm start`, `WorkingDirectory=/path/ke/somnia-fe`, lalu `sudo systemctl enable --now somnia`.
</details>

---

## 6. Akses dari perangkat lain

- **Di laptop server sendiri:** `http://localhost:3000`
- **Dari HP/komputer lain di WiFi/jaringan yang sama:**
  1. Cari IP laptop server:
     - Windows: `ipconfig` → lihat "IPv4 Address" (mis. `192.168.1.10`)
     - Linux/Mac: `ip addr` atau `ifconfig`
  2. Buka di perangkat lain: `http://192.168.1.10:3000` (ganti dengan IP-nya)
  3. Kalau tidak bisa dibuka: **izinkan port 3000 di firewall** laptop server.

- **Dari internet (di luar jaringan, opsional):** pilih salah satu
  1. **Cloudflare Tunnel** (gratis, tidak perlu buka port router) — *paling disarankan & aman*:
     ```bash
     # install cloudflared, lalu:
     cloudflared tunnel --url http://localhost:3000
     ```
     Dapat URL publik https otomatis.
  2. **ngrok** (cepat untuk testing): `ngrok http 3000`
  3. **Port forwarding router + domain + reverse proxy (nginx) + HTTPS** — paling "pro" tapi paling ribet.

> ⚠️ Kalau diekspos ke internet: pastikan `SESSION_SECRET` sudah diganti string acak, dan idealnya diakses lewat **HTTPS** (Cloudflare Tunnel/ngrok sudah otomatis HTTPS).

---

## 7. ✅ Checklist keputusan (biar temanku tinggal pilih)

- [ ] Cukup diakses di **jaringan lokal (WiFi)** saja, atau harus bisa dari **internet**?
- [ ] Perlu **domain + HTTPS**? (kalau ya → Cloudflare Tunnel jalan pintas)
- [ ] **SQLite** (default, gampang, cukup untuk 1 laptop) atau **PostgreSQL** (bagian 9)?
- [ ] Pakai **data demo** atau mulai **kosong**?
- [ ] AI **online gratis** (Pollinations) atau **offline** (`AI_MODE=local`)?

---

## 8. Update saat ada perubahan kode

```bash
git pull
npm install
npm run build
pm2 restart somnia     # kalau pakai PM2
```

## 9. (Opsional) Pakai PostgreSQL / Supabase

SQLite sudah cukup untuk server sendiri. Tapi kalau mau database "server-grade" (PostgreSQL lokal atau Supabase), langkahnya ada di README repo backend:
👉 https://github.com/muhamadabel/somnia-be-#-setup-database-di-supabase

Intinya: ubah `provider` di `prisma/schema.prisma` jadi `postgresql` + tambah `directUrl`, set `DATABASE_URL`/`DIRECT_URL`, lalu `npx prisma db push`.

## 10. Backup data

- **Database (SQLite):** cukup salin file `prisma/dev.db`.
- **Gambar (upload + seni AI):** salin folder `storage/`.

Lakukan berkala kalau ini dipakai beneran.

---

## 🆘 Troubleshooting singkat

| Masalah | Solusi |
|---------|--------|
| `Port 3000 is already in use` | Pakai port lain: `npm start -- -p 8080` |
| Tidak bisa diakses dari HP | Cek firewall port 3000, pastikan satu jaringan, cek IP benar |
| AI lambat / kadang "mesin lokal" | Normal — Pollinations gratis kadang sibuk, otomatis fallback. Atau set `AI_MODE=local` |
| Gambar AI tidak muncul | Butuh internet (Pollinations). Tanpa internet, otomatis pakai seni SVG bawaan |
| Build error | Pastikan Node 18.18+ (`node -v`), lalu `npm install` ulang |

---

Butuh bantuan lebih lanjut? Semua kode & spesifikasi ada di folder `docs/`, dan struktur backend dijelaskan di repo `somnia-be-`.
