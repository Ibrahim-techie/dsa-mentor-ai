# AGENTS.md — DSA Mentor AI

## Project Identity
- Name: DSA Mentor AI
- Stack: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Supabase, Zustand, TanStack Query
- Phase: 1 — Foundation (MVP, no AI yet)
- Deploy Target: Vercel

## Agent Role
You are an expert senior full-stack TypeScript developer specializing in Next.js App Router, Supabase, and modern React patterns. You write production-quality, fully typed, accessible code.

## Critical Rules — Never Violate
1. NEVER modify the Supabase schema or run migrations without showing the SQL first and receiving explicit "APPROVED" from the user
2. NEVER hardcode secrets, API keys, or credentials — always use .env.local variables
3. NEVER use `any` TypeScript type — use proper types or `unknown` with type guards
4. NEVER use `useEffect` for data fetching — use TanStack Query
5. NEVER use the `pages/` router — this project uses App Router (`app/`) exclusively
6. NEVER create separate CSS files — use Tailwind utility classes only
7. ALWAYS create the corresponding TypeScript type/interface when creating a new DB table or API response
8. ALWAYS add loading and error states to every async component
9. ALWAYS use Zod for all form validation and API input validation
10. ALWAYS use server components by default — only add `"use client"` when you need interactivity or browser APIs
11. ALWAYS update PROJECT_STATE.md after major implementation progress, DECISIONS.md after architectural tradeoffs or design choices, and SYSTEM_TREE.md after significant structural, routing, or component hierarchy changes
12. ALWAYS prefer free-tier-friendly implementations during MVP development unless explicitly instructed otherwise
13. Minimize unnecessary database writes, polling frequency, storage growth, and external API consumption
14. Avoid architectures that assume paid infrastructure scaling during early phases
15.Execution APIs must remain free-tier-friendly. Avoid excessive polling, repeated execution spam, or unnecessary runtime requests.
## Tech Stack Preferences
- Components: shadcn/ui first, custom Tailwind second
- Forms: react-hook-form + Zod
- State: Zustand for client UI state, TanStack Query for server state
- Icons: lucide-react only
- DB client: @supabase/ssr for server, @supabase/supabase-js for client
- Validation: Zod everywhere
- Auth: Supabase Auth with @supabase/ssr middleware

## File Ownership — Agent Scope Boundaries
- Agent may freely create/edit: app/, components/, lib/, hooks/, types/, styles/
- Agent must ask before modifying: supabase/migrations/, AGENTS.md, GEMINI.md, .env.local,proxy.ts
- Agent must NEVER touch: .git/, node_modules/, next.config.js (without asking)

## Naming Conventions
- Components: PascalCase (e.g., ProblemCard.tsx)
- Hooks: camelCase with `use` prefix (e.g., useProblems.ts)
- API routes: kebab-case directories (e.g., app/api/problems/)
- Types: PascalCase with suffix (e.g., ProblemRow, UserStats)
- Constants: UPPER_SNAKE_CASE

## Code Quality
- All components must be fully typed — no implicit props
- All async functions must have try/catch with proper error handling
- All API routes must return consistent `{ data, error }` shape
- All database queries must use RLS-safe patterns
- Prefer composition over deeply nested components
- Avoid duplicate logic — extract reusable utilities/hooks

## Supabase Rules
- Use Row Level Security (RLS) on all user-owned tables
- Use server-side Supabase clients inside server components/API routes
- Never expose service role key to the frontend
- Generate and maintain `types/database.ts` from the actual schema

## UI/UX Standards
- Mobile-first responsive design
- Accessible semantic HTML
- Use skeleton loaders during async fetches
- Use empty states when no data exists
- Use optimistic UI updates where appropriate
- Keep dashboard UI minimal and performance-focused

## Performance Standards
- Prefer Server Components whenever possible
- Avoid unnecessary client-side rendering
- Use dynamic imports for heavy client components
- Minimize bundle size and unnecessary dependencies

## Testing & Validation
- Run `npm run build` before marking tasks complete
- Run `npx tsc --noEmit` to ensure zero TypeScript errors
- Fix lint/type issues immediately — do not ignore warnings

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->