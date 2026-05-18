import { NextResponse } from 'next/server'
import { readCounters } from '@/lib/counters'

export const dynamic = 'force-dynamic'

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const articleId = Number(params.id)
  if (!Number.isFinite(articleId)) {
    return NextResponse.json({ error: 'Invalid article id' }, { status: 400 })
  }

  const counters = await readCounters(articleId)
  return NextResponse.json(counters)
}
