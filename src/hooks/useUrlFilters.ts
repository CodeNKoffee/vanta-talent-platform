import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_FILTERS, type FilterState, type SortKey, type ActiveFilter } from '@/types/filters';
import type { Availability, CandidateStatus, Seniority } from '@/types/candidate';

// ─── URL ↔ FilterState bridge ────────────────────────────────────────────────

function readParams(params: URLSearchParams): FilterState {
  return {
    q: params.get('q') ?? DEFAULT_FILTERS.q,
    location: params.get('location') ?? DEFAULT_FILTERS.location,
    skill: params.get('skill') ?? DEFAULT_FILTERS.skill,
    availability: (params.get('availability') as Availability | '') ?? DEFAULT_FILTERS.availability,
    status: (params.get('status') as CandidateStatus | '') ?? DEFAULT_FILTERS.status,
    seniority: (params.get('seniority') as Seniority | '') ?? DEFAULT_FILTERS.seniority,
    sort: (params.get('sort') as SortKey) ?? DEFAULT_FILTERS.sort,
  };
}

function toParams(filters: FilterState): Record<string, string> {
  const entries: Record<string, string> = {};
  (Object.keys(filters) as (keyof FilterState)[]).forEach((key) => {
    const val = filters[key];
    if (val && val !== DEFAULT_FILTERS[key]) {
      entries[key] = val;
    }
  });
  return entries;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useUrlFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => readParams(searchParams), [searchParams]);

  const setFilters = useCallback(
    (update: Partial<FilterState>) => {
      setSearchParams((prev) => {
        const current = readParams(prev);
        const merged = { ...current, ...update };
        return toParams(merged);
      }, { replace: true });
    },
    [setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const activeFilters = useMemo((): ActiveFilter[] => {
    const result: ActiveFilter[] = [];
    if (filters.q) result.push({ key: 'q', label: 'Search', value: filters.q });
    if (filters.location) result.push({ key: 'location', label: 'Location', value: filters.location });
    if (filters.skill) result.push({ key: 'skill', label: 'Skill', value: filters.skill });
    if (filters.availability) result.push({ key: 'availability', label: 'Availability', value: filters.availability });
    if (filters.status) result.push({ key: 'status', label: 'Status', value: filters.status });
    if (filters.seniority) result.push({ key: 'seniority', label: 'Seniority', value: filters.seniority });
    return result;
  }, [filters]);

  const hasActiveFilters = activeFilters.length > 0;

  return { filters, setFilters, resetFilters, activeFilters, hasActiveFilters };
}
