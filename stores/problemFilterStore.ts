import { create } from 'zustand'
import type { Difficulty, Platform } from '@/lib/constants'

interface ProblemFilterState {
  search: string
  difficulty: Difficulty | 'all'
  topic: string | 'all'
  platform: Platform | 'all'
  showSolvedOnly: boolean
  showFavouritesOnly: boolean
  setSearch: (v: string) => void
  setDifficulty: (v: Difficulty | 'all') => void
  setTopic: (v: string | 'all') => void
  setPlatform: (v: Platform | 'all') => void
  setShowSolvedOnly: (v: boolean) => void
  setShowFavouritesOnly: (v: boolean) => void
  resetFilters: () => void
}

const initial = {
  search: '',
  difficulty: 'all' as const,
  topic: 'all' as const,
  platform: 'all' as const,
  showSolvedOnly: false,
  showFavouritesOnly: false,
}

export const useProblemFilterStore = create<ProblemFilterState>((set) => ({
  ...initial,
  setSearch: (search) => set({ search }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setTopic: (topic) => set({ topic }),
  setPlatform: (platform) => set({ platform }),
  setShowSolvedOnly: (showSolvedOnly) => set({ showSolvedOnly }),
  setShowFavouritesOnly: (showFavouritesOnly) => set({ showFavouritesOnly }),
  resetFilters: () => set(initial),
}))
