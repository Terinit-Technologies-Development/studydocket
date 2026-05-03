# StudyDocket — Agent Context

## What is this project?

StudyDocket is a **mobile-first personal law school planner** built with Next.js, TypeScript, and Tailwind CSS. It helps a law student manage classes, assignments, tests, exams, study sessions, reading deadlines, notes, and personal events.

**Current phase:** Supabase backend connected. Auth is UI-only (deferred). Data flows from Supabase Postgres database.

## Tech stack

| Layer          | Technology                        |
|----------------|-----------------------------------|
| Framework      | Next.js 16.2 (App Router)         |
| Language       | TypeScript 5                      |
| Styling        | Tailwind CSS v4 (`@theme` syntax) |
| Icons          | lucide-react                      |
| State          | React `useState` (no external lib)|
| Data           | Supabase Postgres (`@supabase/supabase-js`) |
| Backend        | Supabase (Postgres, Storage, Auth — deferred) |
| Package manager| npm                               |

## Project structure

```
src/
  app/                     # App Router pages
    page.tsx               # Welcome → /login
    login/page.tsx         # Login screen (implemented)
    dashboard/page.tsx     # Home Dashboard (implemented)
    calendar/page.tsx      # Calendar — Day/Week/Month/Agenda views (implemented)
    events/new/page.tsx    # Add Event — placeholder (modal used instead)
    modules/page.tsx       # Modules list (implemented)
    modules/[id]/page.tsx  # Module detail — placeholder
    assignments/page.tsx   # Assignments list (implemented)
    assignments/[id]/page.tsx # Assignment detail — placeholder
    assessments/page.tsx   # Tests/Exams list (implemented)
    study-sessions/new/page.tsx # Study session form — placeholder
    overview/page.tsx      # Notes page (implemented)
    globals.css            # Tailwind v4 theme tokens + animation
    layout.tsx             # Root layout (fonts, metadata)
  components/
    layout/
      AppShell.tsx         # Mobile-first container + optional nav
      BottomNavigation.tsx # Fixed 5-tab nav (Home, Calendar, Modules, Tasks, Notes)
      TopBar.tsx           # Page header with title + optional actions
    ui/
      Button.tsx           # primary | secondary | ghost × sm | md | lg
      Card.tsx             # Rounded border card with padding variants
      Input.tsx            # Labelled input with error state
      Badge.tsx            # default | priority-high/medium/low | success | warning
      EmptyState.tsx       # Centered title + description + optional CTA
      Progress.tsx         # Horizontal bar (0–100%)
      Modal.tsx            # Bottom-sheet overlay, escape/click-outside close
    forms/
      AddEventForm.tsx     # Event creation modal (type pills, module, date/time, location, priority)
      AddModuleForm.tsx    # Module creation modal (name, lecturer, 6-colour swatch picker)
      AddTaskForm.tsx      # Task creation modal (title, module, due date, hours, priority)
      AddNoteForm.tsx      # Note creation modal (title, module, content, tag chips)
  lib/
    types.ts               # All TypeScript interfaces (User, Module, Event, etc.)
    mock-data.ts           # Mock data for all entities
    utils.ts               # cn(), formatDate(), formatTime(), daysUntil(), priority helpers
  styles/                  # Reserved for shared style notes
```

Design system documented in `design.md` (root).

## Key conventions

1. **Data comes from Supabase** — all queries go through `src/lib/data.ts` using `@supabase/supabase-js`. Use `fetchEvents()`, `fetchModules()`, etc.
2. **Client components** use `"use client"` directive at the top. Data is fetched via `useEffect` + async functions from `@/lib/data`.
3. **Supabase client** is initialised in `src/lib/supabase.ts` using env vars `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. **RLS policies** are currently permissive (`TO anon, authenticated USING (true)`) — marked with TODO to lock down when auth is wired.
5. **Auth is deferred** — login page is UI-only. Hardcoded user ID `00000000-0000-0000-0000-000000000001` is used for all data operations.
6. **Mobile-first** — `AppShell` wraps pages in a centered `max-w-md` container.
7. **Bottom nav** appears on pages using `<AppShell showNav>` — the component auto-detects active route via `usePathname()`.
8. **Modals** use the `Modal` component + a form component from `src/components/forms/`.

## What NOT to add yet

- Supabase or any backend
- Real authentication (login form is UI-only)
- AI features, document upload
- Complex state management (Redux, Zustand, etc.)
- Large UI libraries (Radix, shadcn, MUI)
- API routes
- Database connections

## Runtime versions

- Node: 20+
- Next.js: 16.2.4
- React: 19.2.4
- TypeScript: 5.x
- Tailwind CSS: 4.x
