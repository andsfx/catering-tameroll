'use client'

import { useFormState } from 'react-dom'
import { loginAdmin } from '@/app/admin/login/actions'
import FormNotice from '@/components/admin/FormNotice'
import SubmitButton from '@/components/admin/SubmitButton'
import { emptyAdminFormState } from '@/lib/forms/admin-form-state'

export default function AdminLoginForm() {
  const [state, action] = useFormState(loginAdmin, emptyAdminFormState)

  return (
    <form action={action} className="space-y-5">
      <FormNotice error={state.error} />
      <div>
        <label htmlFor="username" className="mb-2 block text-sm font-semibold text-[#2C3E50]">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]"
          placeholder="admin"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#2C3E50]">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]"
          placeholder="Masukkan password admin"
        />
      </div>
      <SubmitButton
        idleText="Login"
        pendingText="Memproses Login..."
        className="w-full bg-[#D35400] hover:bg-[#B94600]"
      />
    </form>
  )
}
