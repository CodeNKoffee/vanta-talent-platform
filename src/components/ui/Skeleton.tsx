import React from 'react';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
}

export function Skeleton({ width, height, borderRadius, className = '' }: SkeletonProps) {
  return (
    <span
      className={[styles.skeleton, className].join(' ')}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

export function CandidateCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.cardTop}>
        <Skeleton width={48} height={48} borderRadius="50%" />
        <div className={styles.cardInfo}>
          <Skeleton width="60%" height={16} borderRadius="4px" />
          <Skeleton width="80%" height={12} borderRadius="4px" />
        </div>
        <Skeleton width={80} height={22} borderRadius="999px" />
      </div>
      <Skeleton width="40%" height={12} borderRadius="4px" />
      <div className={styles.tags}>
        <Skeleton width={60} height={22} borderRadius="999px" />
        <Skeleton width={80} height={22} borderRadius="999px" />
        <Skeleton width={50} height={22} borderRadius="999px" />
        <Skeleton width={70} height={22} borderRadius="999px" />
      </div>
      <div className={styles.footer}>
        <Skeleton width={100} height={34} borderRadius="8px" />
        <Skeleton width={40} height={40} borderRadius="50%" />
      </div>
    </div>
  );
}
