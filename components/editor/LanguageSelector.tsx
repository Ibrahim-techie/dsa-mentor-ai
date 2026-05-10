'use client'

import { SUPPORTED_LANGUAGES, STARTER_CODE } from '@/lib/constants'
import { useEditorStore }                     from '@/stores/editorStore'
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@/components/ui/select'

interface Props {
  problemId: string
}

export function LanguageSelector({ problemId }: Props) {
  const { languageId, setLanguageId, setCode, loadDraft } = useEditorStore()

  const handleChange = (value: string | null) => {
    if (!value) return
    const newId = parseInt(value, 10)
    setLanguageId(newId)

    // Check if a localStorage draft exists for this problem + language
    const draftKey    = `draft:${problemId}:${newId}`
    const savedDraft  = typeof window !== 'undefined'
      ? localStorage.getItem(draftKey)
      : null

    if (savedDraft) {
      // Restore existing draft for this language
      setCode(savedDraft)
    } else {
      // No draft — load the starter template for the new language
      setCode(STARTER_CODE[newId] ?? '')
    }
  }

  return (
    <Select value={String(languageId)} onValueChange={handleChange}>
      <SelectTrigger
        className="w-36 border-slate-700 bg-slate-800 text-sm
                   text-slate-300 focus:ring-indigo-500"
      >
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent className="border-slate-700 bg-slate-800">
        {SUPPORTED_LANGUAGES.map((lang) => (
          <SelectItem
            key={lang.id}
            value={String(lang.id)}
            className="text-slate-300 focus:bg-slate-700 focus:text-white"
          >
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
