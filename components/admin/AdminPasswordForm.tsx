'use client'

import { useFormState } from 'react-dom'
import { changeAdminPassword } from '@/app/admin/settings/actions'
import FormNotice from '@/components/admin/FormNotice'
import SubmitButton from '@/components/admin/SubmitButton'
import { emptyAdminFormState } from '@/lib/forms/admin-form-state'

export default function AdminPasswordForm() {
  const [state, action] = useFormState(changeAdminPassword, emptyAdminFormState)

  return (
    <form action={action} className="space-y-5">
      <FormNotice error={state.error} success={state.success} />
      <div>
        <label htmlFor="currentPassword" className="mb-2 block text-sm font-semibold text-[#2C3E50]">
          Password Saat Ini
        </label>
        <input id="currentPassword" name="currentPassword" type="password" className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
      </div>
      <div>
        <label htmlFor="newPassword" className="mb-2 block text-sm font-semibold text-[#2C3E50]">
          Password Baru
        </label>
        <input id="newPassword" name="newPassword" type="password" className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
        <p className="mt-2 text-xs text-charcoal-500">Minimal 8 karakter.</p>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-[#2C3E50]">
          Konfirmasi Password Baru
        </label>
        <input id="confirmPassword" name="confirmPassword" type="password" className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]" />
      </div>
      <SubmitButton idleText="Simpan Password Baru" pendingText="Menyimpan Password..." className="bg-[#D35400] hover:bg-[#B94600]" />
    </form>
  )
}
