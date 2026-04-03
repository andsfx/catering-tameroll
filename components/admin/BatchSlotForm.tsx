'use client'

import { useMemo } from 'react'
import { useFormState } from 'react-dom'
import { deleteBatchSlotAction, upsertBatchSlotAction } from '@/app/admin/batches/[id]/actions'
import FormNotice from '@/components/admin/FormNotice'
import SubmitButton from '@/components/admin/SubmitButton'
import type { BatchSlotRecord } from '@/lib/data/batch-slots'
import { emptyAdminFormState } from '@/lib/forms/admin-form-state'

type BatchSlotFormProps = {
  batchId: string
  slot?: BatchSlotRecord
  defaultSortOrder?: number
  mode: 'edit' | 'create'
}

export default function BatchSlotForm({ batchId, slot, defaultSortOrder = 0, mode }: BatchSlotFormProps) {
  const upsertAction = useMemo(() => upsertBatchSlotAction.bind(null, batchId), [batchId])
  const [state, formAction] = useFormState(upsertAction, emptyAdminFormState)

  return (
    <div>
      <form action={formAction} className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <FormNotice error={state.error} success={state.success} />
        </div>
        {slot ? <input type="hidden" name="slotId" value={slot.id} /> : null}
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Tanggal</label>
          <input name="date" type="date" defaultValue={slot?.date ?? ''} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Hari</label>
          <input name="dayName" defaultValue={slot?.day_name ?? ''} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Menu Utama</label>
          <input name="mainCourse" defaultValue={slot?.main_course ?? ''} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Side Dish</label>
          <input name="sideDish" defaultValue={slot?.side_dish ?? ''} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Extra</label>
          <input name="extra" defaultValue={slot?.extra ?? ''} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Image URL</label>
          <input name="imageUrl" defaultValue={slot?.image_url ?? ''} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Label</label>
          <input name="label" defaultValue={slot?.label ?? ''} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#2C3E50]">Sort Order</label>
          <input name="sortOrder" type="number" defaultValue={slot?.sort_order ?? defaultSortOrder} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
        </div>
        <label className="flex items-center gap-3 rounded-[12px] border border-[#ece7de] bg-white px-4 py-3 text-sm font-semibold text-[#2C3E50]">
          <input type="checkbox" name="isAvailable" defaultChecked={slot?.is_available ?? true} className="h-4 w-4" />
          Slot tersedia untuk referensi batch
        </label>
        <div className="md:col-span-2 flex flex-wrap gap-3">
          <SubmitButton
            idleText={mode === 'edit' ? 'Simpan Slot' : 'Tambah Slot Baru'}
            pendingText={mode === 'edit' ? 'Menyimpan Slot...' : 'Menambahkan Slot...'}
            className={mode === 'edit' ? 'bg-[#D35400] hover:bg-[#B94600]' : 'bg-[#2C3E50] hover:bg-[#223240]'}
          />
        </div>
      </form>

      {slot ? <DeleteSlotForm batchId={batchId} slotId={slot.id} /> : null}
    </div>
  )
}

function DeleteSlotForm({ batchId, slotId }: { batchId: string; slotId: string }) {
  const action = useMemo(() => deleteBatchSlotAction.bind(null, batchId), [batchId])
  const [state, formAction] = useFormState(action, emptyAdminFormState)

  return (
    <form action={formAction} className="mt-3 space-y-3">
      <input type="hidden" name="slotId" value={slotId} />
      <FormNotice error={state.error} success={state.success} />
      <SubmitButton idleText="Hapus Slot" pendingText="Menghapus Slot..." className="border border-red-200 bg-white text-red-600 hover:bg-red-50" />
    </form>
  )
}
