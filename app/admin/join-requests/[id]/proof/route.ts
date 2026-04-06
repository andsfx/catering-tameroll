import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth/admin-session'
import { getJoinRequestById, getPaymentProofSignedUrl } from '@/lib/data/join-requests'

type Props = {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: Props) {
  const session = await getAdminSession()

  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const requestRecord = await getJoinRequestById(id)

  if (!requestRecord) {
    return NextResponse.json({ message: 'Join request not found' }, { status: 404 })
  }

  const signedUrl = await getPaymentProofSignedUrl(requestRecord.payment_proof_url)
  const extension = requestRecord.payment_proof_url.split('.').pop()?.toLowerCase() || ''
  const fileType = extension === 'pdf' ? 'pdf' : ['jpg', 'jpeg', 'png', 'webp'].includes(extension) ? 'image' : 'unknown'

  return NextResponse.json({
    signedUrl,
    fileType,
    fileName: requestRecord.payment_proof_url.split('/').pop() || 'payment-proof',
  })
}
