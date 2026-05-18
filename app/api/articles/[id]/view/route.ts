import { NextResponse } from 'next/server'
import { redis, keys, VIEW_DEDUP_TTL_SECONDS } from '@/lib/redis'
import { ensureSeeded, getVoterKey, markDirty } from '@/lib/counters'

export const dynamic = 'force-dynamic'

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const articleId = Number(params.id)
  if (!Number.isFinite(articleId)) {
    return NextResponse.json({ error: 'Invalid article id' }, { status: 400 })
  }

  await ensureSeeded(articleId)

  const voter = getVoterKey()
  const claimed = await redis.set(keys.viewDedup(articleId, voter), 1, {
    nx: true,
    ex: VIEW_DEDUP_TTL_SECONDS,
  })

  let views: number
  if (claimed) {
    views = await redis.incr(keys.views(articleId))
    await markDirty(articleId)
  } else {
    views = Number((await redis.get(keys.views(articleId))) ?? 0)
  }

  return NextResponse.json({ views, counted: Boolean(claimed) })
}
