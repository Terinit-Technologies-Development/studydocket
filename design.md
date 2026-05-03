# StudyDocket — Design System

## 1. Product Identity

- **App name:** StudyDocket
- **Purpose:** Personal law school planner
- **Audience:** Law student
- **Experience goal:** Calm, structured, elegant, supportive, premium

## 2. Visual Personality

- Black-and-white first
- Minimalist
- Elegant academic tone
- Feminine but not overly decorative
- Professional
- Calm, not stressful
- Supportive, not overwhelming

## 3. Colour Palette

| Token              | Hex       | Usage                                      |
|--------------------|-----------|--------------------------------------------|
| Deep black         | `#050505` | Primary text, headings                     |
| Soft black         | `#111111` | App shell background (dark variant)        |
| Soft white         | `#FFFFFF` | Page backgrounds, card surfaces            |
| Off-white          | `#F7F7F5` | Page background (warm variant)             |
| Paper white        | `#FAFAF8` | Card backgrounds, elevated surfaces        |
| Light grey border  | `#E5E5E5` | Card borders, dividers                     |
| Soft grey surface  | `#F0F0F0` | Secondary backgrounds, inactive areas      |
| Medium grey text   | `#6B6B6B` | Secondary text, labels, placeholder text   |
| Muted gold         | `#C8A24A` | Accent — priority, highlights, active nav  |
| Soft beige         | `#EFE7D0` | Accent — warm background, subtle cards     |
| Muted blush        | `#F3C6BD` | Accent — gentle highlights, calendar marks |
| Sage grey-green    | `#CAD2C5` | Accent — completion, success, calm states  |

## 4. Typography Guidance

- Clean sans-serif for body (Geist, system default)
- Elegant heading treatment with weight differentiation
- Clear hierarchy: display → heading → body → label
- Labels small but readable (minimum 12 px)
- Avoid clutter — use generous whitespace
- Line height: 1.5 for body, 1.25 for headings

## 5. Layout Principles

- **Mobile-first** — phone viewport (375 px) is the primary design target
- Centered `max-w-md` app container on larger screens
- Fixed bottom navigation for core app pages
- Generous bottom padding (`pb-24`) so content does not hide behind nav
- Cards use `rounded-2xl` with border (`border border-grey-border`)
- Prefer border-based cards over heavy shadows
- Subtle shadows only when necessary (elevation, modals)
- Screens should feel calm, spacious, and uncluttered

## 6. Component Principles

- Reusable cards (`Card`)
- Reusable buttons (`Button` — primary, secondary, ghost variants)
- Reusable input fields (`Input` — labelled, consistent spacing)
- Reusable badges (`Badge` — priority, status, module color)
- Reusable navigation (`BottomNavigation` — fixed, icon + label)
- Reusable page headers (`TopBar` — title, optional actions)
- Reusable empty states (`EmptyState` — title, description, optional action)
- Reusable progress indicators (`Progress` — horizontal bar)
- Avoid large monolithic components — compose from smaller pieces

## 7. Screen Design Notes (Future)

Primary screens to implement from mockups:
- Splash / Welcome
- Login
- Home Dashboard
- Calendar Week View
- Add Event
- Modules
- Assignments
- Tests / Exams
- Assignment Details
- Study Session Form
- Module Detail
- Dark Dashboard Overview

## 8. UI States

- **Default state** — normal rendered view
- **Empty state** — title + description + optional CTA
- **Loading state** — skeleton or subtle animation placeholder
- **Error state** — message + retry action
- **Urgent deadline state** — high-priority badge / red-adjacent accent
- **Completed state** — muted text, strikethrough optional, sage-green indicator
- **Disabled state** — reduced opacity, no pointer events
- **Selected tab state** — muted gold or deep black indicator on bottom nav

## 9. Accessibility Notes

- Maintain strong contrast (minimum 4.5:1 for text)
- Touch targets minimum 44×44 px on mobile
- Every input must have a visible label
- Icons must be accompanied by text labels on interactive elements
- Minimum font size 12 px, body text minimum 14 px
- Support `prefers-reduced-motion` where animations are used

## 10. Development Notes

- Use mock data only — `src/lib/mock-data.ts`
- Keep backend concerns separate — no Supabase, no API routes yet
- Build frontend so data fetching can be swapped later (simple function calls, no direct DB)
- Keep types centralized in `src/lib/types.ts`
- Keep data access simple — direct imports from mock-data for now
- No authentication, no AI, no document upload at this stage
