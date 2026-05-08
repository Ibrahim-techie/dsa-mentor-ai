import { Progress } from '@/components/ui/progress'

interface Props {
  submissions: Array<{ problems: { topic_name: string } | null }>
  problems:    Array<{ topic_name: string; difficulty: string }>
}

export function TopicProgress({ submissions, problems }: Props) {
  const solvedByTopic = submissions.reduce<Record<string, number>>((acc, s) => {
    const t = s.problems?.topic_name
    if (t) acc[t] = (acc[t] ?? 0) + 1
    return acc
  }, {})

  const totalByTopic = problems.reduce<Record<string, number>>((acc, p) => {
    acc[p.topic_name] = (acc[p.topic_name] ?? 0) + 1
    return acc
  }, {})

  const rows = Object.entries(totalByTopic)
    .map(([topic, total]) => ({
      topic, total,
      solved: solvedByTopic[topic] ?? 0,
      pct: Math.round(((solvedByTopic[topic] ?? 0) / total) * 100),
    }))
    .sort((a, b) => b.pct - a.pct)
    .slice(0, 8)

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="mb-4 text-base font-medium text-white">Topic Progress</h3>
      <div className="space-y-3">
        {rows.length === 0 ? (
          <p className="text-sm text-slate-500">No progress yet — start solving!</p>
        ) : (
          rows.map(({ topic, total, solved, pct }) => (
            <div key={topic}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm text-slate-300">{topic}</span>
                <span className="text-xs text-slate-500">{solved}/{total}</span>
              </div>
              <Progress value={pct} className="h-1.5 bg-slate-800" />
            </div>
          ))
        )}
      </div>
    </div>
  )
}
