import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { redis, keys } from '@/lib/redis'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = request.headers.get('authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const dirtyIds = await redis.smembers(keys.dirty)
  if (dirtyIds.length === 0) {
    return NextResponse.json({ flushed: 0 })
  }

  const supabase = createRouteHandlerClient({ cookies })
  let flushed = 0
  const failed: string[] = []

  for (const id of dirtyIds) {
    const [views, likes, dislikes] = await redis.mget<(number | string | null)[]>(
      keys.views(id),
      keys.likes(id),
      keys.dislikes(id),
    )

    const { error } = await supabase
      .from('articles')
      .update({
        views: Math.max(0, Number(views ?? 0)),
        thumbup: Math.max(0, Number(likes ?? 0)),
        thumbdown: Math.max(0, Number(dislikes ?? 0)),
      })
      .eq('id', Number(id))

    if (error) {
      failed.push(id)
      continue
    }

    await redis.srem(keys.dirty, id)
    flushed++
  }

  return NextResponse.json({ flushed, failed })
}
