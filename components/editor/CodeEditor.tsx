'use client'

import dynamic       from 'next/dynamic'
import { useEffect } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import { LANGUAGE_BY_ID } from '@/lib/constants'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

// ⚠️ MANDATORY: ssr:false — Monaco uses window/document directly
// NEVER remove this — SSR will crash with hydration errors
const MonacoEditor = dynamic(
  () => import('@monaco-editor/react').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-slate-950">
        <LoadingSpinner size="md" />
      </div>
    ),
  }
)

interface Props {
  problemId: string
  height?:   string
}

export function CodeEditor({ problemId, height = '100%' }: Props) {
  const { code, languageId, setCode, loadDraft } = useEditorStore()

  const monacoLang =
    LANGUAGE_BY_ID[languageId as keyof typeof LANGUAGE_BY_ID]
      ?.monacoLang ?? 'javascript'

  // Load draft on mount — ProblemEditorPanel may override this
  // via setCode if a saved submission exists
  useEffect(() => {
    loadDraft(problemId)
    // loadDraft is a stable Zustand action — safe to omit from deps
    // as Zustand actions never change reference between renders
  }, [problemId]) // eslint-disable-line react-hooks/exhaustive-deps
  // NOTE: The eslint-disable above is intentional and safe.
  // loadDraft is a Zustand store action — its reference is stable
  // across renders by design (Zustand guarantees this).
  // Re-running on loadDraft change would cause infinite re-renders.
  // If refactoring editorStore, verify loadDraft remains stable.

  return (
    <MonacoEditor
      height={height}
      language={monacoLang}
      value={code}
      theme="vs-dark"
      onChange={(val) => setCode(val ?? '')}
      options={{
        fontSize:             14,
        fontFamily:           '"JetBrains Mono", "Fira Code", monospace',
        fontLigatures:        true,
        minimap:              { enabled: false },
        scrollBeyondLastLine: false,
        wordWrap:             'on',
        lineNumbers:          'on',
        renderLineHighlight:  'line',
        cursorBlinking:       'smooth',
        smoothScrolling:      true,
        automaticLayout:      true,
        tabSize:              2,
        padding:              { top: 16, bottom: 16 },
        scrollbar: {
          verticalScrollbarSize:   6,
          horizontalScrollbarSize: 6,
        },
      }}
    />
  )
}
