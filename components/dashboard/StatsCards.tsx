import type { UserStats } from '@/types/app'

const getCards = (stats: UserStats | null) => [
  { label: 'Total Solved', value: stats?.total_solved ?? 0,  color: 'text-cyan-400',    border: 'border-cyan-400/20',    bg: 'bg-cyan-400/10'    },
  { label: 'Easy',         value: stats?.easy_solved ?? 0,   color: 'text-emerald-400', border: 'border-emerald-400/20', bg: 'bg-emerald-400/10' },
  { label: 'Medium',       value: stats?.medium_solved ?? 0, color: 'text-amber-400',   border: 'border-amber-400/20',   bg: 'bg-amber-400/10'   },
  { label: 'Hard',         value: stats?.hard_solved ?? 0,   color: 'text-rose-400',    border: 'border-rose-400/20',    bg: 'bg-rose-400/10'    },
]

export function StatsCards({ stats }: { stats: UserStats | null }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {getCards(stats).map((card) => (
        <div
          key={card.label}
          className={`rounded-xl border ${card.border} ${card.bg}
                      p-5 transition-all hover:scale-[1.02]`}
        >
          <p className="text-sm text-slate-400">{card.label}</p>
          <p className={`mt-1 text-3xl font-bold ${card.color}`}>{card.value}</p>
        </div>
      ))}
    </div>
  )
}
