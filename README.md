# DSA Mentor AI

An AI-powered Data Structures & Algorithms learning platform. Track progress,
get intelligent problem recommendations, practice in the browser, and receive
AI hints when you're stuck.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Database & Auth:** Supabase (PostgreSQL + RLS)
- **UI:** Tailwind CSS + shadcn/ui
- **State:** Zustand + TanStack Query
- **AI:** Google Gemini (Phase 4)
- **Code Editor:** Monaco Editor (Phase 2)

## Local Setup

### 1. Clone and install
```bash
git clone <your-repo-url>
cd dsa-mentor-ai
npm install
```

### 2. Configure environment
```bash
cp .env.local.example .env.local
```
Fill in your Supabase credentials in `.env.local`.

### 3. Link Supabase
```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Project Docs
- [Architecture](./ARCHITECTURE.md) — system design and request flow
- [Roadmap](./ROADMAP.md) — phase-by-phase milestones
- [Decisions](./DECISIONS.md) — architectural decision log
- [Design](./DESIGN.md) — color tokens, typography, component patterns
- [Project State](./PROJECT_STATE.md) — current implementation status

## Phase Status
- ✅ Phase 1: Foundation (auth, DB schema, progress tracking)
- ⏳ Phase 2: Code Editor + Judge0 execution
- ⏳ Phase 3: Rule-based intelligence
- ⏳ Phase 4: Gemini AI integration
- ⏳ Phase 5: Interview simulation
