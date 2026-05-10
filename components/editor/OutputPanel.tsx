'use client'

import { useEditorStore } from '@/stores/editorStore'
import { JUDGE0_STATUS }  from '@/lib/constants'
import { cn }             from '@/lib/utils'
import {
  Terminal, Clock, Cpu,
  CheckCircle2, XCircle, Loader2,
} from 'lucide-react'

export function OutputPanel() {
  const { output, isRunning } = useEditorStore()

  if (isRunning) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Running your code...</span>
        </div>
      </div>
    )
  }

  if (!output) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-950">
        <div className="flex items-center gap-2 text-slate-600">
          <Terminal className="h-4 w-4" />
          <span className="text-sm">Click Run to execute your code</span>
        </div>
      </div>
    )
  }

  const statusInfo  = JUDGE0_STATUS[output.statusId] ??
                      { label: output.statusDesc, color: 'text-slate-400' }
  const isSuccess   = output.statusId === 3

  return (
    <div className="flex h-full flex-col bg-slate-950">

      {/* Status bar */}
      <div className="flex items-center justify-between
                      border-b border-slate-800 px-4 py-2">
        <div className="flex items-center gap-2">
          {isSuccess
            ? <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            : <XCircle      className="h-4 w-4 text-rose-400"    />
          }
          <span className={cn('text-sm font-medium', statusInfo.color)}>
            {statusInfo.label}
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          {output.timeMs   != null && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />{output.timeMs}ms
            </span>
          )}
          {output.memoryKb != null && (
            <span className="flex items-center gap-1">
              <Cpu className="h-3 w-3" />
              {Math.round(output.memoryKb / 1024)}MB
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 space-y-3">

        {output.compileOut && (
          <div>
            <p className="mb-1 text-xs font-medium text-rose-400">
              Compilation Error
            </p>
            <pre className="whitespace-pre-wrap rounded-lg border
                            border-rose-500/20 bg-rose-500/5 p-3
                            font-mono text-xs text-rose-300">
              {output.compileOut}
            </pre>
          </div>
        )}

        {output.stdout && (
          <div>
            <p className="mb-1 text-xs font-medium text-slate-400">
              Output
            </p>
            <pre className="whitespace-pre-wrap rounded-lg border
                            border-slate-800 bg-slate-900 p-3
                            font-mono text-xs text-slate-200">
              {output.stdout}
            </pre>
          </div>
        )}

        {output.stderr && (
          <div>
            <p className="mb-1 text-xs font-medium text-amber-400">
              Stderr
            </p>
            <pre className="whitespace-pre-wrap rounded-lg border
                            border-amber-500/20 bg-amber-500/5 p-3
                            font-mono text-xs text-amber-300">
              {output.stderr}
            </pre>
          </div>
        )}

        {isSuccess && !output.stdout && !output.stderr && (
          <p className="text-sm text-slate-500">
            Code ran successfully with no output.
          </p>
        )}

      </div>
    </div>
  )
}
