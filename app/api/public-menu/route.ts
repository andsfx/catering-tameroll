import { NextResponse } from 'next/server'
import { getPublicMenuPayload } from '@/lib/data/public-menu'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const payload = await getPublicMenuPayload()
    return NextResponse.json(payload)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load menu from Supabase'

    return NextResponse.json(
      {
        success: false,
        message,
        data: [],
      },
      { status: 500 }
    )
  }
}
