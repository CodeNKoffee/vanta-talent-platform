import React, { useCallback, useRef } from 'react';
import { Hero } from '@/components/candidate/Hero';
import { CandidateGrid } from '@/components/candidate/CandidateGrid';
import { FilterBar } from '@/components/filters/FilterBar';
import { useCandidates } from '@/hooks/useCandidates';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import styles from './RecruitmentPage.module.css';

export function RecruitmentPage() {
  const { filters, setFilters, resetFilters, activeFilters, hasActiveFilters } = useUrlFilters();
  const { candidates, total, isLoading, isError, error, retry } = useCandidates(filters);
  const directoryRef = useRef<HTMLElement>(null);

  const scrollToDirectory = useCallback(() => {
    directoryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const handleSkillClick = useCallback(
    (skill: string) => setFilters({ skill }),
    [setFilters],
  );

  return (
    <main className={styles.page}>
      <div className="container">
        <Hero onBrowse={scrollToDirectory} />

        <section
          ref={directoryRef}
          className={styles.directory}
          aria-labelledby="directory-heading"
        >
          <div className={styles.dirHeader}>
            <h2 id="directory-heading" className={styles.dirTitle}>
              Candidate Directory
            </h2>
            <p className={styles.dirSub}>
              All candidates are scored across experience, skills, and availability signals.
            </p>
          </div>

          <FilterBar
            filters={filters}
            total={isLoading ? 0 : total}
            activeFilters={activeFilters}
            hasActiveFilters={hasActiveFilters}
            onUpdate={setFilters}
            onReset={resetFilters}
          />

          <CandidateGrid
            candidates={candidates}
            isLoading={isLoading}
            isError={isError}
            error={error}
            onRetry={retry}
            onSkillClick={handleSkillClick}
          />
        </section>
      </div>
    </main>
  );
}
