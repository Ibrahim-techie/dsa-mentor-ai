import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { ApiResponse, Problem } from '@/types/app'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json<ApiResponse<null>>(
      { data: null, error: 'Unauthorized' }, { status: 401 }
    )

    const { searchParams } = new URL(request.url)
    const topic      = searchParams.get('topic')
    const difficulty = searchParams.get('difficulty')
    const platform   = searchParams.get('platform')

    let query = supabase
      .from('problems').select('*')
      .order('topic_name').order('difficulty')

    if (topic      && topic      !== 'all') query = query.eq('topic_name', topic)
    if (difficulty && difficulty !== 'all') query = query.eq('difficulty', difficulty)
    if (platform   && platform   !== 'all') query = query.eq('platform', platform)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json<ApiResponse<Problem[]>>({
      data: data as Problem[], error: null,
    })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: 'Failed to fetch problems' }, { status: 500 }
    )
  }
}
