import { useEffect, useState, useRef } from 'react';
import { fromEvent, animationFrames } from 'rxjs';
import styles from './CustomCursor.module.css';

export function CustomCursor() {
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [trailPos, setTrailPos] = useState<{ x: number; y: number }>({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const trailRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });
  const posRef = useRef<{ x: number; y: number }>({ x: -100, y: -100 });

  useEffect(() => {
    // ─── RxJS Streams ───
    const mouseMove$ = fromEvent<MouseEvent>(window, 'mousemove', { passive: true });
    const mouseEnter$ = fromEvent(document.documentElement, 'mouseenter');
    const mouseLeave$ = fromEvent(document.documentElement, 'mouseleave');

    // Handle mouse movement and interactivity detection
    const moveSub = mouseMove$.subscribe((e) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      setPosition(posRef.current);

      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest('a, button, input, select, textarea, [role="button"], [role="option"], [tabindex]:not([tabindex="-1"]), label, tr');
      setIsHovering(isInteractive);
      if (!isVisible) setIsVisible(true);
    });

    const enterSub = mouseEnter$.subscribe(() => setIsVisible(true));
    const leaveSub = mouseLeave$.subscribe(() => setIsVisible(false));

    // Handle smooth trailing animation via RxJS animationFrames scheduler
    const trailSub = animationFrames().subscribe(() => {
      trailRef.current.x += (posRef.current.x - trailRef.current.x) * 0.25;
      trailRef.current.y += (posRef.current.y - trailRef.current.y) * 0.25;
      setTrailPos({ x: trailRef.current.x, y: trailRef.current.y });
    });

    return () => {
      moveSub.unsubscribe();
      enterSub.unsubscribe();
      leaveSub.unsubscribe();
      trailSub.unsubscribe();
    };
  }, [isVisible]);

  if (typeof window === 'undefined') return null;

  return (
    <div className={styles.cursorContainer} style={{ opacity: isVisible ? 1 : 0 }}>
      {/* Trail element */}
      <div 
        className={`${styles.trail} ${isHovering ? styles.trailHover : ''}`}
        style={{ transform: `translate3d(${trailPos.x}px, ${trailPos.y}px, 0)` }}
      />
      {/* Main Cursor */}
      <div 
        className={`${styles.cursor} ${isHovering ? styles.cursorHover : ''}`}
        style={{ transform: `translate3d(${position.x}px, ${position.y}px, 0)` }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles.triangle}>
          <path d="M12 3L21 20H3L12 3Z" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
