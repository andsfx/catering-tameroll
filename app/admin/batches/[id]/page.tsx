import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminSession } from '@/lib/auth/admin-session'
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
                <form action={async (formData) => {
                  'use server'
                  const { upsertBatchSlotAction } = await import('./actions')
                  await upsertBatchSlotAction(id, undefined, formData)
                }} className="grid gap-4 md:grid-cols-2">
                  <input type="hidden" name="slotId" value={slot.id} />
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Tanggal</label>
                    <input name="date" type="date" defaultValue={slot.date} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Hari</label>
                    <input name="dayName" defaultValue={slot.day_name} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Menu Utama</label>
                    <input name="mainCourse" defaultValue={slot.main_course ?? ''} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Side Dish</label>
                    <input name="sideDish" defaultValue={slot.side_dish ?? ''} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Extra</label>
                    <input name="extra" defaultValue={slot.extra ?? ''} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Image URL</label>
                    <input name="imageUrl" defaultValue={slot.image_url ?? ''} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Label</label>
                    <input name="label" defaultValue={slot.label ?? ''} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Sort Order</label>
                    <input name="sortOrder" type="number" defaultValue={slot.sort_order} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
                  </div>
                  <label className="flex items-center gap-3 rounded-[12px] border border-[#ece7de] bg-white px-4 py-3 text-sm font-semibold text-[#2C3E50]">
                    <input type="checkbox" name="isAvailable" defaultChecked={slot.is_available} className="h-4 w-4" />
                    Slot tersedia untuk referensi batch
                  </label>
                  <div className="md:col-span-2 flex flex-wrap gap-3">
                    <button type="submit" className="rounded-[12px] bg-[#D35400] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#B94600]">
                      Simpan Slot
                    </button>
                  </div>
                </form>
                <form action={async () => {
                  'use server'
                  const { deleteBatchSlotAction } = await import('./actions')
                  await deleteBatchSlotAction(id, slot.id)
                }} className="mt-3">
                  <button type="submit" className="rounded-[12px] border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50">
                    Hapus Slot
                  </button>
                </form>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[16px] border border-[#ece7de] bg-[#fffdf9] p-5">
            <h3 className="text-lg font-semibold text-[#2C3E50]">Tambah Slot Baru</h3>
            <form action={async (formData) => {
              'use server'
              const { upsertBatchSlotAction } = await import('./actions')
              await upsertBatchSlotAction(id, undefined, formData)
            }} className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Tanggal</label>
                <input name="date" type="date" className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Hari</label>
                <input name="dayName" className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Menu Utama</label>
                <input name="mainCourse" className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Side Dish</label>
                <input name="sideDish" className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Extra</label>
                <input name="extra" className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Image URL</label>
                <input name="imageUrl" className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Label</label>
                <input name="label" className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Sort Order</label>
                <input name="sortOrder" type="number" defaultValue={slots.length} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
              </div>
              <label className="flex items-center gap-3 rounded-[12px] border border-[#ece7de] bg-white px-4 py-3 text-sm font-semibold text-[#2C3E50]">
                <input type="checkbox" name="isAvailable" defaultChecked className="h-4 w-4" />
                Tandai slot sebagai tersedia
              </label>
              <div className="md:col-span-2">
                <button type="submit" className="rounded-[12px] bg-[#2C3E50] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#223240]">
                  Tambah Slot Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
