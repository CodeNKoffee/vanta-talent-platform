# Vanta — Blueprint for Continuation

> This document is the living technical plan for anyone picking up this codebase. It maps what exists, what's partially done, and what comes next — in priority order.

---

## Current State (v0.1 — Assessment Submission)

| Layer | Status |
|---|---|
| Design token system | ✅ Complete |
| Atomic UI components | ✅ Complete (Button, Badge, Tag, Input, Select, Skeleton) |
| Mock data + service layer | ✅ Complete (25 candidates, 600ms simulated latency) |
| URL-driven filter state | ✅ Complete |
| Candidate directory page | ✅ Complete |
| Candidate profile page | ✅ Complete |
| Shortlist / Reject / Status actions | ✅ Complete (localStorage persistence) |
| Error boundaries | ✅ Complete |
| Accessibility baseline | ✅ Complete |
| Tests | ❌ Not yet |
| Real API integration | ❌ Not yet |
| Animations (motion) | 🟡 CSS only — no Framer Motion |

---

## Phase 1 — Test Coverage (Next Sprint)

**Goal:** Confidence before any API integration.

### Files to test

#### `src/utils/candidateFilters.ts`
```ts
// Pure function — test all filter combinations
describe('applyFilters', () => {
  it('filters by query matching name')
  it('filters by query matching skill')
  it('filters by location')
  it('filters by skill exact match')
  it('filters by availability')
  it('filters by status')
  it('filters by seniority')
  it('sorts by score descending')
  it('sorts by experience descending')
  it('sorts by updatedAt descending')
  it('returns empty array for no matches')
  it('chains multiple filters correctly')
})
```

#### `src/hooks/useUrlFilters.ts`
```ts
// Test with MemoryRouter
describe('useUrlFilters', () => {
  it('reads default values from empty params')
  it('writes filter value to URL on setFilters')
  it('resets all params on resetFilters')
  it('derives activeFilters correctly')
  it('excludes default values from URL')
})
```

#### `src/components/candidate/CandidateCard.tsx`
```ts
describe('CandidateCard', () => {
  it('renders candidate name and headline')
  it('shows shortlisted ribbon when shortlisted')
  it('shows rejected state when rejected')
  it('calls onSkillClick with skill on Tag click')
  it('links to /candidate/:id')
  it('displays score correctly')
})
```

**Setup:**
```bash
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

Add to `vite.config.ts`:
```ts
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: './src/test/setup.ts',
}
```

---

## Phase 2 — Real API Integration

**Goal:** Replace `src/data/candidates.json` with a real backend or public API.

### Option A — Airtable (no backend)
Airtable has a REST API and free tier. Map the candidate schema to an Airtable base.

```
src/services/
├── candidateService.ts     ← replace fetchCandidates / fetchCandidateById
└── airtableClient.ts       ← new: typed Airtable REST wrapper
```

```ts
// src/services/airtableClient.ts
const BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const TOKEN   = import.meta.env.VITE_AIRTABLE_TOKEN;

export async function airtableFetch<T>(table: string, params = ''): Promise<T[]> {
  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${table}?${params}`,
    { headers: { Authorization: `Bearer ${TOKEN}` } }
  );
  const data = await res.json();
  return data.records.map((r: AirtableRecord) => mapRecord<T>(r));
}
```

### Option B — Supabase (full backend)
Better for production. Add `@supabase/supabase-js`, create a `candidates` table matching the TypeScript interface.

```ts
// src/services/candidateService.ts (Supabase version)
import { supabase } from '@/lib/supabase';

export async function fetchCandidates(): Promise<Candidate[]> {
  const { data, error } = await supabase.from('candidates').select('*');
  if (error) throw error;
  return data as Candidate[];
}
```

### Caching layer (add with either option)
Replace raw `useEffect` fetching with React Query:

```bash
npm install @tanstack/react-query
```

```ts
// src/hooks/useCandidates.ts (React Query version)
export function useCandidates(filters: FilterState) {
  return useQuery({
    queryKey: ['candidates', filters],
    queryFn: () => fetchCandidates(),
    select: (data) => applyFilters(data, filters),
    staleTime: 5 * 60 * 1000,
  });
}
```

Benefits: deduped requests, background refetch, stale-while-revalidate, built-in loading/error states.

---

## Phase 3 — UX Enhancements

### 3a. Motion & Micro-interactions

Install Framer Motion:
```bash
npm install framer-motion
```

Key animation targets:
- `CandidateCard` — `AnimatePresence` on grid items for filter changes
- `FilterBar` — active filter chips animate in/out
- `CandidateProfilePage` — staggered section reveal on load
- Shortlist/Reject buttons — spring scale on press

```tsx
// Example: grid re-order on filter
import { AnimatePresence, motion } from 'framer-motion';

<AnimatePresence mode="popLayout">
  {candidates.map((c) => (
    <motion.div
      key={c.id}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
    >
      <CandidateCard candidate={c} />
    </motion.div>
  ))}
</AnimatePresence>
```

### 3b. Improved Filter UX — Combobox

Replace `<Select>` for skill/location with a searchable combobox (Radix UI Combobox or custom):
```bash
npm install @radix-ui/react-popover cmdk
```

**New component:** `src/components/ui/Combobox.tsx`
- Keyboard navigable
- Fuzzy search within options
- Multi-select support

### 3c. Infinite Scroll / Virtualised List

For large datasets (100+ candidates):
```bash
npm install @tanstack/react-virtual
```

```tsx
// src/components/candidate/CandidateGrid.tsx
import { useVirtualizer } from '@tanstack/react-virtual';
```

---

## Phase 4 — New Features

### 4a. Recruiter Notes

**State:** Extend `AppContext` with `notes: Record<string, string>`

**UI:** Textarea on profile page, below the actions row
- Debounced save to localStorage (300ms)
- Character count indicator

```ts
// Add to AppContext reducer
| { type: 'SET_NOTE'; id: string; note: string }
```

### 4b. Collections / Saved Searches

Allow recruiters to create named lists:
```
src/
├── store/
│   ├── AppContext.tsx        ← existing
│   └── CollectionContext.tsx ← new: { id, name, candidateIds[] }[]
├── pages/
│   └── CollectionPage.tsx   ← Route: /collection/:id
```

### 4c. Recruiter Auth (Supabase Auth)

Gate the app behind a simple login:
```
src/
├── lib/
│   └── supabase.ts
├── components/
│   └── AuthGuard.tsx         ← redirect to /login if no session
└── pages/
    └── LoginPage.tsx         ← Route: /login
```

### 4d. Candidate Status Pipeline (Kanban view)

New route `/pipeline` — drag candidates between status columns (Open → Interviewing → Hired).

**Dependencies:**
```bash
npm install @dnd-kit/core @dnd-kit/sortable
```

```
src/pages/PipelinePage.tsx
src/components/pipeline/
  ├── KanbanBoard.tsx
  ├── KanbanColumn.tsx
  └── KanbanCard.tsx
```

---

## Phase 5 — Production Hardening

### Performance
- [ ] Route-based code splitting: `React.lazy()` + `Suspense` per page
- [ ] Memoize `applyFilters` with `useMemo` (already done) — verify with React DevTools
- [ ] Bundle analysis: `npm run build -- --report`
- [ ] Image optimisation if avatars become real photos (use `@unpic/react`)

### Observability
- [ ] Error logging: Sentry (`@sentry/react`)
- [ ] Analytics: Posthog or Plausible (privacy-first)

### CI/CD
```yaml
# .github/workflows/ci.yml
- run: npm ci
- run: npm run lint
- run: npm test -- --run
- run: npm run build
```

---

## File Map — Where to Touch for Each Feature

| Feature | Files to touch |
|---|---|
| Add a new filter | `src/types/filters.ts`, `src/utils/candidateFilters.ts`, `src/components/filters/FilterBar.tsx` |
| Add a candidate field | `src/types/candidate.ts`, `src/data/candidates.json`, `src/pages/CandidateProfilePage.tsx` |
| Add a UI component | `src/components/ui/`, add export to `src/components/ui/index.ts` |
| Add a new action (e.g. Note) | `src/store/AppContext.tsx` (action + reducer + context value) |
| Add a new page/route | `src/pages/`, add `<Route>` in `src/App.tsx` |
| Swap mock for real API | `src/services/candidateService.ts` only — hooks don't change |
| Change design tokens | `src/styles/tokens.css` — propagates everywhere |
