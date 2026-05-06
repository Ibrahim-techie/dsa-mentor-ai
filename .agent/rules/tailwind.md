---
trigger: always
---
# Tailwind & Styling Rules (Always On)
- Use Tailwind utility classes exclusively — no inline styles, no CSS modules
- Use shadcn/ui components from components/ui/ — do not reimplement them
- Dark mode is handled via Tailwind's `dark:` variant — always add dark mode classes
- Use the cn() utility from lib/utils.ts for conditional class merging
- Responsive breakpoints: mobile-first, use sm: md: lg: xl: prefixes
