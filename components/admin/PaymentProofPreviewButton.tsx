'use client'

import { useEffect, useState } from 'react'

type ProofResponse = {
  signedUrl: string
  fileType: 'image' | 'pdf' | 'unknown'
  fileName: string
}

type PaymentProofPreviewButtonProps = {
  requestId: string
  requesterName: string
  className?: string
}

export default function PaymentProofPreviewButton({
  requestId,
  requesterName,
  className = 'inline-flex items-center justify-center rounded-[12px] border border-[#2C3E50] px-4 py-2.5 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#2C3E50] hover:text-white',
}: PaymentProofPreviewButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [proof, setProof] = useState<ProofResponse | null>(null)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  async function openPreview() {
    setOpen(true)
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`/admin/join-requests/${requestId}/proof`, {
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error('Gagal memuat preview bukti pembayaran.')
      }

      const payload = (await response.json()) as ProofResponse
      setProof(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat preview bukti pembayaran.')
      setProof(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button type="button" onClick={openPreview} className={className}>
        Lihat Bukti Pembayaran
      </button>

      {open ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6">
          <button
            type="button"
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Tutup preview bukti pembayaran"
          />

          <div className="relative z-10 w-full max-w-5xl rounded-[18px] border border-[#ece7de] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
            <div className="flex items-start justify-between gap-4 border-b border-[#ece7de] px-5 py-4 sm:px-6">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D35400]">
                  Preview Bukti Pembayaran
                </p>
                <h2 className="mt-2 text-lg font-semibold text-[#2C3E50]">{requesterName}</h2>
              </div>
              <div className="flex items-center gap-3">
                {proof ? (
                  <span className="rounded-full bg-[#faf9f6] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal-500">
                    {proof.fileType === 'pdf' ? 'PDF' : proof.fileType === 'image' ? 'Image' : 'File'}
                  </span>
                ) : null}
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-[12px] border border-[#2C3E50] px-3 py-2 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#2C3E50] hover:text-white"
                >
                  Tutup
                </button>
              </div>
            </div>

            <div className="max-h-[calc(100vh-8rem)] overflow-y-auto px-5 py-5 sm:px-6">
              {loading ? (
                <div className="flex min-h-[420px] items-center justify-center rounded-[16px] border border-[#ece7de] bg-[#faf9f6]">
                  <div className="flex items-center gap-3 text-sm font-semibold text-charcoal-600">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#D35400]/30 border-t-[#D35400]" />
                    Memuat preview bukti pembayaran...
                  </div>
                </div>
              ) : error ? (
                <div className="space-y-4 rounded-[16px] border border-rose-200 bg-rose-50 p-5 text-sm text-rose-700">
                  <p>{error}</p>
                  <button
                    type="button"
                    onClick={openPreview}
                    className="rounded-[12px] bg-[#2C3E50] px-4 py-2.5 font-semibold text-white transition hover:bg-[#223240]"
                  >
                    Coba Lagi
                  </button>
                </div>
              ) : proof ? (
                <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm text-charcoal-500">{proof.fileName}</p>
                      <a
                        href={proof.signedUrl}
                        target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-[12px] border border-[#2C3E50] px-4 py-2.5 text-sm font-semibold text-[#2C3E50] transition hover:bg-[#2C3E50] hover:text-white"
                    >
                      Buka di tab baru
                    </a>
                  </div>

                  <div className="overflow-hidden rounded-[16px] border border-[#ece7de] bg-[#faf9f6]">
                    {proof.fileType === 'image' ? (
                      <div className="flex items-center justify-center bg-white p-4">
                        <img src={proof.signedUrl} alt={`Bukti pembayaran ${requesterName}`} className="max-h-[70vh] w-full rounded-[12px] object-contain" />
                      </div>
                    ) : proof.fileType === 'pdf' ? (
                      <iframe
                        src={proof.signedUrl}
                        title={`Preview bukti pembayaran ${requesterName}`}
                        className="h-[70vh] w-full bg-white"
                      />
                    ) : (
                      <div className="flex min-h-[420px] flex-col items-center justify-center gap-4 px-6 text-center text-sm text-charcoal-600">
                        <p>Format file ini tidak bisa dipreview langsung di modal.</p>
                        <a
                          href={proof.signedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-[12px] bg-[#D35400] px-4 py-2.5 font-semibold text-white transition hover:bg-[#B94600]"
                        >
                          Buka di tab baru
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
