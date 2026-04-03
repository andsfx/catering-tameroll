'use client'

import type { ReactNode } from 'react'
import { useFormStatus } from 'react-dom'

type SubmitButtonProps = {
  idleText: string
  pendingText: string
  className?: string
  children?: ReactNode
}

export default function SubmitButton({ idleText, pendingText, className = '', children }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-[12px] px-5 py-3 text-sm font-bold text-white transition ${
        pending ? 'scale-[0.98] cursor-wait opacity-85' : 'hover:-translate-y-0.5'
      } ${className}`}
    >
      <span
        className={`h-4 w-4 rounded-full border-2 border-white/40 border-t-white transition ${
          pending ? 'animate-spin' : 'hidden'
        }`}
      />
      {pending ? pendingText : idleText}
      {children}
    </button>
  )
}
