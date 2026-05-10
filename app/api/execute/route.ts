import { createClient }      from '@/lib/supabase/server'
import { NextResponse }      from 'next/server'
import { z }                 from 'zod'
import { LANGUAGE_BY_ID }   from '@/lib/constants'
import type { ApiResponse, ExecutionResult } from '@/types/app'

// ─── Validation ────────────────────────────────────────────────
const executeSchema = z.object({
  problem_id:  z.string().uuid(),
  code:        z.string().min(1).max(50_000),
  language_id: z.number().int(),
  stdin:       z.string().max(10_000).optional().default(''),
})

// ─── Provider: Piston (development / free tier) ────────────────
async function runWithPiston(
  code: string,
  languageId: number,
  stdin: string
): Promise<ExecutionResult> {
  const lang = LANGUAGE_BY_ID[languageId as keyof typeof LANGUAGE_BY_ID]
  if (!lang) throw new Error(`Unsupported language id: ${languageId}`)

  // Map language id to Piston language name
  const pistonLang: Record<number, { language: string; version: string }> = {
    63: { language: 'javascript', version: '18.15.0' },
    71: { language: 'python',     version: '3.10.0'  },
    62: { language: 'java',       version: '15.0.2'  },
    54: { language: 'c++',        version: '10.2.0'  },
    73: { language: 'rust',       version: '1.50.0'  },
  }

  const mapping = pistonLang[languageId]
  if (!mapping) throw new Error(`No Piston mapping for language id: ${languageId}`)

  const res = await fetch('https://emkc.org/api/v2/piston/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: mapping.language,
      version:  mapping.version,
      files:    [{ content: code }],
      stdin:    stdin ?? '',
    }),
  })

  if (!res.ok) {
    throw new Error(`Piston API error: ${res.status} ${res.statusText}`)
  }

  const data = await res.json()
  const run  = data.run ?? {}

  const exitCode = run.code ?? 0
  const stderr   = run.stderr?.trim() || null
  const stdout   = run.stdout?.trim() || null

  // Piston doesn't have Judge0-style status IDs — map from output
  let statusId   = 3 // Accepted
  let statusDesc = 'Accepted'

  if (exitCode !== 0) {
    statusId   = 7  // Runtime Error
    statusDesc = 'Runtime Error'
  }
  if (stderr && stderr.includes('SyntaxError') ||
      stderr?.includes('Error:') && exitCode !== 0) {
    statusId   = 6  // Compilation/Syntax Error
    statusDesc = 'Compilation Error'
  }

  return {
    statusId,
    statusDesc,
    stdout,
    stderr,
    compileOut: null,
    timeMs:     run.wall_time ? Math.round(run.wall_time * 1000) : null,
    memoryKb:   run.memory ?? null,
  }
}

// ─── Provider: Judge0 (production) ────────────────────────────
async function runWithJudge0(
  code: string,
  languageId: number,
  stdin: string
): Promise<ExecutionResult> {
  const apiUrl = process.env.JUDGE0_API_URL
  const apiKey = process.env.JUDGE0_API_KEY

  if (!apiUrl || !apiKey) {
    throw new Error('Judge0 environment variables not configured')
  }

  // Submit
  const submitRes = await fetch(
    `${apiUrl}/submissions?base64_encoded=true&wait=false`,
    {
      method: 'POST',
      headers: {
        'Content-Type':       'application/json',
        'X-RapidAPI-Host':    'judge0-ce.p.rapidapi.com',
        'X-RapidAPI-Key':     apiKey,
      },
      body: JSON.stringify({
        source_code:    Buffer.from(code).toString('base64'),
        language_id:    languageId,
        stdin:          Buffer.from(stdin ?? '').toString('base64'),
        cpu_time_limit: 5,
        memory_limit:   128_000,
      }),
    }
  )

  if (!submitRes.ok) throw new Error(`Judge0 submit error: ${submitRes.status}`)
  const { token } = await submitRes.json()

  // Poll for result — max 10 attempts, 1s apart
 for (let i = 0; i < 5; i++) {
  await new Promise((r) => setTimeout(r, 500))

    const pollRes = await fetch(
      `${apiUrl}/submissions/${token}?base64_encoded=true&fields=status,stdout,stderr,compile_output,time,memory`,
      {
        headers: {
          'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
          'X-RapidAPI-Key':  apiKey,
        },
      }
    )

    if (!pollRes.ok) continue

    const result = await pollRes.json()
    const sid    = result.status?.id ?? 0

    if (sid <= 2) continue // still queued/processing

    const decode = (b64: string | null) =>
      b64 ? Buffer.from(b64, 'base64').toString('utf8').trim() : null

    return {
      statusId:   sid,
      statusDesc: result.status?.description ?? 'Unknown',
      stdout:     decode(result.stdout),
      stderr:     decode(result.stderr),
      compileOut: decode(result.compile_output),
      timeMs:     result.time ? Math.round(parseFloat(result.time) * 1000) : null,
      memoryKb:   result.memory ?? null,
    }
  }

  throw new Error('Execution timed out after 10 seconds')
}

// ─── Route Handler ─────────────────────────────────────────────
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body   = await request.json()
    const parsed = executeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json<ApiResponse<null>>(
        { data: null, error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { problem_id, code, language_id, stdin } = parsed.data
    const provider = process.env.EXECUTION_PROVIDER ?? 'piston'

    // Execute
    const result = provider === 'judge0'
      ? await runWithJudge0(code, language_id, stdin)
      : await runWithPiston(code, language_id, stdin)

    // Persist run history (non-blocking — fire and forget)
    supabase.from('execution_runs').insert({
      user_id:     user.id,
      problem_id,
      code,
      language:    LANGUAGE_BY_ID[language_id as keyof typeof LANGUAGE_BY_ID]
                     ?.monacoLang ?? 'javascript',
      stdin:       stdin || null,
      stdout:      result.stdout,
      stderr:      result.stderr,
      compile_out: result.compileOut,
      status_id:   result.statusId,
      status_desc: result.statusDesc,
      time_ms:     result.timeMs,
      memory_kb:   result.memoryKb,
    }).then(() => {}) // intentionally non-blocking

    return NextResponse.json<ApiResponse<ExecutionResult>>({
      data: result,
      error: null,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Execution failed'
    return NextResponse.json<ApiResponse<null>>(
      { data: null, error: message },
      { status: 500 }
    )
  }
}
