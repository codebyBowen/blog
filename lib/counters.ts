import { cookies, headers } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redis, keys } from './redis'

export interface Counters {
  views: number
  likes: number
  dislikes: number
}

export function getVoterKey(): string {
  const h = headers()
  const fwd = h.get('x-forwarded-for')
  const ip = fwd?.split(',')[0]?.trim() || h.get('x-real-ip') || 'anon'
  return ip
}

async function loadFromDb(articleId: number | string) {
  const supabase = createServerComponentClient({ cookies })
  const { data } = await supabase
    .from('articles')
    .select('views, thumbup, thumbdown')
    .eq('id', articleId)
    .single()
  return {
    views: Number(data?.views ?? 0),
    likes: Number(data?.thumbup ?? 0),
    dislikes: Number(data?.thumbdown ?? 0),
  }
}

export async function ensureSeeded(articleId: number | string): Promise<Counters> {
  const [v, l, d] = await redis.mget<(number | string | null)[]>(
    keys.views(articleId),
    keys.likes(articleId),
    keys.dislikes(articleId),
  )

  if (v !== null && l !== null && d !== null) {
    return { views: Number(v), likes: Number(l), dislikes: Number(d) }
  }

  const db = await loadFromDb(articleId)
  const pipe = redis.pipeline()
  if (v === null) pipe.set(keys.views(articleId), db.views, { nx: true })
  if (l === null) pipe.set(keys.likes(articleId), db.likes, { nx: true })
  if (d === null) pipe.set(keys.dislikes(articleId), db.dislikes, { nx: true })
  await pipe.exec()

  return db
}

export async function readCounters(articleId: number | string): Promise<Counters> {
  return ensureSeeded(articleId)
}

export async function markDirty(articleId: number | string) {
  await redis.sadd(keys.dirty, String(articleId))
}
