'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { Submission, ApiResponse } from '@/types/app'

export function useSubmissions() {
  return useQuery({
    queryKey: ['submissions'],
    queryFn: async (): Promise<Submission[]> => {
      const res = await fetch('/api/submissions')
      const json: ApiResponse<Submission[]> = await res.json()
      if (json.error) throw new Error(json.error)
      return json.data ?? []
    },
    staleTime: 30_000,
  })
}

export function useUpsertSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      problem_id: string
      status: string
      is_favourite?: boolean
      notes?: string | null
      time_taken_minutes?: number | null
    }): Promise<Submission> => {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json: ApiResponse<Submission> = await res.json()
      if (json.error) throw new Error(json.error)
      return json.data!
    },
    onMutate: async (incoming) => {
      await queryClient.cancelQueries({ queryKey: ['submissions'] })
      const previous = queryClient.getQueryData<Submission[]>(['submissions'])

      queryClient.setQueryData<Submission[]>(['submissions'], (old = []) => {
        const exists = old.find((s) => s.problem_id === incoming.problem_id)
        if (exists) {
          return old.map((s) =>
            s.problem_id === incoming.problem_id ? { ...s, ...incoming } : s
          )
        }
        return [
          ...old,
          {
            id: 'optimistic-' + Date.now(),
            user_id: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            is_favourite: false,
            notes: null,
            time_taken_minutes: null,
            ...incoming,
          } as Submission,
        ]
      })
      return { previous }
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['submissions'], context?.previous)
      toast.error('Failed to save. Please try again.')
    },
    onSuccess: (_data, variables) => {
      if (variables.status === 'solved') {
        toast.success('Problem marked as solved! 🎉')
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
      queryClient.invalidateQueries({ queryKey: ['stats'] })
      queryClient.invalidateQueries({ queryKey: ['streak'] })
    },
  })
}
