import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/auth/admin-session'
import { getJoinRequests, toJoinRequestsCsv } from '@/lib/data/join-requests'

export async function GET(request: Request) {
  const session = await getAdminSession()

  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  const { searchParams } = new URL(request.url)
  const status = (searchParams.get('status') || 'all') as 'all' | 'new' | 'verified' | 'rejected' | 'waitlisted'
  const search = searchParams.get('search') || ''
  const sort = (searchParams.get('sort') || 'newest') as 'newest' | 'oldest'

  const rows = await getJoinRequests({ status, search, sort })
  const csv = toJoinRequestsCsv(rows)

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="join-requests-${status}-${sort}.csv"`,
    },
  })
}
