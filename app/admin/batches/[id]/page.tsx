import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminSession } from '@/lib/auth/admin-session'
import BatchEditForm from '@/components/admin/BatchEditForm'
import BatchSlotForm from '@/components/admin/BatchSlotForm'
import { getBatchById } from '@/lib/data/batches'
import { getBatchSlots } from '@/lib/data/batch-slots'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{
    slot?: 'all' | 'available' | 'disabled'
    search?: string
  }>
}

export default async function AdminBatchDetailPage({ params, searchParams }: Props) {
  await requireAdminSession()
  const { id } = await params
  const filters = await searchParams
  const slotFilter = filters.slot || 'all'
  const slotSearch = filters.search || ''
  const [batch, slots, allSlots] = await Promise.all([
    getBatchById(id),
    getBatchSlots(id, { status: slotFilter, search: slotSearch }),
    getBatchSlots(id),
  ])

  if (!batch) {
    notFound()
  }

  const availableSlots = allSlots.filter((slot) => slot.is_available).length
  const unavailableSlots = allSlots.length - availableSlots

  return (
    <main className="min-h-screen bg-[#FDFBF7] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D35400]">
              Edit Batch
            </p>
            <h1 className="mt-2 font-serif text-[2rem] leading-tight tracking-[-0.02em] text-[#2C3E50]">
              {batch.name}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/join-requests" className="rounded-[12px] border border-[#2C3E50] px-4 py-2 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#2C3E50] hover:text-white">
              Join Requests
            </Link>
            <Link href="/admin" className="rounded-[12px] border border-[#2C3E50] px-4 py-2 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#2C3E50] hover:text-white">
              Kembali
            </Link>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#ece7de] bg-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
          <BatchEditForm batch={batch} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[16px] border border-[#ece7de] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-charcoal-400">Total Slot</p>
            <h2 className="mt-3 text-lg font-semibold text-[#2C3E50]">{slots.length}</h2>
          </div>
          <div className="rounded-[16px] border border-emerald-200 bg-emerald-50 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-emerald-700">Slot Tersedia</p>
            <h2 className="mt-3 text-lg font-semibold text-emerald-950">{availableSlots}</h2>
          </div>
          <div className="rounded-[16px] border border-slate-200 bg-slate-50 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.05)]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-slate-600">Slot Nonaktif</p>
            <h2 className="mt-3 text-lg font-semibold text-slate-900">{unavailableSlots}</h2>
          </div>
        </div>

        <div className="rounded-[18px] border border-[#ece7de] bg-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D35400]">
              Slot Menu Batch
            </p>
            <h2 className="mt-2 font-serif text-[1.75rem] leading-tight tracking-[-0.02em] text-[#2C3E50]">
              CRUD Slot Menu
            </h2>
          </div>

          <form method="get" className="mb-6 grid gap-4 rounded-[16px] border border-[#ece7de] bg-[#fcfaf6] p-4 md:grid-cols-[1fr_180px_auto]">
            <input
              name="search"
              defaultValue={slotSearch}
              placeholder="Cari tanggal, hari, atau menu"
              className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]"
            />
            <select name="slot" defaultValue={slotFilter} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]">
              <option value="all">Semua Slot</option>
              <option value="available">Slot Tersedia</option>
              <option value="disabled">Slot Nonaktif</option>
            </select>
            <button type="submit" className="rounded-[12px] bg-[#D35400] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#B94600]">
              Filter Slot
            </button>
          </form>

          <div className="space-y-4">
            {slots.map((slot) => (
              <div key={slot.id} className="rounded-[16px] border border-[#ece7de] bg-[#fcfaf6] p-5">
                <BatchSlotForm batchId={id} slot={slot} mode="edit" />
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[16px] border border-[#ece7de] bg-[#fffdf9] p-5">
            <h3 className="text-lg font-semibold text-[#2C3E50]">Tambah Slot Baru</h3>
            <div className="mt-4">
              <BatchSlotForm batchId={id} mode="create" defaultSortOrder={slots.length} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
