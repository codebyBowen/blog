import { cache } from 'react'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Article } from '@/types/article'

export const getRecentArticles = cache(async (currentArticleId: string) => {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: articles, error } = await supabase
    .from('articles')
    .select('id, title, created_at')
    .neq('id', currentArticleId)
    .order('created_at', { ascending: false })
    .limit(5)

  if (error) {
    console.error('Error fetching recent articles:', error)
    return []
  }

  return articles
})

// 其他文章相关的 actions 也可以放在这里
export const getArticle = cache(async (id: string): Promise<Article | null> => {
  const supabase = createServerComponentClient({ cookies })
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching article:", error)
    return null
  }
  return data
})