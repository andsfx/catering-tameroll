'use client'

import { useMemo } from 'react'
import { useFormState } from 'react-dom'
import { updateBatchAction } from '@/app/admin/batches/[id]/actions'
import FormNotice from '@/components/admin/FormNotice'
import SubmitButton from '@/components/admin/SubmitButton'
import type { BatchRecord } from '@/lib/data/batches'
import { emptyAdminFormState } from '@/lib/forms/admin-form-state'

export default function BatchEditForm({ batch }: { batch: BatchRecord }) {
  const action = useMemo(() => updateBatchAction.bind(null, batch.id), [batch.id])
  const [state, formAction] = useFormState(action, emptyAdminFormState)

  return (
    <form action={formAction} className="grid gap-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <FormNotice error={state.error} success={state.success} />
      </div>
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
        <SubmitButton idleText="Simpan Perubahan Batch" pendingText="Menyimpan Batch..." className="bg-[#D35400] hover:bg-[#B94600]" />
      </div>
    </form>
  )
}
