'use client'

type FormNoticeProps = {
  error?: string
  success?: string
}

export default function FormNotice({ error, success }: FormNoticeProps) {
  if (!error && !success) return null

  if (error) {
    return <div className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>
  }

  return <div className="rounded-[12px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{success}</div>
}
