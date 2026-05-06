# SYSTEM_TREE.md — DSA Mentor AI

```text
dsa-mentor-ai/
├── .agent/                 # Antigravity agent context and workflows
│   ├── rules/
│   ├── skills/
│   └── workflows/
├── app/                    # Next.js App Router (Pages & API)
│   ├── (auth)/             # Login & Signup routes
│   ├── (dashboard)/        # Main app routes (Protected)
│   ├── api/                # Client Component mutation endpoints
│   ├── layout.tsx          # Root layout & providers
│   └── page.tsx            # Landing page
├── components/             # React Components (shadcn + custom)
│   ├── dashboard/          # Dashboard specific components
│   ├── layout/             # Sidebars, Navbars, Footers
│   ├── problems/           # Problem lists, cards, detail views
│   ├── shared/             # Reusable global components (Providers)
│   └── ui/                 # shadcn/ui generic primitives
├── hooks/                  # Custom React Hooks & TanStack queries
├── lib/                    # Utilities & Configuration
│   ├── supabase/           # Client/Server Supabase clients
│   └── utils.ts            # Tailwind / generic helpers
├── stores/                 # Zustand global state
├── supabase/               # Database Configuration
│   ├── migrations/         # SQL schema definitions
│   └── seed.sql            # Initial DB seed data
├── types/                  # TypeScript Types
│   ├── app.ts              # Custom application types
│   └── database.ts         # Supabase generated schema types
├── proxy.ts                # Next.js edge proxy (Supabase Auth checking)
├── AGENTS.md               # Primary agent instructions & persona
├── ARCHITECTURE.md         # System design & request flow
├── DECISIONS.md            # ADR (Architecture Decision Record)
├── GEMINI.md               # LLM specific instructions
├── GUARDRAILS.md           # Hard stops & learned failure patterns
├── PROJECT_STATE.md        # Current progress and exact state
└── ROADMAP.md              # Project milestones
```

### Ownership Boundaries
- **Server State / Database:** Handled in `app/` (SSR) and `app/api/` via `lib/supabase/`.
- **Client State:** Handled in `components/` via `hooks/` (TanStack Query) and `stores/` (Zustand).
- **Types:** Single source of truth in `types/database.ts`. All custom types in `types/app.ts` must map to `database.ts`.
