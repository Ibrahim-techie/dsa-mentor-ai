import { useQuery } from '@tanstack/react-query'
import type { Problem, ApiResponse } from '@/types/app'

interface Filters {
  topic?: string
  difficulty?: string
  platform?: string
}

export function useProblems(filters: Filters = {}) {
  return useQuery({
    queryKey: ['problems', filters],
    queryFn: async (): Promise<Problem[]> => {
      const params = new URLSearchParams()
      if (filters.topic      && filters.topic      !== 'all') params.set('topic', filters.topic)
      if (filters.difficulty && filters.difficulty !== 'all') params.set('difficulty', filters.difficulty)
      if (filters.platform   && filters.platform   !== 'all') params.set('platform', filters.platform)

      const res = await fetch(`/api/problems?${params}`)
      const json: ApiResponse<Problem[]> = await res.json()
      if (json.error) throw new Error(json.error)
      return json.data ?? []
    },
    staleTime: 5 * 60_000,
  })
}
