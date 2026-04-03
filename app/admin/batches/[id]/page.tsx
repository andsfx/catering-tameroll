import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminSession } from '@/lib/auth/admin-session'
import BatchEditForm from '@/components/admin/BatchEditForm'
import BatchSlotForm from '@/components/admin/BatchSlotForm'
import { getBatchById } from '@/lib/data/batches'
import { getBatchSlots } from '@/lib/data/batch-slots'

type Props = {
  params: Promise<{ id: string }>
}

export default async function AdminBatchDetailPage({ params }: Props) {
  await requireAdminSession()
  const { id } = await params
  const [batch, slots] = await Promise.all([getBatchById(id), getBatchSlots(id)])

  if (!batch) {
    notFound()
  }

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

        <div className="rounded-[18px] border border-[#ece7de] bg-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
          <div className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D35400]">
              Slot Menu Batch
            </p>
            <h2 className="mt-2 font-serif text-[1.75rem] leading-tight tracking-[-0.02em] text-[#2C3E50]">
              CRUD Slot Menu
            </h2>
          </div>

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
