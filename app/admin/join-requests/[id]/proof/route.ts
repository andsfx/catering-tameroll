import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth/admin-session'
import { getJoinRequestById, getPaymentProofSignedUrl } from '@/lib/data/join-requests'

type Props = {
  params: Promise<{ id: string }>
}

export async function GET(request: Request, { params }: Props) {
  const session = await getAdminSession()

  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  const { id } = await params
  const requestRecord = await getJoinRequestById(id)

  if (!requestRecord) {
    return NextResponse.redirect(new URL('/admin/join-requests', request.url))
  }

  const signedUrl = await getPaymentProofSignedUrl(requestRecord.payment_proof_url)
  return NextResponse.redirect(signedUrl)
}
