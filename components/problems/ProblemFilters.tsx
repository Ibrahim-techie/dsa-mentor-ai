'use client'

import { useProblemFilterStore } from '@/stores/problemFilterStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { DIFFICULTY_LEVELS } from '@/lib/constants'

export function ProblemFilters() {
  const { search, difficulty, setSearch, setDifficulty, resetFilters } =
    useProblemFilterStore()

  const hasActive = search || difficulty !== 'all'

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <Input
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 border-slate-700 bg-slate-800 text-white
                     placeholder:text-slate-500 focus-visible:ring-indigo-500"
        />
      </div>

      <div className="flex gap-1">
        {(['all', ...DIFFICULTY_LEVELS] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d === 'all' ? 'all' : d)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
              difficulty === d
                ? 'bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/40'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {d === 'all' ? 'All' : d}
          </button>
        ))}
      </div>

      {hasActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-slate-400 hover:text-white"
        >
          <X className="mr-1 h-3 w-3" />
          Clear
        </Button>
      )}
    </div>
  )
}
