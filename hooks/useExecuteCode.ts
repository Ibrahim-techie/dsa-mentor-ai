'use client'

import { useMutation }    from '@tanstack/react-query'
import { toast }          from 'sonner'
import { useEditorStore } from '@/stores/editorStore'
import type { ApiResponse, ExecutionResult } from '@/types/app'

export function useExecuteCode() {
  const { setOutput, setIsRunning, saveDraft } = useEditorStore()

  return useMutation({
    mutationFn: async (payload: {
      problem_id:  string
      code:        string
      language_id: number
      stdin?:      string
    }): Promise<ExecutionResult> => {
      const res = await fetch('/api/execute', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      const json: ApiResponse<ExecutionResult> = await res.json()
      if (json.error) throw new Error(json.error)
      return json.data!
    },

    onMutate: () => {
      setIsRunning(true)
      setOutput(null)
    },

    onSuccess: (result, variables) => {
      setOutput(result)
      saveDraft(variables.problem_id)
      if (result.statusId === 3) {
        toast.success('Code ran successfully ✓')
      } else {
        toast.error(result.statusDesc)
      }
    },

    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Execution failed')
    },

    onSettled: () => {
      setIsRunning(false)
    },
  })
}
