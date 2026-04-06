import Link from 'next/link'
import { requireAdminSession } from '@/lib/auth/admin-session'
import AdminShell from '@/components/admin/AdminShell'
import PaymentProofPreviewButton from '@/components/admin/PaymentProofPreviewButton'
import JoinRequestStatusForm from '@/components/admin/JoinRequestStatusForm'
import { getJoinRequests } from '@/lib/data/join-requests'

type Props = {
  searchParams: Promise<{
    status?: 'all' | 'new' | 'verified' | 'rejected' | 'waitlisted'
    search?: string
    sort?: 'newest' | 'oldest'
  }>
}

function getStatusBadgeClass(status: 'new' | 'verified' | 'rejected' | 'waitlisted') {
  if (status === 'verified') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (status === 'rejected') return 'bg-rose-50 text-rose-700 border-rose-200'
  if (status === 'waitlisted') return 'bg-sky-50 text-sky-700 border-sky-200'
  return 'bg-amber-50 text-amber-700 border-amber-200'
}

export default async function AdminJoinRequestsPage({ searchParams }: Props) {
  await requireAdminSession()
  const params = await searchParams
  const status = params.status || 'all'
  const search = params.search || ''
  const sort = params.sort || 'newest'
  const requests = await getJoinRequests({ status, search, sort })

  return (
    <AdminShell
      currentSection="join-requests"
      eyebrow="Join Requests"
      title="Pendaftaran Join Batch"
      description="Review pendaftaran masuk, cek bukti pembayaran, lalu ubah status follow-up sesuai progres admin."
      backHref="/admin"
      backLabel="Kembali"
    >
        <form className="grid gap-4 rounded-[18px] border border-[#ece7de] bg-white p-5 shadow-[0_18px_48px_rgba(0,0,0,0.06)] md:grid-cols-[1fr_180px_160px_auto]" method="get">
          <input
            name="search"
            defaultValue={search}
            placeholder="Cari nama atau nomor telepon"
            className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]"
          />
          <select name="status" defaultValue={status} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]">
            <option value="all">Semua Status</option>
            <option value="new">new</option>
            <option value="verified">verified</option>
            <option value="rejected">rejected</option>
            <option value="waitlisted">waitlisted</option>
          </select>
          <select name="sort" defaultValue={sort} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]">
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
          <button type="submit" className="rounded-[12px] bg-[#D35400] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#B94600]">
            Terapkan Filter
          </button>
        </form>

        <div className="flex justify-end">
          <Link
            href={`/admin/join-requests/export?status=${encodeURIComponent(status)}&search=${encodeURIComponent(search)}&sort=${encodeURIComponent(sort)}`}
            className="rounded-[12px] border border-[#2C3E50] px-4 py-2.5 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#2C3E50] hover:text-white"
          >
            Export CSV
          </Link>
        </div>

        <div className="rounded-[18px] border border-[#ece7de] bg-white shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
          <div className="divide-y divide-[#ece7de]">
            {requests.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-charcoal-500">Belum ada join request yang masuk.</div>
            ) : (
              requests.map((request) => (
                <div key={request.id} className="grid gap-5 px-6 py-6 lg:grid-cols-[1.2fr_0.8fr]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-[#2C3E50]">{request.full_name}</h2>
                      <span className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${getStatusBadgeClass(request.status)}`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-7 text-charcoal-600">
                      Batch: <span className="font-semibold text-[#2C3E50]">{request.batches?.name || '-'}</span> · WhatsApp: <span className="font-semibold text-[#2C3E50]">{request.phone}</span>
                    </p>
                    {request.notes ? (
                      <p className="mt-2 text-sm leading-7 text-charcoal-600">Catatan: {request.notes}</p>
                    ) : null}
                    <p className="mt-2 text-xs uppercase tracking-[0.18em] text-charcoal-400">
                      Masuk {new Date(request.created_at).toLocaleString('id-ID')}
                    </p>
                  </div>

                  <div className="space-y-3 rounded-[14px] border border-[#ece7de] bg-[#fcfaf6] p-4">
                    <Link
                      href={`/admin/join-requests/${request.id}`}
                      className="inline-flex w-full items-center justify-center rounded-[12px] bg-[#2C3E50] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#223240]"
                    >
                      Lihat Detail Request
                    </Link>
                    <PaymentProofPreviewButton requestId={request.id} requesterName={request.full_name} />
                    <JoinRequestStatusForm
                      requestId={request.id}
                      currentStatus={request.status}
                      currentInternalNotes={request.internal_notes}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
    </AdminShell>
  )
}
