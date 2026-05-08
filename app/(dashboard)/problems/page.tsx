'use client'

import { useMemo } from 'react'
import { useProblems }           from '@/hooks/useProblems'
import { useSubmissions }        from '@/hooks/useSubmissions'
import { useProblemFilterStore } from '@/stores/problemFilterStore'
import { TopicSection }          from '@/components/problems/TopicSection'
import { ProblemFilters }        from '@/components/problems/ProblemFilters'
import { PageLoader }            from '@/components/shared/LoadingSpinner'
import { EmptyState }            from '@/components/shared/EmptyState'
import { BookOpen }              from 'lucide-react'

export default function ProblemsPage() {
  const filters = useProblemFilterStore()
  const { data: problems    = [], isLoading: loadingP } = useProblems()
  const { data: submissions = [], isLoading: loadingS } = useSubmissions()

  const filtered = useMemo(() => problems.filter((p) => {
    const q = filters.search.toLowerCase()
    return (
      (!q || p.title.toLowerCase().includes(q)) &&
      (filters.difficulty === 'all' || p.difficulty === filters.difficulty) &&
      (filters.topic      === 'all' || p.topic_name === filters.topic) &&
      (filters.platform   === 'all' || p.platform   === filters.platform) &&
      (!filters.showSolvedOnly     || submissions.some((s) => s.problem_id === p.id && s.status === 'solved')) &&
      (!filters.showFavouritesOnly || submissions.some((s) => s.problem_id === p.id && s.is_favourite))
    )
  }), [problems, submissions, filters])

  const byTopic = useMemo(() =>
    filtered.reduce<Record<string, typeof filtered>>((acc, p) => {
      ;(acc[p.topic_name] ??= []).push(p)
      return acc
    }, {}),
  [filtered])

  if (loadingP || loadingS) return <PageLoader />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Problems</h1>
        <p className="text-sm text-slate-400">
          {problems.length} problems · {Object.keys(byTopic).length} topics
        </p>
      </div>

      <ProblemFilters />

      {Object.keys(byTopic).length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No problems found"
          description="Try adjusting your filters or search query."
        />
      ) : (
        <div className="space-y-4">
          {Object.entries(byTopic).map(([topic, topicProblems]) => (
            <TopicSection
              key={topic}
              topic={topic}
              problems={topicProblems}
              submissions={submissions}
            />
          ))}
        </div>
      )}
    </div>
  )
}
