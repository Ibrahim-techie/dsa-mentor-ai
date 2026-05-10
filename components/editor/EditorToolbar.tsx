'use client'

import { Play, Send, Loader2 }  from 'lucide-react'
import { Button }               from '@/components/ui/button'
import { useEditorStore }       from '@/stores/editorStore'
import { useExecuteCode }       from '@/hooks/useExecuteCode'
import { useUpsertSubmission }  from '@/hooks/useSubmissions'
import { toast }                from 'sonner'
import { cn }                   from '@/lib/utils'

interface Props { problemId: string }

export function EditorToolbar({ problemId }: Props) {
  const { code, languageId, isRunning, output } = useEditorStore()
  const { mutate: execute,  isPending: isExecuting  } = useExecuteCode()
  const { mutate: submit,   isPending: isSubmitting } = useUpsertSubmission()

  const isLoading = isRunning || isExecuting

  const handleRun = () => {
    if (!code.trim()) { toast.error('Write some code first!'); return }
    execute({ problem_id: problemId, code, language_id: languageId })
  }

  const handleSubmit = () => {
    if (!code.trim()) { toast.error('Write some code first!'); return }
    if (!output || output.statusId !== 3) {
      toast.error('Run your code first and make sure it passes.')
      return
    }
    submit({
      problem_id: problemId,
      status:     'solved',
      code,
      language:   String(languageId),
    })
  }

  return (
    <div className="flex items-center justify-between border-t
                    border-slate-800 bg-slate-900 px-4 py-3">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          onClick={handleRun}
          disabled={isLoading}
          className="bg-slate-700 text-white hover:bg-slate-600
                     disabled:opacity-50"
        >
          {isLoading
            ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            : <Play    className="mr-1.5 h-3.5 w-3.5 fill-current"  />
          }
          {isLoading ? 'Running...' : 'Run'}
        </Button>

        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={isSubmitting || isLoading}
          className={cn(
            'disabled:opacity-50 transition-colors',
            output?.statusId === 3
              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
              : 'bg-indigo-600  text-white hover:bg-indigo-500'
          )}
        >
          {isSubmitting
            ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
            : <Send    className="mr-1.5 h-3.5 w-3.5"               />
          }
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
      <span className="text-xs text-slate-600">Powered by Piston</span>
    </div>
  )
}
