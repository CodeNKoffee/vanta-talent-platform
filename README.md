# Vanta — Talent Intelligence

A polished recruitment web experience built with Vite + React + TypeScript.

> **Assessment submission for Pandy AI — Front-End Engineer role.**

---

## Setup

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build
```

---

## Feature Checklist

### Main Recruitment Page (`/`)
- [x] Hero section with product name, tagline, CTA, stats strip
- [x] Candidate directory in responsive grid layout
- [x] Each card: name, headline, location, experience, skill chips, status badge, View Profile
- [x] Search by name, skill, and headline
- [x] Filters: location, skill, seniority, availability, status (5 filters)
- [x] Sort: recently updated, highest score, most experience
- [x] Results count with live `aria-live` update
- [x] Active filter chips with individual remove + Reset all
- [x] Loading state — skeleton cards (9 placeholders)
- [x] Error state — with retry
- [x] Empty state — friendly copy
- [x] Responsive: single column on mobile, auto-fill grid on desktop

### Candidate Profile Page (`/candidate/:id`)
- [x] Profile header: name, headline, status badge
- [x] Quick-meta row: location, experience, seniority, availability
- [x] About section
- [x] Skills chips
- [x] Experience timeline (multi-entry with connecting line)
- [x] Sidebar: match score ring, structured metadata panel, social links
- [x] Breadcrumb navigation back to directory
- [x] Shortlist / Reject toggle actions — immediately reflected in UI
- [x] Move Status dropdown — overrides displayed status on card and profile
- [x] State persisted to `localStorage` — actions survive page refresh and navigate-back
- [x] Shortlisted/Rejected visual indicators appear on directory cards

### Premium Additions ✨
- [x] **Installable PWA**: Configured with `vite-plugin-pwa` for standalone desktop/mobile installation.
- [x] **Push Notifications**: On-mount permission request with a mock daily scheduling system set to fire locally at 8:00 AM (local time) to emulate recruitment updates.
- [x] **RxJS Custom Cursor**: High-performance mouse trailing and interactive hover state using `animationFrames` instead of standard `requestAnimationFrame`.
- [x] **WebGL 3D Origami**: Custom `OrigamiShape` built with `three.js` (no heavy models) to render dynamic ambient 3D shapes (Deer, Triangle, Exclamation).
- [x] **Interactive Typography**: `HoverFlipText` component creating immersive letter-by-letter 3D flips on hover.
- [x] **Simulated Lazy Pagination**: "Show More" interaction that elegantly un-mounts a skeleton state and gracefully staggers in new cards.

---

## Technical Focus Areas Implemented

### 1. URL-driven state (query params)
All search, filter, and sort state lives in the URL (`?q=react&seniority=Senior&sort=score`). Shareable links, browser back/forward works, filters survive refresh. Implemented in `src/hooks/useUrlFilters.ts`.

### 2. State management (Context + useReducer)
`AppContext` manages shortlist, reject, and status override state with a reducer pattern. Persisted to `localStorage` for cross-session continuity. Actions are `useCallback`-memoised to prevent unnecessary re-renders.

### 3. Reusable component system + design tokens
Full design token system in `src/styles/tokens.css` (colors, typography scale, spacing, radius, shadows, transitions). Atomic components: `Button`, `Badge`, `Tag`, `Input`, `Select`, `Skeleton` — all accept className overrides and compose cleanly.

### 4. Accessibility enhancements
- Semantic HTML (`main`, `section`, `article`, `nav`, `aside`, `dl`)
- All interactive elements have `aria-label` or associated `<label>`
- `aria-pressed` on toggle buttons (Shortlist/Reject)
- `aria-live="polite"` on results count for screen readers
- `aria-busy` on loading grid
- Full keyboard navigation (focus states on all interactive elements via `:focus-visible`)
- Status badge uses `role="img"` with `aria-label` on SVG score arc
- Breadcrumb uses `aria-current="page"`

### 5. Error boundary + fallback UI
Class-based `ErrorBoundary` wraps both the app root and the profile route independently. The profile route can fail without breaking the main page. Graceful error states in the grid (with retry callback) and profile page (with back navigation).

### 6. Strong type safety
- All data types in `src/types/` with strict interfaces
- No `any` anywhere in the codebase
- `CandidateStatus`, `Availability`, `Seniority` are string literal union types
- `FilterState` typed with discriminated keys matching URL param names
- Service layer returns typed `Candidate[]` / `Candidate` — JSON cast once at module level

---

## Data Approach

**Mock data** — 25 rich candidate profiles in `src/data/candidates.json`.

Each candidate has all required fields plus: `about`, `experience[]`, `education`, `languages`, `salaryExpectation`, and optional `github`/`linkedin`/`portfolio` links. The service layer (`src/services/candidateService.ts`) wraps fetches with a 600ms simulated delay to show skeleton states realistically.

---

## Architecture

```
src/
├── types/           # TypeScript interfaces (candidate, filters)
├── data/            # Mock JSON (25 candidates)
├── services/        # candidateService — simulated async API layer
├── store/           # AppContext — shortlist/reject/status state
├── hooks/           # useCandidates, useCandidate, useUrlFilters
├── utils/           # candidateFilters (pure), formatters (pure)
├── styles/          # tokens.css + global.css
├── components/
│   ├── ui/          # Button, Badge, Tag, Input, Select, Skeleton
│   ├── layout/      # Header
│   ├── candidate/   # Hero, CandidateCard, CandidateGrid
│   └── filters/     # FilterBar
├── pages/           # RecruitmentPage, CandidateProfilePage
└── App.tsx          # Router root + providers
```

---

## Tradeoffs & Next Improvements

| Tradeoff | Rationale |
|---|---|
| No test suite | Prioritised polish and architecture within timebox; hooks and utils are pure functions — straightforward to test with Vitest |
| localStorage (not URL) for actions | Shortlist/reject state is user-session data, not shareable state — localStorage is the right primitive here |
| Mock data vs real API | 25 curated profiles demonstrate richer UX than random API data with missing fields |
| Single CSS bundle | CSS Modules per component avoids global collisions without a build step overhead |

### Next Improvements
- Add Vitest + Testing Library tests for `applyFilters`, `useUrlFilters`, and `CandidateCard`
- Keyboard-navigable filter panel (combobox pattern for skill/location dropdowns)
- Optimistic mutations with a proper cache layer (React Query or SWR)
- Virtualised list for large datasets (TanStack Virtual)
- Saved searches / collections beyond shortlist
- Recruiter notes per candidate (textarea → localStorage)
- Pagination or infinite scroll
- Dark/light mode toggle (tokens are already structured for it)
