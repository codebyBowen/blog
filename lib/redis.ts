import { Redis } from '@upstash/redis'

export const redis = Redis.fromEnv()

export const keys = {
  views: (id: number | string) => `article:${id}:views`,
  likes: (id: number | string) => `article:${id}:likes`,
  dislikes: (id: number | string) => `article:${id}:dislikes`,
  viewDedup: (id: number | string, voter: string) => `view:${id}:${voter}`,
  vote: (id: number | string, voter: string) => `vote:${id}:${voter}`,
  dirty: 'articles:dirty',
}

export const VIEW_DEDUP_TTL_SECONDS = 60 * 60 * 6
