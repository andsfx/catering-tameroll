import Link from 'next/link'
import { requireAdminSession } from '@/lib/auth/admin-session'
import JoinRequestStatusForm from '@/components/admin/JoinRequestStatusForm'
import { getJoinRequests } from '@/lib/data/join-requests'

export default async function AdminJoinRequestsPage() {
  await requireAdminSession()
  const requests = await getJoinRequests()

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D35400]">
              Join Requests
            </p>
            <h1 className="mt-2 font-serif text-[2rem] leading-tight tracking-[-0.02em] text-[#2C3E50]">
              Pendaftaran Join Batch
            </h1>
            <p className="mt-2 text-[15px] leading-7 text-charcoal-600">
              Review pendaftaran masuk, cek bukti pembayaran, lalu ubah status follow-up sesuai progres admin.
            </p>
          </div>
          <Link href="/admin" className="rounded-[12px] border border-[#2C3E50] px-4 py-2 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#2C3E50] hover:text-white">
            Kembali
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
                      <span className="rounded-full bg-[#faf9f6] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal-500">
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
                    <a
                      href={request.payment_proof_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center rounded-[12px] border border-[#2C3E50] px-4 py-2.5 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#2C3E50] hover:text-white"
                    >
                      Lihat Bukti Pembayaran
                    </a>
                    <JoinRequestStatusForm requestId={request.id} currentStatus={request.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
