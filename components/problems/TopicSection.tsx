'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { ProblemRow } from './ProblemRow'
import type { Problem, Submission } from '@/types/app'

interface Props {
  topic:       string
  problems:    Problem[]
  submissions: Submission[]
}

export function TopicSection({ topic, problems, submissions }: Props) {
  const [open, setOpen] = useState(true)

  const solved = problems.filter((p) =>
    submissions.find((s) => s.problem_id === p.id && s.status === 'solved')
  ).length

  const complete = solved === problems.length && problems.length > 0

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between
                   bg-slate-900 px-4 py-3 transition-colors hover:bg-slate-800/50"
      >
        <div className="flex items-center gap-3">
          {open
            ? <ChevronDown  className="h-4 w-4 text-slate-500" />
            : <ChevronRight className="h-4 w-4 text-slate-500" />
          }
          <span className="font-medium text-white">{topic}</span>
          {complete && <span className="text-xs text-cyan-400">✓ Complete</span>}
        </div>
        <span className="text-sm text-slate-500">{solved}/{problems.length}</span>
      </button>

      {open && (
        <div className="space-y-1.5 px-3 py-2">
          {problems.map((p) => (
            <ProblemRow
              key={p.id}
              problem={p}
              submission={submissions.find((s) => s.problem_id === p.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
