# QA Production Checklist

## Public Pages

### 1. Landing Page Menu
URL:
- `https://menu-catering-tameroll.vercel.app`

Checklist:
- Hero tampil normal
- Cards batch kiri muncul
- Kalender 4 minggu kanan muncul
- Data sesuai Supabase
- CTA hero bekerja
- `Isi Form Join` menuju `/join-batch`
- `Lihat Jadwal Lengkap` scroll ke section batch
- Status batch benar
- `Batch Dibuka` / `Batch Sedang Berjalan` / `Batch Ditutup`
- Data batch benar
- Nama batch
- Deadline join
- Kuota tersisa
- Batch berikutnya
- Hero responsive
- Desktop rapi
- Mobile tidak pecah
- Tidak ada horizontal scroll

### 2. Menu Section / Batch Detail
Checklist:
- Weekly list tampil
- Modal detail terbuka saat klik item yang relevan
- CTA modal sesuai `batchStatus`
- Jika `open`, CTA ke join batch aktif
- Jika `running` / `closed`, CTA ke waiting list / admin
- Tidak ada timeline duplikat yang membingungkan
- Copy tidak lagi terasa seperti order harian

### 3. Join Batch Form
URL:
- `/join-batch`

Checklist:
- Halaman bisa dibuka
- Menampilkan batch aktif yang benar
- Submit valid berhasil
- Validasi nama bekerja
- Validasi nomor telepon Indonesia bekerja
- Validasi file bekerja
- Wajib upload
- Hanya JPG/PNG/PDF
- File besar ditolak
- Feedback submit tampil
- Loading
- Sukses
- Gagal
- Row baru masuk ke `join_requests`
- File masuk ke bucket `payment-proofs`

### 4. WhatsApp Links
Checklist:
- Semua CTA WA pakai nomor `6285183248797`
- Pesan prefilled sesuai status batch
- Link WA terbuka normal di mobile dan desktop

## Admin Pages

### 5. Admin Login
URL:
- `/admin/login`

Checklist:
- Login salah menampilkan error
- Login benar redirect ke `/admin`
- Tombol login menampilkan loading saat submit
- Session cookie terset setelah login

### 6. Admin Route Protection
Checklist:
- `/admin` redirect ke login jika belum login
- `/admin/join-requests` redirect ke login jika belum login
- `/admin/batches/[id]` redirect ke login jika belum login
- `/admin/settings` redirect ke login jika belum login

### 7. Dashboard Admin
URL:
- `/admin`

Checklist:
- Statistik tampil
- Request Baru
- Verified
- Waitlisted
- Rejected
- Filter batch bekerja
- Status
- Search
- Sort
- Link cepat ke status request bekerja
- Batch aktif tampil benar
- Logout bekerja

### 8. Batch Detail Admin
URL:
- `/admin/batches/[id]`

Checklist:
- Data batch tampil benar
- Edit batch berhasil simpan
- Set active batch berhasil
- Summary slot tampil
- Total
- Tersedia
- Nonaktif
- Filter slot bekerja
- All
- Available
- Disabled
- Search
- Tambah slot berhasil
- Edit slot berhasil
- Hapus slot berhasil
- Feedback sukses/gagal tampil di semua action

### 9. Join Requests Admin
URL:
- `/admin/join-requests`

Checklist:
- Filter status bekerja
- Search nama bekerja
- Search nomor bekerja
- Sort newest/oldest bekerja
- Export CSV berhasil
- CSV sesuai filter aktif
- Internal notes bisa disimpan
- Update status bisa disimpan
- Feedback sukses/gagal tampil

### 10. Join Request Detail
URL:
- `/admin/join-requests/[id]`

Checklist:
- Detail pemohon tampil benar
- Batch tampil benar
- Notes pemohon tampil benar
- Internal notes bisa diedit
- Status bisa diubah
- Bukti pembayaran bisa dipreview dari modal
- Modal preview
- Image tampil di popup
- PDF tampil di iframe
- Bisa close
- Bisa buka di tab baru
- Tidak pindah halaman saat preview dibuka

### 11. Admin Settings
URL:
- `/admin/settings`

Checklist:
- Ganti password salah -> error
- Ganti password berhasil -> sukses
- Password baru bisa dipakai login ulang
- Password lama tidak bisa dipakai lagi

### 12. Logout
Checklist:
- Logout dari dashboard berhasil
- Logout dari settings berhasil
- Setelah logout, akses `/admin` redirect ke login

## Data / Backend

### 13. Supabase Data
Checklist:
- `batches` punya batch aktif tunggal
- `batch_slots` terhubung ke batch aktif
- `join_requests` bertambah setelah form submit
- `internal_notes` tersimpan
- `holidays` tetap aman
- `admin_credentials` ada dan valid

### 14. Storage
Checklist:
- Bucket `payment-proofs` ada
- Bucket private
- Upload file berhasil
- Signed URL admin berhasil
- Public tidak bisa akses file langsung tanpa signed URL

## Production / Deployment

### 15. Vercel Env
Checklist:
- `NEXT_PUBLIC_SITE_VARIANT=menu-landing` di project menu
- `NEXT_PUBLIC_SUPABASE_URL` benar
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` benar
- `SUPABASE_URL` benar
- `SUPABASE_SERVICE_ROLE_KEY` benar

### 16. Live Routes
Checklist:
- `/` menu landing hidup
- `/join-batch` hidup
- `/admin/login` hidup
- `/api/public-menu` return sukses
- Tidak ada 404 route penting

### 17. Responsive
Checklist:
- Landing page mobile
- Join form mobile
- Admin mobile basic usable
- Tidak ada horizontal overflow

## Final Sign-off
Anggap production siap jika:
- Public user bisa melihat jadwal
- Public user bisa isi form
- Public user bisa submit sukses
- Admin bisa login
- Admin bisa review request
- Admin bisa lihat bukti pembayaran
- Admin bisa ubah status
- Admin bisa ubah internal notes
- Admin bisa kelola batch
- Admin bisa kelola slot
- Semua CTA dan data sudah sinkron dengan Supabase
