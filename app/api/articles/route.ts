import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const markdownContent = formData.get('markdown_content') as string
    const tag = formData.get('tag') as string
    const visibility = (formData.get('visibility') as string) || 'public'
    const image = formData.get('image') as File
    const audio = formData.get('audio') as File

    // 验证会话
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 验证必填字段
    if (!title || !content || !markdownContent) {
      return Response.json(
        { error: 'Title and content are required' },
        { status: 400 }
      )
    }

    // 处理文件上传
    let imagePath = null
    let audioPath = null

    // 检查图片文件是否有效（非空文件）
    if (image && image.size > 0 && image.name) {
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`public/${Date.now()}_${image.name}`, image)
      if (error) {
        console.error('Image upload error:', error)
        throw new Error(`Image upload failed: ${error.message}`)
      }
      imagePath = data.path
    }

    // 检查音频文件是否有效（非空文件）
    if (audio && audio.size > 0 && audio.name) {
      const { data, error } = await supabase.storage
        .from("audio")
        .upload(`public/${Date.now()}_${audio.name}`, audio)
      if (error) {
        console.error('Audio upload error:', error)
        throw new Error(`Audio upload failed: ${error.message}`)
      }
      audioPath = data.path
    }

    // 创建文章
    const { data, error } = await supabase
      .from('articles')
      .insert({
        title,
        content,
        markdown_content: markdownContent,
        image_url: imagePath,
        audio_url: audioPath,
        user_id: session.user.id,
        tag,
        visibility
      })
      .select()
      .single()

    if (error) {
      console.error('Database insert error:', error)
      throw new Error(`Failed to create article: ${error.message}`)
    }

    return Response.json({ data })
  } catch (error) {
    console.error('API Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error'
    return Response.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
    const supabase = createRouteHandlerClient({ cookies })

    try {
      const { searchParams } = new URL(request.url)
      const category = searchParams.get('category')
      const page = parseInt(searchParams.get('page') || '1')
      const pageSize = parseInt(searchParams.get('pageSize') || '5')

      // Get current user session
      const { data: { session } } = await supabase.auth.getSession()
      const userId = session?.user?.id

      // Calculate offset
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1

      let query = supabase
        .from("articles")
        .select("*", { count: 'exact' })
        .order("created_at", { ascending: false })
        .range(from, to)

      // Apply visibility filter
      // Show: public articles + user's own private articles
      // Hide: unlisted articles (they're only accessible via direct link)
      if (userId) {
        query = query.or(`visibility.eq.public,and(visibility.eq.private,user_id.eq.${userId})`)
      } else {
        query = query.eq('visibility', 'public')
      }

      if (category) {
        query = query.eq('tag', category)
      }

      const { data, error, count } = await query
  
      if (error) {
        return NextResponse.json(
          { error: 'Failed to fetch articles' }, 
          { status: 500 }
        )
      }
  
      return NextResponse.json({
        data,
        metadata: {
          currentPage: page,
          pageSize,
          totalCount: count,
          totalPages: Math.ceil((count || 0) / pageSize)
        }
      })
    } catch (error) {
      console.error('API Error:', error)
      return NextResponse.json(
        { error: 'Internal Server Error' }, 
        { status: 500 }
      )
    }
}