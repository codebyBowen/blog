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
    const image = formData.get('image') as File
    const audio = formData.get('audio') as File

    // 验证会话
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 处理文件上传
    let imagePath = null
    let audioPath = null

    if (image) {
      const { data, error } = await supabase.storage
        .from("images")
        .upload(`public/${Date.now()}_${image.name}`, image)
      if (error) throw error
      imagePath = data.path
    }

    if (audio) {
      const { data, error } = await supabase.storage
        .from("audio")
        .upload(`public/${Date.now()}_${audio.name}`, audio)
      if (error) throw error
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
        tag
      })
      .select()
      .single()

    if (error) throw error

    return Response.json({ data })
  } catch (error) {
    console.error('API Error:', error)
    return Response.json(
      { error: 'Internal Server Error' }, 
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
      
      // Calculate offset
      const from = (page - 1) * pageSize
      const to = from + pageSize - 1
      
      let query = supabase
        .from("articles")
        .select("*", { count: 'exact' })
        .order("created_at", { ascending: false })
        .range(from, to)
      
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