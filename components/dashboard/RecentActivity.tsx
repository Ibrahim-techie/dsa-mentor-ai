import Link from 'next/link'
import { CheckCircle2, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Submission {
  id: string
  updated_at: string
  problems: { id: string; title: string; difficulty: string; topic_name: string } | null
}

const diffColor: Record<string, string> = {
  Easy:   'text-emerald-400',
  Medium: 'text-amber-400',
  Hard:   'text-rose-400',
}

export function RecentActivity({ submissions }: { submissions: Submission[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="mb-4 text-base font-medium text-white">Recent Solves</h3>
      {submissions.length === 0 ? (
        <p className="text-sm text-slate-500">
          No solves yet — mark your first problem as done!
        </p>
      ) : (
        <div className="space-y-2">
          {submissions.map((s) => (
            <div
              key={s.id}
              className="flex items-center gap-3 rounded-lg border
                         border-slate-800 bg-slate-800/50 px-4 py-3"
            >
              <CheckCircle2 className="h-4 w-4 shrink-0 text-cyan-400" />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/problems/${s.problems?.id}`}
                  className="block truncate text-sm font-medium text-white
                             transition-colors hover:text-indigo-400"
                >
                  {s.problems?.title ?? 'Unknown'}
                </Link>
                <p className="text-xs text-slate-500">
                  {s.problems?.topic_name} ·{' '}
                  <span className={diffColor[s.problems?.difficulty ?? ''] ?? 'text-slate-400'}>
                    {s.problems?.difficulty}
                  </span>
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1 text-xs text-slate-500">
                <Clock className="h-3 w-3" />
                {formatDate(s.updated_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
