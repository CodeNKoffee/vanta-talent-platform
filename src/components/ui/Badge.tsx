import type { CandidateStatus } from '@/types/candidate';
import styles from './Badge.module.css';

type BadgeVariant = 'open' | 'interviewing' | 'hired' | 'not-looking' | 'default';

interface BadgeProps {
  status: CandidateStatus | string;
  className?: string;
}

function getVariant(status: string): BadgeVariant {
  switch (status) {
    case 'Open to work':  return 'open';
    case 'Interviewing':  return 'interviewing';
    case 'Hired':         return 'hired';
    case 'Not looking':   return 'not-looking';
    default:              return 'default';
  }
}

export function StatusBadge({ status, className = '' }: BadgeProps) {
  const variant = getVariant(status);
  return (
    <span className={[styles.badge, styles[variant], className].filter(Boolean).join(' ')}>
      <span className={styles.dot} aria-hidden="true" />
      {status}
    </span>
  );
}

/* ─── Generic small label badge ─────────────────────────────────────────────── */
interface LabelBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'accent' | 'neutral';
  className?: string;
}

export function LabelBadge({ children, variant = 'neutral', className = '' }: LabelBadgeProps) {
  return (
    <span className={[styles.label, styles[`label-${variant}`], className].filter(Boolean).join(' ')}>
      {children}
    </span>
  );
}

import React from 'react'; // needed for JSX
