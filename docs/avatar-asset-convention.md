# Avatar Asset Convention

Tujuan dokumen ini: memastikan avatar preset bisa diganti manual tanpa perlu ubah struktur fitur.

## Lokasi file

- Preset avatar frontend disimpan di `public/avatars/presets/`
- Referensi daftar preset didefinisikan di `lib/avatar-presets.ts`

## Naming convention

- Gunakan format slug lowercase kebab-case
- Contoh: `moon-guardian`, `forest-whisper`, `sunset-oracle`
- Nama file mengikuti id preset
- Format sekarang: `/avatars/presets/<slug>.svg`
- Jika nanti aset final menjadi PNG atau WebP, update juga `path` di `lib/avatar-presets.ts`

## Rekomendasi file final

- Rasio: `1:1`
- Ukuran master: `1024x1024`
- Safe area wajah: tetap jelas saat diperkecil ke `40x40`
- Background: sederhana, tidak terlalu ramai
- Format development: `svg` atau `webp`
- Format production final: `webp` disarankan bila aset raster

## Cara ganti avatar

1. Generate gambar berdasarkan prompt di `docs/avatar-prompts.md`
2. Export sesuai slug preset yang dituju
3. Timpa file di `public/avatars/presets/`
4. Jika ekstensi berubah, sesuaikan `path` di `lib/avatar-presets.ts`
5. Build ulang untuk verifikasi tampilan

## Aturan desain

- Bust portrait, menghadap depan atau sedikit 3/4
- Siluet harus mudah dikenali di ukuran kecil
- Hindari detail wajah yang terlalu tipis
- Hindari teks dan ornamen pinggir yang terlalu ramai
- Pertahankan palet warna khas tiap preset agar pilihan terasa konsisten
