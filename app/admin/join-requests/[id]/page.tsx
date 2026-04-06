import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminSession } from '@/lib/auth/admin-session'
import JoinRequestStatusForm from '@/components/admin/JoinRequestStatusForm'
import { getJoinRequestById } from '@/lib/data/join-requests'

type Props = {
  params: Promise<{ id: string }>
}

function getStatusBadgeClass(status: 'new' | 'verified' | 'rejected' | 'waitlisted') {
  if (status === 'verified') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (status === 'rejected') return 'bg-rose-50 text-rose-700 border-rose-200'
  if (status === 'waitlisted') return 'bg-sky-50 text-sky-700 border-sky-200'
  return 'bg-amber-50 text-amber-700 border-amber-200'
}

export default async function AdminJoinRequestDetailPage({ params }: Props) {
  await requireAdminSession()
  const { id } = await params
  const request = await getJoinRequestById(id)

  if (!request) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D35400]">
              Join Request Detail
            </p>
            <h1 className="mt-2 font-serif text-[2rem] leading-tight tracking-[-0.02em] text-[#2C3E50]">
              {request.full_name}
            </h1>
            <p className="mt-2 text-[15px] leading-7 text-charcoal-600">
              Review detail pendaftaran, cek bukti pembayaran, dan simpan status serta catatan internal admin.
            </p>
          </div>
          <Link href="/admin/join-requests" className="rounded-[12px] border border-[#2C3E50] px-4 py-2 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#2C3E50] hover:text-white">
            Kembali ke Join Requests
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="rounded-[18px] border border-[#ece7de] bg-white p-6 shadow-[0_18px_48px_rgba(0,0,0,0.06)]">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-semibold text-[#2C3E50]">Informasi Pendaftar</h2>
                <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getStatusBadgeClass(request.status)}`}>
                  {request.status}
                </span>
              </div>
              <div className="mt-5 space-y-3 text-[15px] leading-7 text-charcoal-600">
                <p><span className="font-semibold text-[#2C3E50]">Nama:</span> {request.full_name}</p>
                <p><span className="font-semibold text-[#2C3E50]">WhatsApp:</span> {request.phone}</p>
                <p><span className="font-semibold text-[#2C3E50]">Batch:</span> {request.batches?.name || '-'}</p>
                <p><span className="font-semibold text-[#2C3E50]">Dibuat:</span> {new Date(request.created_at).toLocaleString('id-ID')}</p>
                <p><span className="font-semibold text-[#2C3E50]">Catatan Pemohon:</span> {request.notes || '-'}</p>
              </div>
            </div>

            <div className="rounded-[18px] border border-[#ece7de] bg-white p-6 shadow-[0_18px_48px_rgba(0,0,0,0.06)]">
              <h2 className="text-xl font-semibold text-[#2C3E50]">Bukti Pembayaran</h2>
              <p className="mt-3 text-[15px] leading-7 text-charcoal-600">
                File tersimpan di private bucket Supabase dan hanya bisa diakses admin melalui signed URL sementara.
              </p>
              <div className="mt-5">
                <a
                  href={`/admin/join-requests/${request.id}/proof`}
                  className="inline-flex items-center justify-center rounded-[12px] border border-[#2C3E50] px-4 py-2.5 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#2C3E50] hover:text-white"
                >
                  Lihat Bukti Pembayaran
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-[18px] border border-[#ece7de] bg-white p-6 shadow-[0_18px_48px_rgba(0,0,0,0.06)]">
            <h2 className="text-xl font-semibold text-[#2C3E50]">Review Admin</h2>
            <p className="mt-3 text-[15px] leading-7 text-charcoal-600">
              Simpan status follow-up dan catatan internal admin dalam satu form agar histori penanganan lebih rapi.
            </p>
            <div className="mt-5">
              <JoinRequestStatusForm
                requestId={request.id}
                currentStatus={request.status}
                currentInternalNotes={request.internal_notes}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
