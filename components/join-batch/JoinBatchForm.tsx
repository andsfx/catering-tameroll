'use client'

import { useFormState } from 'react-dom'
import { submitJoinBatch } from '@/app/join-batch/actions'
import FormNotice from '@/components/admin/FormNotice'
import SubmitButton from '@/components/admin/SubmitButton'
import { emptyAdminFormState } from '@/lib/forms/admin-form-state'

export default function JoinBatchForm({
  batchName,
  batchStatusLabel,
}: {
  batchName: string
  batchStatusLabel: string
}) {
  const [state, action] = useFormState(submitJoinBatch, emptyAdminFormState)

  return (
    <form action={action} className="space-y-5 rounded-[18px] border border-[#ece7de] bg-white p-6 shadow-[0_18px_48px_rgba(0,0,0,0.06)] sm:p-8">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D35400]">
          Form Join Batch
        </p>
        <h2 className="mt-3 font-serif text-[1.9rem] leading-tight tracking-[-0.02em] text-[#2C3E50]">
          Konfirmasi Join {batchName}
        </h2>
        <p className="mt-3 text-[15px] leading-7 text-charcoal-600">
          Status batch saat ini <span className="font-semibold text-[#2C3E50]">{batchStatusLabel}</span>. Isi data berikut lalu upload bukti pembayaran. Admin akan menghubungi Anda via WhatsApp.
        </p>
      </div>

      <FormNotice error={state.error} success={state.success} />

      <div>
        <label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-[#2C3E50]">
          Nama Lengkap
        </label>
        <input id="fullName" name="fullName" className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" placeholder="Nama lengkap Anda" />
      </div>

      <div>
        <label htmlFor="phone" className="mb-2 block text-sm font-semibold text-[#2C3E50]">
          Nomor WhatsApp
        </label>
        <input id="phone" name="phone" className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" placeholder="08xxxxxxxxxx / 628xxxxxxxxxx" />
      </div>

      <div>
        <label htmlFor="paymentProof" className="mb-2 block text-sm font-semibold text-[#2C3E50]">
          Upload Bukti Pembayaran
        </label>
        <input id="paymentProof" name="paymentProof" type="file" accept="image/jpeg,image/png,application/pdf" className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-[10px] file:border-0 file:bg-[#D35400] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#B94600]" />
        <p className="mt-2 text-xs text-charcoal-500">Format JPG, PNG, atau PDF. Maksimal 5MB.</p>
      </div>

      <div>
        <label htmlFor="notes" className="mb-2 block text-sm font-semibold text-[#2C3E50]">
          Catatan (opsional)
        </label>
        <textarea id="notes" name="notes" rows={4} className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" placeholder="Tambahkan catatan jika diperlukan" />
      </div>

      <SubmitButton idleText="Kirim Pendaftaran Join Batch" pendingText="Mengirim Pendaftaran..." className="w-full bg-[#D35400] hover:bg-[#B94600]" />
    </form>
  )
}
