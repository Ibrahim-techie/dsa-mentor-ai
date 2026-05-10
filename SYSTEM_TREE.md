# SYSTEM_TREE.md — DSA Mentor AI

```text
dsa-mentor-ai/
├── .agent/                 # Antigravity agent context and workflows
│   ├── rules/
│   ├── skills/
│   └── workflows/
├── app/                    # Next.js 16 App Router (Server-side rendering & API)
│   ├── (auth)/             # Login & Signup routes (Server Components + Client Forms)
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/        # Main app routes (Protected, Server Components)
│   │   ├── dashboard/page.tsx
│   │   ├── problems/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── profile/page.tsx
│   │   └── layout.tsx
│   ├── api/                # Client Component mutation endpoints (Next.js API Routes)
│   │   ├── auth/callback/route.ts
│   │   ├── execute/route.ts
│   │   ├── problems/route.ts
│   │   ├── stats/route.ts
│   │   └── submissions/route.ts
│   ├── layout.tsx          # Root layout & providers
│   ├── page.tsx            # Landing page
│   └── globals.css         # Tailwind v4 tokens & global styles
├── components/             # React Components (shadcn + custom)
│   ├── auth/               # LoginForm, SignupForm (Client Components)
│   ├── dashboard/          # RecentActivity, StatsCards, StreakHeatmap, TopicProgress
│   ├── layout/             # MobileNav, Navbar, Sidebar
│   ├── problems/           # DifficultyBadge, ProblemFilters, ProblemRow, TopicSection
│   ├── shared/             # EmptyState, ErrorBoundary, LoadingSpinner, Providers
│   └── ui/                 # shadcn/ui generic primitives (Tailwind v4 compatible)
├── hooks/                  # Custom React Hooks & TanStack queries (Client State)
│   ├── useProblems.ts
│   ├── useStats.ts
│   ├── useStreak.ts
│   ├── useSubmissions.ts
│   └── useUser.ts
├── lib/                    # Utilities & Configuration
│   ├── supabase/           # Supabase clients (client.ts, server.ts)
│   ├── validations/        # Zod schemas (auth.ts, problem.ts, submission.ts)
│   ├── constants.ts
│   └── utils.ts            # Tailwind / generic helpers
├── stores/                 # Zustand global state (Client-side UI State)
│   ├── editorStore.ts
│   ├── problemFilterStore.ts
│   └── uiStore.ts
├── supabase/               # Database Configuration
│   ├── migrations/         # SQL schema definitions (Source of truth for DB)
│   ├── seed.sql            # Initial DB seed data
│   └── config.toml
├── types/                  # TypeScript Types
│   ├── app.ts              # Custom application types (Mapped to DB schema)
│   └── database.ts         # Supabase generated schema types
├── proxy.ts                # Next.js edge proxy (Supabase Auth checking)
├── AGENTS.md               # Primary agent instructions & persona
├── ARCHITECTURE.md         # System design & request flow
├── DECISIONS.md            # ADR (Architecture Decision Record)
├── EXECUTION-ARCHITECTURE.md # Phase 2 Monaco + Judge0 execution design
├── GEMINI.md               # LLM specific instructions
├── GUARDRAILS.md           # Hard stops & learned failure patterns
├── PROJECT_STATE.md        # Current progress and exact state
└── ROADMAP.md              # Project milestones
```

### Ownership Boundaries

- **Rendering Strategy Ownership:** App Router (`app/`) defaults to Server Components (SSR) for optimal initial load and data fetching. Interactive islands (e.g., forms, filters) are pushed down to leaf Client Components in `components/`.
- **Database / Server State:** Handled directly in `app/` (Server Components) using `lib/supabase/server.ts` to reduce latency and redundant API calls. API routes (`app/api/`) are strictly reserved for handling Client Component mutations.
- **Execution Runtime Ownership:** (Phase 2) Monaco Editor runs strictly on the client (imported with `ssr: false`). Code execution is proxied through Next.js API routes (`/api/execute`) to mask third-party provider keys and handles polling the Piston/Judge0 runtime.
- **Client State:** Handled in `components/` via `hooks/` (TanStack Query for remote state caching and optimistic UI updates) and `stores/` (Zustand for global UI state like sidebars and filters).
- **Free-Tier Infrastructure Constraints:** Architecture avoids unnecessary DB writes (e.g., drafts saved to localStorage, not DB) and excessive API consumption (TanStack Query caches heavily; execution uses free Piston API for development).
- **Types Ownership:** `types/database.ts` is the strict single source of truth for the database schema, generated directly from Supabase. `types/app.ts` contains application-layer interfaces but *must* rigorously map and conform to `database.ts` to prevent runtime/type mismatches.
