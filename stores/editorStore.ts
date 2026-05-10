import { create } from 'zustand'
import { DEFAULT_LANGUAGE_ID, STARTER_CODE } from '@/lib/constants'
import type { ExecutionResult } from '@/types/app'

interface EditorState {
  code:       string
  languageId: number
  output:     ExecutionResult | null
  isRunning:  boolean
  isDirty:    boolean

  setCode:       (code: string) => void
  setLanguageId: (id: number) => void
  setOutput:     (result: ExecutionResult | null) => void
  setIsRunning:  (v: boolean) => void

  // Load draft from localStorage or fall back to starter code
  loadDraft: (problemId: string, langId?: number) => void

  // Save current code to localStorage
  saveDraft: (problemId: string) => void

  // Reset editor for a new problem
  resetForProblem: (problemId: string) => void
}

const DRAFT_KEY = (problemId: string, langId: number) =>
  `draft:${problemId}:${langId}`

export const useEditorStore = create<EditorState>((set, get) => ({
  code:       STARTER_CODE[DEFAULT_LANGUAGE_ID] ?? '',
  languageId: DEFAULT_LANGUAGE_ID,
  output:     null,
  isRunning:  false,
  isDirty:    false,

  setCode:(code) => {
    set({ code, isDirty: true })
  },

  setLanguageId:(id) => {
    set({ languageId: id, output: null })
  },
  setOutput:(output) => set({ output }),
  setIsRunning:(isRunning) => set({ isRunning }),

  loadDraft: (problemId, langId) => {
    const { languageId } = get()
    const id = langId ?? languageId

    let code = STARTER_CODE[id] ?? ''

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(DRAFT_KEY(problemId, id))
      if (saved) code = saved
    }

    set({ code, languageId: id, isDirty: false, output: null })
  },

  saveDraft: (problemId) => {
    const { code, languageId } = get()
    if (typeof window !== 'undefined') {
      localStorage.setItem(DRAFT_KEY(problemId, languageId), code)
    }
    set({ isDirty: false })
  },

  resetForProblem: (problemId) => {
    const { languageId } = get()
    const saved =
      typeof window !== 'undefined'
        ? localStorage.getItem(DRAFT_KEY(problemId, languageId))
        : null
    set({
      code:      saved ?? STARTER_CODE[languageId] ?? '',
      output:    null,
      isRunning: false,
      isDirty:   false,
    })
  },
}))
