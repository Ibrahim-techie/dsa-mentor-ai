# DSA Mentor AI

DSA Mentor AI is a modern full-stack interview preparation platform focused on mastering Data Structures & Algorithms through structured problem tracking, analytics, streak systems, and future AI-assisted learning workflows.

## Tech Stack

### Frontend

* Next.js 16 (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui
* Zustand
* TanStack Query

### Backend & Database

* Supabase
* PostgreSQL
* Row Level Security (RLS)
* Supabase SSR Auth

### Tooling

* ESLint
* Prettier
* GitHub MCP
* Supabase MCP

---

# Current Project Status

## Completed

* Project architecture scaffolding
* Supabase schema & migrations
* RLS policy setup
* Generated database types
* Auth middleware/proxy foundation
* Zustand stores
* TanStack Query hooks
* Core dashboard/problem components
* Persistent architecture memory system

## In Progress

* Authentication UI & flows
* Dashboard integration
* Problem management workflows
* UI system refinement

## Planned

* AI-assisted hints & explanations
* Code analysis & feedback
* Personalized recommendations
* Progress forecasting
* Smart revision scheduling

---

# Architecture Overview

```text
Browser (Next.js React)
       │
       ├── Server Components (SSR)
       │        │
       │        └── Supabase (RLS enforced)
       │
       └── Client Components
                │
                └── TanStack Query
                         │
                         └── API Routes
                                  │
                                  └── Supabase
```

---

# Project Structure

```text
app/            → Next.js App Router pages & API routes
components/     → Shared UI and feature components
hooks/          → TanStack Query hooks
lib/            → Utilities, validations, Supabase clients
stores/         → Zustand state stores
supabase/       → Migrations, seeds, config
types/          → Generated DB types and app types
```

---

# Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

# Getting Started

## Install dependencies

```bash
npm install
```

## Start development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Database Setup

## Start Supabase locally (optional)

```bash
npx supabase start
```

## Apply migrations

```bash
npx supabase db push
```

## Generate database types

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
```

---

# Engineering Principles

* Type-safe architecture
* Server-first patterns
* RLS-secured database access
* Incremental feature evolution
* Shared component system
* Persistent architecture memory & decision tracking

---

# Internal Project Memory

The repository maintains persistent engineering context through:

* `PROJECT_STATE.md`
* `DECISIONS.md`
* `ROADMAP.md`
* `SYSTEM_TREE.md`
* `ARCHITECTURE.md`

These files act as long-term project memory for future development sessions and architectural consistency.

---

# Deployment

Target deployment platform:

* Vercel

Supabase handles:

* PostgreSQL
* Authentication
* Row Level Security
* Storage (future)

---

# License

Private project — all rights reserved.
