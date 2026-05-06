import { useId, useMemo } from 'react';
import type { FilterState } from '@/types/filters';
import type { ActiveFilter } from '@/types/filters';
import { Select } from '@/components/ui/Input';
import { Tag } from '@/components/ui/Tag';
import { getCandidateMeta } from '@/services/candidateService';
import styles from './FilterBar.module.css';

const AVAILABILITY_OPTIONS = [
  { value: '', label: 'Any availability' },
  { value: 'Immediate', label: 'Immediate' },
  { value: '2 weeks', label: '2 weeks' },
  { value: '1 month', label: '1 month' },
  { value: '3 months', label: '3 months' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'Any status' },
  { value: 'Open to work', label: 'Open to work' },
  { value: 'Interviewing', label: 'Interviewing' },
  { value: 'Hired', label: 'Hired' },
  { value: 'Not looking', label: 'Not looking' },
];

const SENIORITY_OPTIONS = [
  { value: '', label: 'Any level' },
  { value: 'Junior', label: 'Junior' },
  { value: 'Mid', label: 'Mid' },
  { value: 'Senior', label: 'Senior' },
  { value: 'Lead', label: 'Lead' },
  { value: 'Principal', label: 'Principal' },
];

const SORT_OPTIONS = [
  { value: 'recent', label: 'Recently updated' },
  { value: 'score', label: 'Highest score' },
  { value: 'experience', label: 'Most experience' },
];

interface Props {
  filters: FilterState;
  total: number;
  activeFilters: ActiveFilter[];
  hasActiveFilters: boolean;
  onUpdate: (update: Partial<FilterState>) => void;
  onReset: () => void;
}

export function FilterBar({
  filters,
  total,
  activeFilters,
  hasActiveFilters,
  onUpdate,
  onReset,
}: Props) {
  const { locations, skills } = useMemo(() => getCandidateMeta(), []);
  const searchId = useId();

  const locationOptions = useMemo(
    () => [
      { value: '', label: 'Any location' },
      ...locations.map((l) => ({ value: l, label: l })),
    ],
    [locations],
  );

  const skillOptions = useMemo(
    () => [
      { value: '', label: 'Any skill' },
      ...skills.map((s) => ({ value: s, label: s })),
    ],
    [skills],
  );

  return (
    <section className={styles.bar} aria-label="Search and filter candidates">
      {/* ── Row 1: Search + Sort ── */}
      <div className={styles.topRow}>
        <div className={styles.searchWrap}>
          <label htmlFor={searchId} className="sr-only">Search candidates by name, skill or headline</label>
          <div className={styles.searchField}>
            <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              id={searchId}
              type="search"
              className={styles.searchInput}
              placeholder="Search name, skill, headline…"
              value={filters.q}
              onChange={(e) => onUpdate({ q: e.target.value })}
              aria-label="Search candidates"
            />
            {filters.q && (
              <button className={styles.clearSearch} onClick={() => onUpdate({ q: '' })} aria-label="Clear search">
                ×
              </button>
            )}
          </div>
        </div>

        <div className={styles.sortWrap}>
          <Select
            id="sort-select"
            className={styles.sortSelect}
            inlinePrefix="Sort:"
            options={SORT_OPTIONS}
            value={filters.sort}
            onChange={(e) => onUpdate({ sort: e.target.value as FilterState['sort'] })}
          />
        </div>
      </div>

      {/* ── Row 2: Filters ── */}
      <div className={styles.filterRow} role="group" aria-label="Filter candidates">
        <Select
          options={locationOptions}
          value={filters.location}
          onChange={(e) => onUpdate({ location: e.target.value })}
          aria-label="Filter by location"
        />
        <Select
          options={skillOptions}
          value={filters.skill}
          onChange={(e) => onUpdate({ skill: e.target.value })}
          aria-label="Filter by skill"
        />
        <Select
          options={SENIORITY_OPTIONS}
          value={filters.seniority}
          onChange={(e) => onUpdate({ seniority: e.target.value as FilterState['seniority'] })}
          aria-label="Filter by seniority"
        />
        <Select
          options={AVAILABILITY_OPTIONS}
          value={filters.availability}
          onChange={(e) => onUpdate({ availability: e.target.value as FilterState['availability'] })}
          aria-label="Filter by availability"
        />
        <Select
          options={STATUS_OPTIONS}
          value={filters.status}
          onChange={(e) => onUpdate({ status: e.target.value as FilterState['status'] })}
          aria-label="Filter by status"
        />
      </div>

      {/* ── Row 3: Results + Active filters ── */}
      <div className={styles.metaRow}>
        <span className={styles.count} aria-live="polite" aria-atomic="true">
          <strong>{total}</strong> {total === 1 ? 'candidate' : 'candidates'}
        </span>

        {hasActiveFilters && (
          <div className={styles.activeFilters} aria-label="Active filters">
            {activeFilters.map((f) => (
              <Tag
                key={f.key}
                label={`${f.label}: ${f.value}`}
                removable
                active
                onRemove={() => onUpdate({ [f.key]: '' } as Partial<FilterState>)}
              />
            ))}
            <button className={styles.resetAll} onClick={onReset} aria-label="Reset all filters">
              Reset all
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
