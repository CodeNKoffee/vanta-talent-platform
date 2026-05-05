import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCandidate } from '@/hooks/useCandidate';
import { useAppContext } from '@/store/AppContext';
import { StatusBadge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Input';
import { Skeleton } from '@/components/ui/Skeleton';
import type { CandidateStatus, ExperienceEntry } from '@/types/candidate';
import {
  relativeDate,
  formatExperience,
  getInitials,
  nameToHue,
} from '@/utils/formatters';
import { OrigamiShape } from '@/components/ui/OrigamiShape';
import styles from './CandidateProfilePage.module.css';

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className={styles.page} aria-busy="true" aria-label="Loading profile">
      <div className={styles.headerCard}>
        <div className={styles.headerTop}>
          <Skeleton width={80} height={80} borderRadius="50%" />
          <div className={styles.headerInfo}>
            <Skeleton width="50%" height={28} borderRadius="8px" />
            <Skeleton width="70%" height={16} borderRadius="4px" />
            <Skeleton width={100} height={24} borderRadius="999px" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorView({ message, onBack }: { message: string; onBack: () => void }) {
  return (
    <div className={styles.errorState} role="alert">
      <div className={styles.errorIcon}>◎</div>
      <h2 className={styles.errorTitle}>Candidate not found</h2>
      <p className={styles.errorDesc}>{message}</p>
      <Button variant="secondary" onClick={onBack}>← Back to directory</Button>
    </div>
  );
}

function Avatar({ name, size = 80 }: { name: string; size?: number }) {
  const hue = nameToHue(name);
  return (
    <div
      className={styles.avatar}
      style={{
        '--avatar-hue': hue,
        width: size,
        height: size,
        fontSize: size * 0.32,
      } as React.CSSProperties}
      aria-hidden="true"
    >
      {getInitials(name)}
    </div>
  );
}

function ExperienceCard({ entry }: { entry: ExperienceEntry }) {
  return (
    <div className={styles.expCard}>
      <div className={styles.expTimeline}>
        <div className={styles.expDot} aria-hidden="true" />
        <div className={styles.expLine} aria-hidden="true" />
      </div>
      <div className={styles.expBody}>
        <div className={styles.expHeader}>
          <div>
            <h4 className={styles.expTitle}>{entry.title}</h4>
            <p className={styles.expCompany}>{entry.company}</p>
          </div>
          <span className={styles.expPeriod}>{entry.period}</span>
        </div>
        <p className={styles.expDesc}>{entry.description}</p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS: { value: CandidateStatus; label: string }[] = [
  { value: 'Open to work',  label: 'Open to work' },
  { value: 'Interviewing',  label: 'Interviewing' },
  { value: 'Hired',         label: 'Hired' },
  { value: 'Not looking',   label: 'Not looking' },
];

export function CandidateProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { candidate, isLoading, isError, error } = useCandidate(id);
  const { isShortlisted, isRejected, getStatus, shortlist, unshortlist, reject, unreject, setStatus } =
    useAppContext();

  const handleBack = useCallback(() => navigate(-1), [navigate]);

  if (isLoading) return <ProfileSkeleton />;
  if (isError || !candidate) {
    return (
      <div className="container">
        <ErrorView message={error?.message ?? 'Unknown error'} onBack={handleBack} />
      </div>
    );
  }

  const shortlisted = isShortlisted(candidate.id);
  const rejected    = isRejected(candidate.id);
  const effectiveStatus = getStatus(candidate.id, candidate.status);

  const toggleShortlist = () =>
    shortlisted ? unshortlist(candidate.id) : shortlist(candidate.id);

  const toggleReject = () =>
    rejected ? unreject(candidate.id) : reject(candidate.id);

  return (
    <main className={`${styles.page} container`}>
      {/* ── Breadcrumb ── */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link to="/" className={styles.backButton}>← All candidates</Link>
        <span className={styles.breadSep} aria-hidden="true">|</span>
        <Link to="/" className={styles.breadLink}>Directory</Link>
        <span className={styles.breadSep} aria-hidden="true">›</span>
        <span className={styles.breadCurrent} aria-current="page">{candidate.fullName}</span>
      </nav>

      <div className={styles.layout}>
        {/* ═══════════════════════════════ LEFT COLUMN ═══════════════════════════════ */}
        <div className={styles.mainCol}>

          {/* ── Profile header card ── */}
          <section className={styles.headerCard} aria-labelledby="profile-name">
            <div className={styles.headerBg} aria-hidden="true" style={{ '--hue': nameToHue(candidate.fullName) } as React.CSSProperties} />

            <div className={styles.headerTop}>
              <Avatar name={candidate.fullName} size={80} />
              <div className={styles.headerInfo}>
                <h1 id="profile-name" className={styles.name}>{candidate.fullName}</h1>
                <p className={styles.headline}>{candidate.headline}</p>
                <div className={styles.statusRow}>
                  <StatusBadge status={effectiveStatus} />
                  {shortlisted && (
                    <span className={styles.shortlistPill}>⋆ Shortlisted</span>
                  )}
                  {rejected && (
                    <span className={styles.rejectedPill}>Rejected</span>
                  )}
                </div>
              </div>
            </div>

            {/* ── Quick-meta row ── */}
            <div className={styles.quickMeta} aria-label="Candidate summary">
              <span className={styles.qm}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                {candidate.location}
              </span>
              <span className={styles.qmDiv} aria-hidden="true" />
              <span className={styles.qm}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 7V5a2 2 0 00-4 0v2M8 7V5a2 2 0 00-4 0v2"/>
                </svg>
                {formatExperience(candidate.yearsOfExperience)} experience
              </span>
              <span className={styles.qmDiv} aria-hidden="true" />
              <span className={styles.qm}>{candidate.seniority} level</span>
              <span className={styles.qmDiv} aria-hidden="true" />
              <span className={styles.qm}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
                {candidate.availability}
              </span>
            </div>

            {/* ── Actions ── */}
            <div className={styles.actions} role="group" aria-label="Candidate actions">
              <Button
                variant={shortlisted ? 'primary' : 'primary-outline'}
                size="md"
                onClick={toggleShortlist}
                aria-pressed={shortlisted}
                icon={<span aria-hidden="true">{shortlisted ? '★' : '☆'}</span>}
              >
                {shortlisted ? 'Shortlisted' : 'Shortlist'}
              </Button>

              <Button
                variant={rejected ? 'danger' : 'danger-outline'}
                size="md"
                onClick={toggleReject}
                aria-pressed={rejected}
                icon={<span aria-hidden="true">✕</span>}
              >
                {rejected ? 'Undo Reject' : 'Reject'}
              </Button>

              {/* Move status dropdown */}
              <div className={styles.statusSelect}>
                <label htmlFor="status-select" className="sr-only">Change candidate status</label>
                <Select
                  id="status-select"
                  options={STATUS_OPTIONS}
                  value={effectiveStatus}
                  onChange={(e) => setStatus(candidate.id, e.target.value as CandidateStatus)}
                  aria-label="Change status"
                />
              </div>
            </div>
          </section>

          {/* ── About ── */}
          <section className={styles.section} style={{ animationDelay: '0.2s' }} aria-labelledby="about-heading">
            <h2 id="about-heading" className={styles.sectionTitle}>About</h2>
            <p className={styles.aboutText}>{candidate.about}</p>
          </section>

          {/* ── Skills ── */}
          <section className={styles.section} style={{ animationDelay: '0.3s' }} aria-labelledby="skills-heading">
            <h2 id="skills-heading" className={styles.sectionTitle}>Skills</h2>
            <div className={styles.skillsGrid}>
              {candidate.skills.map((skill) => (
                <Tag key={skill} label={skill} />
              ))}
            </div>
          </section>

          {/* ── Experience ── */}
          <section className={styles.section} style={{ animationDelay: '0.4s' }} aria-labelledby="experience-heading">
            <h2 id="experience-heading" className={styles.sectionTitle}>Experience</h2>
            <div className={styles.timeline}>
              {candidate.experience.map((entry) => (
                <ExperienceCard key={entry.id} entry={entry} />
              ))}
            </div>
          </section>

        </div>

        {/* ═══════════════════════════════ SIDEBAR ═══════════════════════════════════ */}
        <aside className={styles.sidebar} aria-label="Candidate metadata">

          {/* ── Score card ── */}
          <div className={styles.sideCard} style={{ animationDelay: '0.25s' }}>
            <h3 className={styles.sideTitle}>Match Score</h3>
            <ScoreRing score={candidate.score} />
          </div>

          {/* ── Metadata ── */}
          <div className={styles.sideCard} style={{ animationDelay: '0.35s' }}>
            <h3 className={styles.sideTitle}>Details</h3>
            <dl className={styles.metaList}>
              <MetaItem label="Availability" value={candidate.availability} />
              <MetaItem label="Seniority" value={candidate.seniority} />
              <MetaItem label="Location" value={candidate.location} />
              <MetaItem label="Languages" value={candidate.languages.join(', ')} />
              {candidate.salaryExpectation && (
                <MetaItem label="Expected salary" value={candidate.salaryExpectation} />
              )}
              <MetaItem label="Last updated" value={relativeDate(candidate.updatedAt)} />
              <MetaItem label="Education" value={`${candidate.education.degree}, ${candidate.education.institution} (${candidate.education.year})`} />
            </dl>
          </div>

          {/* ── Links ── */}
          {(candidate.github || candidate.linkedin || candidate.portfolio) && (
            <div className={styles.sideCard} style={{ animationDelay: '0.45s' }}>
              <h3 className={styles.sideTitle}>Links</h3>
              <div className={styles.links}>
                {candidate.github && (
                  <a href={candidate.github} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    <GithubIcon />
                    GitHub
                  </a>
                )}
                {candidate.linkedin && (
                  <a href={candidate.linkedin} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    <LinkedInIcon />
                    LinkedIn
                  </a>
                )}
                {candidate.portfolio && (
                  <a href={candidate.portfolio} target="_blank" rel="noopener noreferrer" className={styles.link}>
                    <PortfolioIcon />
                    Portfolio
                  </a>
                )}
              </div>
            </div>
          )}

        </aside>
      </div>
    </main>
  );
}

// ─── Score Ring SVG ───────────────────────────────────────────────────────────

function ScoreRing({ score }: { score: number }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const [currentScore, setCurrentScore] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

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
    <div className={styles.scoreDisplay} ref={ref}>
      <svg width="96" height="96" viewBox="0 0 96 96" aria-label={`Match score: ${score} out of 100`} role="img">
        <circle cx="48" cy="48" r={r} fill="none" stroke="var(--c-surface-3)" strokeWidth="5" />
        <circle
          cx="48" cy="48" r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={`${filled} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 48 48)"
        />
      </svg>
      <OrigamiShape 
        type="deer" 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scale(0.18)',
          opacity: 0.1,
          zIndex: 0
        }}
      />
      <div className={styles.scoreLabel} style={{ position: 'relative', zIndex: 1 }}>
        <span className={styles.scoreNum}>{currentScore}</span>
        <span className={styles.scoreMax}>/100</span>
      </div>
    </div>
  );
}

// ─── Metadata item ────────────────────────────────────────────────────────────

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className={styles.metaLabel}>{label}</dt>
      <dd className={styles.metaValue}>{value}</dd>
    </>
  );
}

// ─── Icon helpers ─────────────────────────────────────────────────────────────

function GithubIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.28-.01-1.04-.01-2.04-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.32-1.75-1.32-1.75-1.08-.74.08-.73.08-.73 1.2.09 1.83 1.23 1.83 1.23 1.06 1.82 2.79 1.29 3.47.99.11-.77.41-1.29.75-1.59-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.31-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.01 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.25 2.87.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.22.7.82.58C20.57 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.44-2.14 2.93v5.68H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.37 4.25 5.44v6.3zM5.34 7.43a2.07 2.07 0 110-4.14 2.07 2.07 0 010 4.14zM3.56 20.45h3.55V9H3.56v11.45zM22.22 0H1.78C.8 0 0 .78 0 1.73v20.54C0 23.2.8 24 1.78 24h20.44c.98 0 1.78-.8 1.78-1.73V1.73C24 .78 23.2 0 22.22 0z"/>
    </svg>
  );
}

function PortfolioIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}
