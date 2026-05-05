import React from 'react';
import styles from './Input.module.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
}

export function Input({ label, icon, error, id, className = '', ...rest }: InputProps) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return (
    <div className={[styles.wrapper, className].join(' ')}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={[styles.field, error ? styles.hasError : ''].filter(Boolean).join(' ')}>
        {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
        <input id={inputId} className={styles.input} {...rest} />
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  inlinePrefix?: string;
  options: { value: string; label: string }[];
}

import { useState, useRef, useEffect } from 'react';

export function Select({ label, inlinePrefix, options, id, className = '', value, onChange, ...rest }: SelectProps) {
  const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  const handleSelect = (val: string) => {
    if (onChange) {
      onChange({ target: { value: val } } as any);
    }
    setIsOpen(false);
  };

  return (
    <div className={[styles.wrapper, className, isOpen ? styles.isOpen : ''].join(' ')} ref={dropdownRef}>
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <div className={styles.customSelectWrap}>
        <button
          type="button"
          id={selectId}
          className={styles.selectBtn}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          {...(rest as any)}
        >
          <span className={styles.btnText}>
            {inlinePrefix && <span className={styles.inlinePrefix}>{inlinePrefix}</span>}
            {selectedOption?.label}
          </span>
          <span className={styles.chevron} aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </span>
        </button>
        <div className={styles.dropdownContainer}>
          <ul className={styles.dropdownList} role="listbox">
            {options.map((opt) => (
              <li
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                className={[styles.dropdownItem, opt.value === value ? styles.selected : ''].join(' ')}
                onClick={() => handleSelect(opt.value)}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
