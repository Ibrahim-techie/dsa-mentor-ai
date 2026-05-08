import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import type { ApiResponse, Submission } from '@/types/app'

const upsertSchema = z.object({
  problem_id: z.string().uuid(),
  status: z.enum(['todo', 'solved', 'attempted', 'skipped']),
  time_taken_minutes: z.number().int().positive().nullable().optional(),
  notes: z.string().max(2000).nullable().optional(),
  is_favourite: z.boolean().optional(),
})

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json<ApiResponse<null>>(
      { data: null, error: 'Unauthorized' }, { status: 401 }
    )

    const { data, error } = await supabase
      .from('submissions').select('*').eq('user_id', user.id)
    if (error) throw error

    return NextResponse.json<ApiResponse<Submission[]>>({
      data: data as Submission[], error: null,
    })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: 'Failed to fetch submissions' }, { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json<ApiResponse<null>>(
      { data: null, error: 'Unauthorized' }, { status: 401 }
    )

    const body = await request.json()
    const parsed = upsertSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json<ApiResponse<null>>(
      { data: null, error: parsed.error.issues[0]?.message ?? 'Invalid input' }, { status: 400 }
    )

    const { data, error } = await supabase
      .from('submissions')
      .upsert(
        { user_id: user.id, ...parsed.data },
        { onConflict: 'user_id,problem_id' }
      )
      .select()
      .single()
    if (error) throw error

    if (parsed.data.status === 'solved') {
      const today = new Date().toISOString().split('T')[0]
      await supabase.from('streak_history').upsert(
        { user_id: user.id, date: today, problems_solved: 1 },
        { onConflict: 'user_id,date' }
      )
    }

    return NextResponse.json<ApiResponse<Submission>>({
      data: data as Submission, error: null,
    })
  } catch {
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: 'Failed to save submission' }, { status: 500 }
    )
  }
}
