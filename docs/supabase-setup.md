# Supabase Setup

## Source of Truth

Project ini sekarang memakai **Supabase** sebagai source of truth utama untuk:
- batches
- batch_slots
- holidays
- join_requests
- admin_credentials
- payment proof uploads

Google Sheets / Apps Script sudah tidak dipakai lagi untuk runtime production.

## Required Environment Variables

Tambahkan variabel berikut di local `.env.local` dan Vercel:

```env
NEXT_PUBLIC_SITE_VARIANT=main
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin
```

Untuk project landing page menu di Vercel:

```env
NEXT_PUBLIC_SITE_VARIANT=menu-landing
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## Database Setup

1. Jalankan `supabase/schema.sql` di SQL Editor Supabase.
2. Jalankan `supabase/seed.sql` untuk seed awal.
3. Buat bucket private bernama `payment-proofs`.
4. Jika belum, jalankan migration tambahan:

```sql
alter table public.join_requests
add column if not exists internal_notes text;
```

## Seed Admin

Jalankan:

```bash
npm run seed:admin
```

Ini akan membuat atau memperbarui admin awal dari env `ADMIN_USERNAME` dan `ADMIN_PASSWORD`.

## Verify Data

Jalankan:

```bash
npm run verify:supabase
```

Expected minimal output:
- batchCount > 0
- holidayCount > 0
- slotCount > 0
- activeBatchName terisi

## Production Notes

- Gunakan bucket private untuk bukti pembayaran.
- Preview file di admin memakai signed URL sementara.
- Untuk saat ini auth admin masih berbasis credential internal + cookie session aplikasi.
- Hardening auth bisa dilakukan di fase berikutnya.
