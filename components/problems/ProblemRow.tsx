'use client'

import Link from 'next/link'
import { Star, ExternalLink } from 'lucide-react'
import { DifficultyBadge } from './DifficultyBadge'
import { useUpsertSubmission } from '@/hooks/useSubmissions'
import { cn } from '@/lib/utils'
import { isDifficulty } from '@/lib/constants'
import type { Problem, Submission } from '@/types/app'

interface Props {
  problem:    Problem
  submission: Submission | undefined
}

export function ProblemRow({ problem, submission }: Props) {
  const { mutate: upsert, isPending } = useUpsertSubmission()

  const isSolved    = submission?.status === 'solved'
  const isFavourite = submission?.is_favourite ?? false

  const handleToggleSolved = () =>
    upsert({ problem_id: problem.id, status: isSolved ? 'todo' : 'solved', is_favourite: isFavourite })

  const handleToggleFavourite = (e: React.MouseEvent) => {
    e.stopPropagation()
    upsert({ problem_id: problem.id, status: submission?.status ?? 'todo', is_favourite: !isFavourite })
  }

  return (
    <div className={cn(
      'flex items-center gap-4 rounded-lg border px-4 py-3 transition-colors',
      isSolved
        ? 'border-cyan-500/10 bg-cyan-500/5'
        : 'border-slate-800 bg-slate-900 hover:border-slate-700'
    )}>
      {/* Checkbox */}
      <button
        onClick={handleToggleSolved}
        disabled={isPending}
        aria-label={isSolved ? 'Mark unsolved' : 'Mark solved'}
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors',
          isSolved
            ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
            : 'border-slate-600 hover:border-indigo-500'
        )}
      >
        {isSolved && (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24"
               stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Title */}
      <Link
        href={`/problems/${problem.id}`}
        className={cn(
          'min-w-0 flex-1 truncate text-sm font-medium transition-colors',
          isSolved ? 'text-slate-400 line-through' : 'text-white hover:text-indigo-400'
        )}
      >
        {problem.title}
        {problem.is_must_do && (
          <span className="ml-2 text-xs text-amber-400">★ Must Do</span>
        )}
      </Link>

      {isDifficulty(problem.difficulty) && (
        <DifficultyBadge difficulty={problem.difficulty} />
      )}

      <span className="hidden w-28 truncate text-xs text-slate-500 md:block">
        {problem.topic_name}
      </span>

      <span className="hidden w-20 truncate text-xs text-slate-500 lg:block">
        {problem.platform}
      </span>

      {problem.link && (
        <a href={problem.link} target="_blank" rel="noopener noreferrer"
           onClick={(e) => e.stopPropagation()}
           className="text-slate-600 transition-colors hover:text-indigo-400"
           aria-label="Open on platform">
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      )}

      <button
        onClick={handleToggleFavourite}
        disabled={isPending}
        aria-label={isFavourite ? 'Remove favourite' : 'Add favourite'}
        className={cn(
          'transition-colors',
          isFavourite ? 'text-amber-400' : 'text-slate-600 hover:text-amber-400'
        )}
      >
        <Star className="h-4 w-4" fill={isFavourite ? 'currentColor' : 'none'} />
      </button>
    </div>
  )
}
