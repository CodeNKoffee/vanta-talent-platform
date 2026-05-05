import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

export function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Link to="/" className={styles.logo} aria-label="Vanta – go to home">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M11 2L20 19H2L11 2Z" fill="var(--c-primary)" />
            </svg>
            <span className={styles.logoText}>Vanta</span>
          </Link>
          <p className={styles.tagline}>Talent Intelligence Platform</p>
        </div>

        <nav className={styles.links} aria-label="Footer navigation">
          <div className={styles.linkGroup}>
            <h4 className={styles.groupTitle}>Legal</h4>
            <a href="#" className={styles.link}>Terms of Service</a>
            <a href="#" className={styles.link}>Privacy Policy</a>
            <a href="#" className={styles.link}>Cookie Policy (GDPR)</a>
          </div>
          <div className={styles.linkGroup}>
            <h4 className={styles.groupTitle}>Company</h4>
            <a href="#" className={styles.link}>About Us</a>
            <a href="#" className={styles.link}>Contact</a>
          </div>
        </nav>
      </div>
      <div className={styles.bottom}>
        <div className="container">
          <p className={styles.copy}>&copy; {new Date().getFullYear()} Vanta. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
