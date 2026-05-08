import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { StreakDay } from '@/types/app'

export function useStreak() {
  return useQuery({
    queryKey: ['streak'],
    queryFn: async (): Promise<StreakDay[]> => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return []

      const { data, error } = await supabase
        .from('streak_history')
        .select('date, problems_solved')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(365)

      if (error) throw error
      return (data ?? []) as StreakDay[]
    },
    staleTime: 60_000,
  })
}
