import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminSession } from '@/lib/auth/admin-session'
import { getBatchById } from '@/lib/data/batches'

type Props = {
  params: Promise<{ id: string }>
}

export default async function AdminBatchDetailPage({ params }: Props) {
  await requireAdminSession()
  const { id } = await params
  const batch = await getBatchById(id)

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
          <Link href="/admin" className="rounded-[12px] border border-[#2C3E50] px-4 py-2 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#2C3E50] hover:text-white">
            Kembali
          </Link>
        </div>

        <div className="rounded-[18px] border border-[#ece7de] bg-white p-8 shadow-[0_18px_48px_rgba(0,0,0,0.08)]">
          <form action={async (formData) => {
            'use server'
            const { updateBatchAction } = await import('./actions')
            await updateBatchAction(id, undefined, formData)
          }} className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Nama Batch</label>
              <input name="name" defaultValue={batch.name} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Status</label>
              <select name="status" defaultValue={batch.status} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]">
                <option value="open">open</option>
                <option value="running">running</option>
                <option value="closed">closed</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Kuota Tersisa</label>
              <input name="remainingQuota" defaultValue={batch.remaining_quota ?? ''} type="number" className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Deadline Join</label>
              <input name="deadlineJoin" defaultValue={batch.deadline_join ?? ''} type="date" className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Batch Berikutnya Dibuka</label>
              <input name="nextBatchOpen" defaultValue={batch.next_batch_open ?? ''} type="date" className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Label Batch Berikutnya</label>
              <input name="nextBatchLabel" defaultValue={batch.next_batch_label ?? ''} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Catatan</label>
              <textarea name="notes" defaultValue={batch.notes ?? ''} rows={4} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
            </div>

            <label className="md:col-span-2 flex items-center gap-3 rounded-[12px] border border-[#ece7de] bg-[#faf9f6] px-4 py-3 text-sm font-semibold text-[#2C3E50]">
              <input type="checkbox" name="isActive" defaultChecked={batch.is_active} className="h-4 w-4" />
              Jadikan batch aktif yang tampil di frontend
            </label>

            <div className="md:col-span-2">
              <button type="submit" className="rounded-[12px] bg-[#D35400] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#B94600]">
                Simpan Perubahan Batch
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
