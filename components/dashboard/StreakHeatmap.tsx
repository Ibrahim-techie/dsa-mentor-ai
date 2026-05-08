import { format, subDays, eachDayOfInterval } from 'date-fns'

interface Props {
  data: { date: string; problems_solved: number }[]
}

function intensity(count: number) {
  if (count === 0) return 'bg-slate-800'
  if (count === 1) return 'bg-indigo-900'
  if (count <= 3)  return 'bg-indigo-700'
  if (count <= 6)  return 'bg-indigo-500'
  return 'bg-indigo-400'
}

export function StreakHeatmap({ data }: Props) {
  const today = new Date()
  const days  = eachDayOfInterval({ start: subDays(today, 89), end: today })
  const map   = new Map(data.map((d) => [d.date, d.problems_solved]))

  const weeks: Date[][] = []
  let week: Date[] = []
  days.forEach((d, i) => {
    week.push(d)
    if (week.length === 7 || i === days.length - 1) {
      weeks.push(week)
      week = []
    }
  })

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="mb-4 text-base font-medium text-white">
        Activity — Last 90 Days
      </h3>
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((wk, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            {wk.map((day) => {
              const key   = format(day, 'yyyy-MM-dd')
              const count = map.get(key) ?? 0
              return (
                <div
                  key={key}
                  title={`${format(day, 'MMM d')}: ${count} solved`}
                  className={`h-3 w-3 rounded-sm ${intensity(count)}
                              transition-colors hover:ring-1 hover:ring-indigo-400`}
                />
              )
            })}
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
        <span>Less</span>
        {['bg-slate-800','bg-indigo-900','bg-indigo-700','bg-indigo-500','bg-indigo-400'].map((c) => (
          <div key={c} className={`h-3 w-3 rounded-sm ${c}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  )
}
