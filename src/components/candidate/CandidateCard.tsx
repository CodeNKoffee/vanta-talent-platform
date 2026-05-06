import React, { memo, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Candidate } from '@/types/candidate';
import { StatusBadge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';
import { useAppContext } from '@/store/AppContext';
import { formatExperience, getInitials, nameToHue, relativeDate } from '@/utils/formatters';
import styles from './CandidateCard.module.css';

interface Props {
  candidate: Candidate;
  /** Current search query, to allow skill filter shortcut */
  onSkillClick?: (skill: string) => void;
}

function ScoreArc({ score }: { score: number }) {
  const r = 17;
  const circ = 2 * Math.PI * r;
  const [currentScore, setCurrentScore] = useState(0);
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    let animationFrame: number;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const duration = 1200; // moderate speed
          const startTime = performance.now();

          const animate = (time: number) => {
            const elapsed = time - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // ease-out-quart
            const easeOut = 1 - Math.pow(1 - progress, 4);
            
            setCurrentScore(Math.round(easeOut * score));

            if (progress < 1) {
              animationFrame = requestAnimationFrame(animate);
            }
          };
          
          animationFrame = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    
    return () => {
      observer.disconnect();
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [score]);

  const filled = (currentScore / 100) * circ;
  const color = score >= 80 ? 'var(--c-primary)' : score >= 60 ? 'var(--c-accent)' : 'var(--c-text-3)';

  return (
    <svg ref={ref} width="46" height="46" viewBox="0 0 46 46" aria-label={`Score: ${score}`} role="img">
      <circle cx="23" cy="23" r={r} fill="none" stroke="var(--c-surface-3)" strokeWidth="3" />
      <circle
        cx="23" cy="23" r={r}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeDasharray={`${filled} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 23 23)"
      />
      <text
        x="23" y="27"
        textAnchor="middle"
        fontSize="11"
        fontWeight="600"
        fontFamily="var(--font-body)"
        fill={color}
      >
        {currentScore}
      </text>
    </svg>
  );
}

function Avatar({ name }: { name: string }) {
  const hue = nameToHue(name);
  const initials = getInitials(name);
  return (
    <div
      className={styles.avatar}
      style={{ '--avatar-hue': hue } as React.CSSProperties}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

export const CandidateCard = memo(function CandidateCard({ candidate, onSkillClick }: Props) {
  const navigate = useNavigate();
  const { isShortlisted, isRejected, getStatus } = useAppContext();
  const shortlisted = isShortlisted(candidate.id);
  const rejected = isRejected(candidate.id);
  const effectiveStatus = getStatus(candidate.id, candidate.status);
  const visibleSkills = candidate.skills.slice(0, 5);

  const cardClass = [
    styles.card,
    shortlisted ? styles.shortlisted : '',
    rejected ? styles.rejected : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on an interactive element inside the card like a button or tag
    if ((e.target as HTMLElement).closest('button')) return;
    navigate(`/candidate/${candidate.id}`);
  };

  return (
    <article 
      className={cardClass} 
      aria-label={`${candidate.fullName} – ${candidate.headline}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick(e as unknown as React.MouseEvent);
        }
      }}
    >
      {shortlisted && (
        <div className={styles.shortlistRibbon} aria-label="Shortlisted">⋆ Shortlisted</div>
      )}
      {rejected && (
        <div className={styles.rejectRibbon} aria-label="Rejected">Rejected</div>
      )}

      {/* ── Top row ── */}
      <div className={styles.top}>
        <Avatar name={candidate.fullName} />
        <div className={styles.nameBlock}>
          <h3 className={styles.name}>{candidate.fullName}</h3>
          <p className={styles.headline}>{candidate.headline}</p>
        </div>
        <ScoreArc score={candidate.score} />
      </div>

      {/* ── Meta row ── */}
      <div className={styles.meta}>
        <span className={styles.metaItem}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          {candidate.location}
        </span>
        <span className={styles.dot}>·</span>
        <span className={styles.metaItem}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-4 0v2M8 7V5a2 2 0 00-4 0v2"/>
          </svg>
          {formatExperience(candidate.yearsOfExperience)}
        </span>
        <span className={styles.dot}>·</span>
        <span className={styles.metaItem}>{candidate.seniority}</span>
      </div>

      {/* ── Status badge ── */}
      <StatusBadge status={effectiveStatus} />

      {/* ── Skills ── */}
      <div className={styles.skills} aria-label="Skills">
        {visibleSkills.map((skill) => (
          <Tag
            key={skill}
            label={skill}
            onClick={onSkillClick ? () => onSkillClick(skill) : undefined}
          />
        ))}
        {candidate.skills.length > 5 && (
          <span className={styles.moreSkills}>+{candidate.skills.length - 5}</span>
        )}
      </div>

      {/* ── Footer ── */}
      <div className={styles.footer}>
        <span
          className={styles.viewBtn}
          aria-hidden="true"
        >
          View Profile →
        </span>
        <span className={styles.updated} title={`Last updated ${candidate.updatedAt}`}>
          {relativeDate(candidate.updatedAt)}
        </span>
      </div>
    </article>
  );
});
