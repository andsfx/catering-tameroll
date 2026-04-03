'use client'

import { useMemo } from 'react'
import { useFormState } from 'react-dom'
import { updateJoinRequestStatusAction } from '@/app/admin/join-requests/actions'
import FormNotice from '@/components/admin/FormNotice'
import SubmitButton from '@/components/admin/SubmitButton'
import { emptyAdminFormState } from '@/lib/forms/admin-form-state'

export default function JoinRequestStatusForm({
  requestId,
  currentStatus,
}: {
  requestId: string
  currentStatus: 'new' | 'verified' | 'rejected' | 'waitlisted'
}) {
  const action = useMemo(() => updateJoinRequestStatusAction.bind(null, requestId), [requestId])
  const [state, formAction] = useFormState(action, emptyAdminFormState)

  return (
    <form action={formAction} className="space-y-3">
      <FormNotice error={state.error} success={state.success} />
      <select
        name="status"
        defaultValue={currentStatus}
        className="w-full rounded-[12px] border border-[#ddd4c7] px-4 py-3 text-sm outline-none transition focus:border-[#D35400]"
      >
        <option value="new">new</option>
        <option value="verified">verified</option>
        <option value="rejected">rejected</option>
        <option value="waitlisted">waitlisted</option>
      </select>
      <SubmitButton idleText="Simpan Status Request" pendingText="Menyimpan Status..." className="w-full bg-[#D35400] hover:bg-[#B94600]" />
    </form>
  )
}
