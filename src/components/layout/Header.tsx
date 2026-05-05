import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { OrigamiShape } from '@/components/ui/OrigamiShape';
import styles from './Header.module.css';

export function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className={styles.header} role="banner">
      <div className={`container ${styles.inner}`}>
        <Link to="/" className={styles.logo} aria-label="Vanta – go to home">
          <div style={{ width: 22, height: 22, position: 'relative' }}>
            <OrigamiShape 
              type="triangle" 
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%) scale(0.065)',
                opacity: 1
              }}
            />
          </div>
          <span className={styles.logoText}>Vanta</span>
        </Link>

        <nav className={styles.nav} aria-label="Main navigation">
          {isHome && (
            <span className={styles.tagline}>Talent Intelligence</span>
          )}
        </nav>
      </div>
    </header>
  );
}
