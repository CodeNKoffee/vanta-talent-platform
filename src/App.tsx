import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/store/AppContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Header } from '@/components/layout/Header';
import { RecruitmentPage } from '@/pages/RecruitmentPage';
import { CandidateProfilePage } from '@/pages/CandidateProfilePage';
import { Footer } from '@/components/layout/Footer';
import { CustomCursor } from '@/components/ui/CustomCursor';

export default function App() {
  useEffect(() => {
    // PWA Push Notification Mock Implementation
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          // Check every minute if it's 8:00 AM
          const checkTime = () => {
            const now = new Date();
            if (now.getHours() === 8 && now.getMinutes() === 0) {
              const lastNotified = localStorage.getItem('last_notified_date');
              const today = now.toDateString();
              
              if (lastNotified !== today) {
                new Notification('Vanta Talent Intelligence', {
                  body: 'Good morning! Check your profile and newly listed candidates.',
                  icon: '/pwa-192x192.svg',
                  badge: '/favicon.svg'
                });
                localStorage.setItem('last_notified_date', today);
              }
            }
          };

          checkTime();
          const intervalId = setInterval(checkTime, 60 * 1000);
          return () => clearInterval(intervalId);
        }
      });
    }
  }, []);

  return (
    <BrowserRouter>
      <AppProvider>
        <ErrorBoundary>
          <CustomCursor />
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: '100dvh' }}>
            <Header />
            <Routes>
              <Route path="/" element={<RecruitmentPage />} />
              <Route
                path="/candidate/:id"
                element={
                  <ErrorBoundary>
                    <CandidateProfilePage />
                  </ErrorBoundary>
                }
              />
              {/* Catch-all */}
              <Route
                path="*"
                element={
                  <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem', flex: 1 }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-2xl)', color: 'var(--c-text-1)' }}>404 — Page not found</h2>
                    <a href="/" style={{ color: 'var(--c-primary)', fontSize: 'var(--text-sm)' }}>← Back to directory</a>
                  </main>
                }
              />
            </Routes>
            <Footer />
          </div>
        </ErrorBoundary>
      </AppProvider>
    </BrowserRouter>
  );
}
