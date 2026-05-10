import { notFound, redirect } from 'next/navigation'
import { createClient }       from '@/lib/supabase/server'
import Link                   from 'next/link'
import { ArrowLeft }          from 'lucide-react'
import { DifficultyBadge }    from '@/components/problems/DifficultyBadge'
import { ProblemEditorPanel } from '@/components/editor/ProblemEditorPanel'
import { isDifficulty }       from '@/lib/constants'
import type { Problem }       from '@/types/app'

interface Props {
  params: Promise<{ id: string }>  // Next.js 16: params is a Promise
}

export default async function ProblemDetailPage({ params }: Props) {
  const { id }   = await params   // must await in Next.js 16
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: problem } = await supabase
    .from('problems')
    .select('*')
    .eq('id', id)
    .single<Problem>()

  if (!problem) notFound()

  const { data: submission } = await supabase
    .from('submissions')
    .select('status, code, language')
    .eq('user_id', user.id)
    .eq('problem_id', id)
    .maybeSingle()

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col">

      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between
                      border-b border-slate-800 bg-slate-950 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link
            href="/problems"
            className="flex items-center gap-1.5 text-sm text-slate-400
                       transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Problems
          </Link>
          <span className="text-slate-700">/</span>
          <span className="text-sm font-medium text-white">
            {problem.title}
          </span>
        </div>
        {isDifficulty(problem.difficulty) && (
          <DifficultyBadge difficulty={problem.difficulty} />
        )}
      </div>

      {/* Split view */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: description — hidden on mobile */}
        <div className="hidden w-[45%] shrink-0 overflow-y-auto
                        border-r border-slate-800 bg-slate-950 p-6
                        md:block">
          <ProblemDescription problem={problem} />
        </div>

        {/* Right: editor panel */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <ProblemEditorPanel
            problemId={problem.id}
            savedCode={submission?.code     ?? null}
            savedLanguage={submission?.language ?? null}
          />
        </div>

      </div>
    </div>
  )
}

function ProblemDescription({ problem }: { problem: Problem }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">{problem.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5
                           text-xs text-slate-400">
            {problem.topic_name}
          </span>
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5
                           text-xs text-slate-400">
            {problem.platform}
          </span>
          {problem.is_must_do && (
            <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5
                             text-xs text-amber-400">
              ★ Must Do
            </span>
          )}
        </div>
      </div>

      {problem.description ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
          {problem.description}
        </p>
      ) : (
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-500">
            Open this problem on{' '}
            {problem.link ? (
              <a
                href={problem.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 underline
                           transition-colors hover:text-indigo-300"
              >
                {problem.platform}
              </a>
            ) : (
              problem.platform
            )}{' '}
            to read the full description.
          </p>
        </div>
      )}
    </div>
  )
}
