import Link from 'next/link'
import { requireAdminSession } from '@/lib/auth/admin-session'
import AdminShell from '@/components/admin/AdminShell'
import { getAllBatches } from '@/lib/data/batches'
import { getJoinRequestStats } from '@/lib/data/join-requests'

type Props = {
  searchParams: Promise<{
    status?: 'all' | 'open' | 'running' | 'closed'
    search?: string
    sort?: 'newest' | 'oldest'
  }>
}

export default async function AdminDashboardPage({ searchParams }: Props) {
  const session = await requireAdminSession()
  const params = await searchParams
  const status = params.status || 'all'
  const search = params.search || ''
  const sort = params.sort || 'newest'
  const [batches, requestStats] = await Promise.all([
    getAllBatches({ status, search, sort }),
    getJoinRequestStats(),
  ])
  const activeBatch = batches.find((batch) => batch.is_active)

  return (
    <AdminShell
      currentSection="dashboard"
      eyebrow="Admin Dashboard"
      title="Kelola Batch Tameroll"
      description="Ubah status batch, kuota, deadline join, dan batch aktif yang tampil di landing page."
      username={session.username}
    >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[16px] border border-[#ece7de] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-charcoal-400">Batch Aktif</p>
            <h2 className="mt-3 text-lg font-semibold text-[#2C3E50]">{activeBatch?.name || 'Belum ada batch aktif'}</h2>
          </div>
          <div className="rounded-[16px] border border-[#ece7de] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-charcoal-400">Total Batch</p>
            <h2 className="mt-3 text-lg font-semibold text-[#2C3E50]">{batches.length}</h2>
          </div>
          <div className="rounded-[16px] border border-[#ece7de] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-charcoal-400">Status Aktif</p>
            <h2 className="mt-3 text-lg font-semibold text-[#2C3E50]">{activeBatch?.status || '-'}</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Link href="/admin/join-requests?status=new" className="rounded-[16px] border border-amber-200 bg-amber-50 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-amber-700">Request Baru</p>
            <h2 className="mt-3 text-2xl font-semibold text-amber-950">{requestStats.newCount}</h2>
          </Link>
          <Link href="/admin/join-requests?status=verified" className="rounded-[16px] border border-emerald-200 bg-emerald-50 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-700">Verified</p>
            <h2 className="mt-3 text-2xl font-semibold text-emerald-950">{requestStats.verifiedCount}</h2>
          </Link>
          <Link href="/admin/join-requests?status=waitlisted" className="rounded-[16px] border border-sky-200 bg-sky-50 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-sky-700">Waitlisted</p>
            <h2 className="mt-3 text-2xl font-semibold text-sky-950">{requestStats.waitlistedCount}</h2>
          </Link>
          <Link href="/admin/join-requests?status=rejected" className="rounded-[16px] border border-rose-200 bg-rose-50 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition hover:-translate-y-0.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-rose-700">Rejected</p>
            <h2 className="mt-3 text-2xl font-semibold text-rose-950">{requestStats.rejectedCount}</h2>
          </Link>
        </div>

        <form className="grid gap-4 rounded-[18px] border border-[#ece7de] bg-white p-5 shadow-[0_18px_48px_rgba(0,0,0,0.06)] md:grid-cols-[1fr_180px_160px_auto]" method="get">
          <input
            name="search"
            defaultValue={search}
            placeholder="Cari nama batch atau bulan sumber"
            className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]"
          />
          <select name="status" defaultValue={status} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]">
            <option value="all">Semua Status</option>
            <option value="open">open</option>
            <option value="running">running</option>
            <option value="closed">closed</option>
          </select>
          <select name="sort" defaultValue={sort} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]">
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
          <button type="submit" className="rounded-[12px] bg-[#D35400] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#B94600]">
            Filter Batch
          </button>
        </form>

        <div className="rounded-[18px] border border-[#ece7de] bg-white shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
          <div className="border-b border-[#ece7de] px-6 py-5">
            <h2 className="font-serif text-[1.7rem] leading-tight tracking-[-0.02em] text-[#2C3E50]">
              Daftar Batch
            </h2>
          </div>
          <div className="divide-y divide-[#ece7de]">
            {batches.map((batch) => (
              <div key={batch.id} className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-semibold text-[#2C3E50]">{batch.name}</h3>
                    {batch.is_active ? (
                      <span className="rounded-full bg-[#D35400]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#D35400]">
                        Aktif
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-charcoal-600">
                    Status: <span className="font-semibold text-[#2C3E50]">{batch.status}</span> · Deadline: {batch.deadline_join || '-'} · Kuota: {batch.remaining_quota ?? '-'}
                  </p>
                </div>
                <Link href={`/admin/batches/${batch.id}`} className="inline-flex items-center justify-center rounded-[12px] border border-[#2C3E50] px-4 py-2.5 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#2C3E50] hover:text-white">
                  Edit Batch
                </Link>
              </div>
            ))}
          </div>
        </div>
    </AdminShell>
  )
}
