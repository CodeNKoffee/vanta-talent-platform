import React from 'react';
import styles from './Tag.module.css';

interface TagProps {
  label: string;
  onClick?: () => void;
  active?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

export function Tag({ label, onClick, active = false, removable = false, onRemove }: TagProps) {
  const cls = [styles.tag, active ? styles.active : '', onClick ? styles.clickable : '']
    .filter(Boolean)
    .join(' ');

  return (
    <span
      className={cls}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      aria-pressed={onClick ? active : undefined}
    >
      {label}
      {removable && (
        <button
          className={styles.remove}
          onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
          aria-label={`Remove ${label}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
