import type { Availability, CandidateStatus, Seniority } from './candidate';

// ─── Filter State ───────────────────────────────────────────────────────────

export type SortKey = 'recent' | 'score' | 'experience';

export interface FilterState {
  q: string;
  location: string;
  skill: string;
  availability: Availability | '';
  status: CandidateStatus | '';
  seniority: Seniority | '';
  sort: SortKey;
}

export const DEFAULT_FILTERS: FilterState = {
  q: '',
  location: '',
  skill: '',
  availability: '',
  status: '',
  seniority: '',
  sort: 'recent',
};

// ─── Active Filter Display ──────────────────────────────────────────────────

export interface ActiveFilter {
  key: keyof FilterState;
  label: string;
  value: string;
}
