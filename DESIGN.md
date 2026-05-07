# DESIGN.md — DSA Mentor AI Design System

## Design Philosophy
Developer-focused, minimal, dark-first. Inspired by Linear.app and Vercel dashboard.
Clean information density — show data without clutter.

## Active Font
Geist Sans (via next/font/google, already configured in app/layout.tsx)
Geist Mono for code elements
DO NOT introduce Inter or any other font.

## Color Tokens (Tailwind Classes)

### Brand Palette
| Token | Hex | Usage |
|---|---|---|
| `indigo-600` | #4F46E5 | Primary buttons, active nav, brand |
| `indigo-500` | #6366F1 | Hover states, links |
| `cyan-500` | #06B6D4 | Solved state, success accents |

### Difficulty Colors
| Difficulty | Text Class | Background Class |
|---|---|---|
| Easy | `text-emerald-400` | `bg-emerald-400/10` |
| Medium | `text-amber-400` | `bg-amber-400/10` |
| Hard | `text-rose-400` | `bg-rose-400/10` |

### Surface Hierarchy
| Layer | Tailwind Class | Hex |
|---|---|---|
| Page background | `bg-slate-950` | #020617 |
| Card/Panel | `bg-slate-900` | #0F172A |
| Elevated card | `bg-slate-800` | #1E293B |
| Input/Interactive | `bg-slate-700` | #334155 |
| Border default | `border-slate-800` | #1E293B |
| Border subtle | `border-slate-700` | #334155 |

### Text Hierarchy
| Role | Class | Usage |
|---|---|---|
| Primary | `text-white` | Headings, problem titles |
| Secondary | `text-slate-300` | Body text |
| Muted | `text-slate-500` | Labels, placeholders |
| Accent | `text-indigo-400` | Links, highlights |

## Typography Scale
- Display: `text-4xl font-bold tracking-tight`
- H1: `text-2xl font-semibold`
- H2: `text-xl font-semibold`
- H3: `text-base font-medium`
- Body: `text-sm text-slate-300`
- Caption: `text-xs text-slate-500`
- Code: `font-mono text-sm`

## Spacing System
- Section gap: `gap-6` (24px)
- Card padding: `p-6` (24px)
- Component gap: `gap-4` (16px)
- Tight gap: `gap-2` (8px)

## Component Patterns

### Problem Status Indicator
- Solved: cyan checkmark `text-cyan-500` + `bg-cyan-500/10`
- Attempted: amber tilde `text-amber-400`
- Todo: empty circle `text-slate-600`

### Streak Badge
Flame icon (`text-orange-400`) + count — shown in dashboard header

### Stat Card
Dark card `bg-slate-900`, subtle border, large number in `text-white`, label in `text-slate-400`

### Toast Notifications
Use `sonner` — import `{ toast }` from `'sonner'`. Never use shadcn toast.

## Layout Constants
- Sidebar width: 240px (desktop), hidden mobile
- Content max-width: `max-w-6xl` (1152px)
- Navbar height: 56px (h-14)
- Mobile breakpoint: 768px (md:)

