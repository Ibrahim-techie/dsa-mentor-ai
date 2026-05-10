'use client'

import { useEffect }         from 'react'
// Direct import — never via barrel to avoid eager Monaco bundling
import { CodeEditor }        from './CodeEditor'
import { LanguageSelector }  from './LanguageSelector'
import { OutputPanel }       from './OutputPanel'
import { EditorToolbar }     from './EditorToolbar'
import { useEditorStore }    from '@/stores/editorStore'
import {
  DEFAULT_LANGUAGE_ID,
  SUPPORTED_LANGUAGES,
  STARTER_CODE,
} from '@/lib/constants'

interface Props {
  problemId:     string
  savedCode:     string | null
  savedLanguage: string | null
}

export function ProblemEditorPanel({ problemId, savedCode, savedLanguage }: Props) {
  const { setCode, setLanguageId } = useEditorStore()

  // On mount: restore saved submission OR load draft/starter
  // setCode and setLanguageId are stable Zustand actions —
  // safe to omit from deps (Zustand guarantees stable references).
  useEffect(() => {
    if (savedCode) {
      // User has a prior submission — restore it with correct language
      const langId = savedLanguage
        ? (SUPPORTED_LANGUAGES.find(
            (l) => l.monacoLang === savedLanguage ||
                   String(l.id)  === savedLanguage
          )?.id ?? DEFAULT_LANGUAGE_ID)
        : DEFAULT_LANGUAGE_ID

      setLanguageId(langId)
      setCode(savedCode)
    }
    // If no savedCode: CodeEditor's own useEffect calls loadDraft,
    // which handles draft-or-starter-code logic on mount.
    // No action needed here for the no-saved-code path.
  }, [problemId, savedCode, savedLanguage, setCode, setLanguageId])
  // NOTE: setCode and setLanguageId included to satisfy exhaustive-deps.
  // They are Zustand actions with stable references — no risk of
  // infinite re-renders. This is the preferred approach over eslint-disable.

  return (
    <div className="flex h-full flex-col bg-slate-950">

      {/* Language selector bar */}
      <div className="flex shrink-0 items-center justify-between
                      border-b border-slate-800 bg-slate-900 px-4 py-2">
        <LanguageSelector problemId={problemId} />
        <span className="text-xs text-slate-600">Auto-saved locally</span>
      </div>

      {/* Monaco Editor — 60% height */}
      <div className="flex-[6] overflow-hidden border-b border-slate-800">
        <CodeEditor problemId={problemId} height="100%" />
      </div>

      {/* Output panel — 40% height */}
      <div className="flex-[4] overflow-hidden">
        <OutputPanel />
      </div>

      {/* Run / Submit */}
      <EditorToolbar problemId={problemId} />

    </div>
  )
}
