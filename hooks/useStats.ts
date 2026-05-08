import { useQuery } from '@tanstack/react-query'
import type { UserStats, ApiResponse } from '@/types/app'

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async (): Promise<UserStats | null> => {
      const res = await fetch('/api/stats')
      const json: ApiResponse<UserStats> = await res.json()
      if (json.error) throw new Error(json.error)
      return json.data
    },
    staleTime: 30_000,
  })
}
