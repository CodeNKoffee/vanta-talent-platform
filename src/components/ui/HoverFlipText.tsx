import React from 'react';
import styles from './HoverFlipText.module.css';

export function HoverFlipText({ text }: { text: string }) {
  return (
    <span className={styles.flipTextContainer}>
      {text.split('').map((char, i) => (
        <span 
          key={i} 
          className={styles.flipChar} 
          style={{ transitionDelay: `${i * 30}ms` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  );
}
