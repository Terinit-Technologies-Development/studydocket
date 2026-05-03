# Changelog

All notable changes to StudyDocket will be documented in this file.

---

## [0.4.0] — 2026-05-03

### Added
- Reusable `Modal` component with overlay, escape-to-close, click-outside-close, slide-up animation
- `AddEventForm` modal — type pills (Class/Reading/Personal etc), module dropdown, date/time, location, priority, notes
- `AddModuleForm` modal — name, lecturer, 6-colour swatch picker, notes
- `AddTaskForm` modal — title, module dropdown, description, due date, estimated hours, 3-button priority selector
- `AddNoteForm` modal — title, module, free-text content, tag input with add/remove chips
- `Note` type (`id`, `title`, `moduleId`, `content`, `createdAt`, `updatedAt`, `tags[]`)
- 6 mock notes across Constitutional Law, Contract Law, Criminal Law, and Legal Research modules
- `slide-up` keyframe animation in `globals.css`
- Calendar: all 4 view tabs (Day / Week / Month / Agenda) are now interactive with `useState`
- Notes page: search bar, module filter pills with note counts, note cards with content preview and tags, empty state

### Changed
- Calendar: FABs in all views now open `AddEventForm` modal instead of navigating to `/events/new`
- Modules page: plus button in header opens `AddModuleForm` modal
- Assignments page: plus button in header opens `AddTaskForm` modal
- Overview page: replaced placeholder with full Notes page
- Bottom navigation: "Overview" (BarChart3) changed to "Notes" (StickyNote icon)
- Mock user name changed from "Jane Doe" to "Alex Carter"

### Fixed
- Removed unused `TopBar` import from root `page.tsx`
- Removed unused `events`, `formatTime`, `Badge` imports from calendar page
- Removed unused `index` parameter from AgendaView map

---

## [0.3.0] — 2026-05-03

### Added
- Login screen with email/password fields, password visibility toggle, "Remember me" checkbox, "Forgot password?" link, Google/Apple SSO buttons, Sign Up link
- Dashboard screen with greeting (Good morning, [name]), weekly date strip, today's schedule card, upcoming deadlines card, next study session card
- Calendar screen with Day / Week / Month / Agenda tab views, hourly grid with positioned event blocks, month grid with event dot markers, agenda list with date grouping
- Modules screen with colour-coded module cards, lecturer overrides, active/inactive indicators
- Assignments screen with filter tabs (All / Not Started / In Progress / Completed), progress percentage circles, progress bars, priority and status badges
- Tests & Exams screen with Upcoming / Completed toggle, confidence level badges, priority indicators

---

## [0.2.0] — 2026-05-03

### Added
- Full project scaffolding: Next.js 16.2, TypeScript 5, Tailwind CSS v4, App Router
- `design.md` — complete design system documentation (colours, typography, layout, components, UI states, accessibility, dev notes)
- TypeScript types: `User`, `Module`, `Event`, `Assignment`, `Assessment`, `StudySession`
- Mock data: 1 user, 5 modules, 6 events, 4 assignments, 3 assessments, 3 study sessions
- UI components: `Button`, `Card`, `Input`, `Badge`, `EmptyState`, `Progress`
- Layout components: `AppShell`, `BottomNavigation`, `TopBar`
- 13 route pages with placeholder content
- `cn()` utility, `formatDate()`, `formatTime()`, `daysUntil()`, `isOverdue()`, `isDueSoon()`, priority helpers
- lucide-react icons
- 12-colour design palette (deep black through sage grey-green)

---

## [0.1.0] — 2026-05-03

### Added
- Initial project created with `create-next-app` (Next.js 16, TypeScript, Tailwind, ESLint, App Router, src directory)
- Default root layout with Geist font
