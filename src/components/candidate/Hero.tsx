import React from 'react';
import { getCandidateMeta } from '@/services/candidateService';
import { OrigamiShape } from '@/components/ui/OrigamiShape';
import styles from './Hero.module.css';

export function Hero({ onBrowse }: { onBrowse: () => void }) {
  const { total } = getCandidateMeta();

  return (
    <section className={styles.hero} aria-labelledby="hero-heading">
      <div className={styles.glow} aria-hidden="true" />
      <OrigamiShape 
        type="deer" 
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -60%) scale(1.5)',
          zIndex: 0,
          opacity: 0.15
        }} 
      />

      <div className={styles.content}>
        <div className={styles.eyebrow}>
          <span className={styles.dot} aria-hidden="true" />
          Talent Intelligence Platform
        </div>

        <h1 id="hero-heading" className={styles.heading}>
          Find engineers who
          <br />
          <em className={styles.accent}>actually ship.</em>
        </h1>

        <p className={styles.sub}>
          Discover pre-vetted engineering talent across the MENA region and beyond.
          Every profile scored, every skill verified.
        </p>

        <div className={styles.cta}>
          <button className={styles.ctaBtn} onClick={onBrowse} aria-label="Browse all candidates">
            Browse Talent
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7v10"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className={styles.stats} aria-label="Platform statistics">
        <div className={styles.stat}>
          <span className={styles.statNum}>{total}</span>
          <span className={styles.statLabel}>Candidates</span>
        </div>
        <div className={styles.statDiv} aria-hidden="true" />
        <div className={styles.stat}>
          <span className={styles.statNum}>8+</span>
          <span className={styles.statLabel}>Locations</span>
        </div>
        <div className={styles.statDiv} aria-hidden="true" />
        <div className={styles.stat}>
          <span className={styles.statNum}>40+</span>
          <span className={styles.statLabel}>Skills tracked</span>
        </div>
        <div className={styles.statDiv} aria-hidden="true" />
        <div className={styles.stat}>
          <span className={styles.statNum}>48h</span>
          <span className={styles.statLabel}>Avg. response</span>
        </div>
      </div>
    </section>
  );
}
