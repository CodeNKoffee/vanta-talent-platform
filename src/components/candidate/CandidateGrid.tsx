import React, { useEffect, useRef, useState } from 'react';
import type { Candidate } from '@/types/candidate';
import { CandidateCard } from './CandidateCard';
import { CandidateCardSkeleton } from '@/components/ui/Skeleton';
import { OrigamiShape } from '@/components/ui/OrigamiShape';
import { HoverFlipText } from '@/components/ui/HoverFlipText';
import styles from './CandidateGrid.module.css';

function AnimatedCardWrapper({ children, index }: { children: React.ReactNode; index: number }) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  // Slow down the stagger effect for a more premium, relaxed feel
  const delay = (index % 12) * 100;

  return (
    <div
      ref={ref}
      className={styles.item}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.8s var(--ease-out) ${delay}ms, transform 0.8s var(--ease-out) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface Props {
  candidates: Candidate[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  onRetry: () => void;
  onSkillClick?: (skill: string) => void;
}

function LoadingGrid() {
  return (
    <div className={styles.grid} aria-label="Loading candidates" aria-busy="true">
      {Array.from({ length: 9 }).map((_, i) => (
        <CandidateCardSkeleton key={i} />
      ))}
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: Error | null; onRetry: () => void }) {
  return (
    <div className={styles.stateBox} role="alert">
      <div className={styles.stateIcon}>⚡</div>
      <h3 className={styles.stateTitle}>Failed to load candidates</h3>
      <p className={styles.stateDesc}>{error?.message ?? 'An unexpected error occurred.'}</p>
      <button className={styles.retryBtn} onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className={styles.stateBox}>
      <div className={styles.emptyIconWrapper}>
        <OrigamiShape 
          type="exclamation" 
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(0.15)'
          }}
        />
      </div>
      <h3 className={styles.stateTitle}>
        <HoverFlipText text="No candidates found" />
      </h3>
      <p className={styles.stateDesc}>
        Try adjusting your search or filters — great talent is out there.
      </p>
    </div>
  );
}

export function CandidateGrid({ candidates, isLoading, isError, error, onRetry, onSkillClick }: Props) {
  const [displayCount, setDisplayCount] = useState<number>(9);
  const [isPaginating, setIsPaginating] = useState<boolean>(false);

  // Reset pagination if filters/candidates change significantly
  useEffect(() => {
    setDisplayCount(9);
  }, [candidates]);

  if (isLoading) return <LoadingGrid />;
  if (isError) return <ErrorState error={error} onRetry={onRetry} />;
  if (candidates.length === 0) return <EmptyState />;

  const displayedCandidates: Candidate[] = candidates.slice(0, displayCount);
  const hasMore: boolean = displayCount < candidates.length;

  const handleLoadMore = () => {
    setIsPaginating(true);
    // Simulate network delay for "Show More" (slowed down for visual effect)
    setTimeout(() => {
      setDisplayCount((prev: number) => prev + 9);
      setIsPaginating(false);
    }, 1200);
  };

  return (
    <div className={styles.grid} aria-label={`${candidates.length} candidates`}>
      {displayedCandidates.map((c: Candidate, i: number) => (
        <AnimatedCardWrapper key={c.id} index={i}>
          <CandidateCard candidate={c} onSkillClick={onSkillClick} />
        </AnimatedCardWrapper>
      ))}
      
      {isPaginating && (
        <>
          {Array.from({ length: Math.min(9, candidates.length - displayCount) }).map((_, i) => (
            <div key={`skeleton-${i}`} className={styles.item}>
              <CandidateCardSkeleton />
            </div>
          ))}
        </>
      )}

      {hasMore && !isPaginating && (
        <div className={styles.pagination}>
          <button 
            className={styles.loadMoreBtn} 
            onClick={handleLoadMore}
            disabled={isPaginating}
          >
            Show More Candidates
          </button>
        </div>
      )}
    </div>
  );
}
