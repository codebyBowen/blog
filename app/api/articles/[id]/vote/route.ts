import { NextResponse } from 'next/server'
import { redis, keys } from '@/lib/redis'
import { ensureSeeded, getVoterKey, markDirty } from '@/lib/counters'

export const dynamic = 'force-dynamic'

type VoteType = 'up' | 'down'

function counterKey(articleId: number, vote: VoteType) {
  return vote === 'up' ? keys.likes(articleId) : keys.dislikes(articleId)
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const articleId = Number(params.id)
  if (!Number.isFinite(articleId)) {
    return NextResponse.json({ error: 'Invalid article id' }, { status: 400 })
  }

  const body = (await request.json().catch(() => ({}))) as { vote?: VoteType }
  const vote = body.vote
  if (vote !== 'up' && vote !== 'down') {
    return NextResponse.json({ error: 'Invalid vote' }, { status: 400 })
  }

  await ensureSeeded(articleId)

  const voter = getVoterKey()
  const voteKey = keys.vote(articleId, voter)
  const existing = (await redis.get<VoteType>(voteKey)) ?? null

  let userVote: VoteType | null = vote

  if (existing === vote) {
    await redis.decr(counterKey(articleId, vote))
    await redis.del(voteKey)
    userVote = null
  } else if (existing && existing !== vote) {
    const pipe = redis.pipeline()
    pipe.decr(counterKey(articleId, existing))
    pipe.incr(counterKey(articleId, vote))
    pipe.set(voteKey, vote)
    await pipe.exec()
  } else {
    const pipe = redis.pipeline()
    pipe.incr(counterKey(articleId, vote))
    pipe.set(voteKey, vote)
    await pipe.exec()
  }

  await markDirty(articleId)

  const [likes, dislikes] = await redis.mget<(number | string | null)[]>(
    keys.likes(articleId),
    keys.dislikes(articleId),
  )

  return NextResponse.json({
    likes: Math.max(0, Number(likes ?? 0)),
    dislikes: Math.max(0, Number(dislikes ?? 0)),
    userVote,
  })
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const articleId = Number(params.id)
  if (!Number.isFinite(articleId)) {
    return NextResponse.json({ error: 'Invalid article id' }, { status: 400 })
  }

  const voter = getVoterKey()
  const userVote = (await redis.get<VoteType>(keys.vote(articleId, voter))) ?? null
  return NextResponse.json({ userVote })
}
