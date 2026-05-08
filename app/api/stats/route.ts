import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { ApiResponse, UserStats } from '@/types/app'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json<ApiResponse<null>>(
      { data: null, error: 'Unauthorized' }, { status: 401 }
    )

    const { data, error } = await supabase
      .from('user_stats').select('*').eq('user_id', user.id).single()
    if (error) throw error

    return NextResponse.json<ApiResponse<UserStats>>({
      data: data as UserStats, error: null,
    })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: 'Failed to fetch stats' }, { status: 500 }
    )
  }
}
