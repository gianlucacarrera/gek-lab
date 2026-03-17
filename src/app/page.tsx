'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Tab } from '@/types/app';
import { getDietStartDate, setCurrentUserId } from '@/lib/storage';
import { setRotationStartDate } from '@/data/constants';
import LoginPage from '@/components/LoginPage';
import EsamiView from '@/components/EsamiView';
import AlimentiView from '@/components/AlimentiView';
import AlimentazioneView from '@/components/AlimentazioneView';
import WeeklyCheckIn from '@/components/WeeklyCheckIn';
import BottomNav from '@/components/BottomNav';

interface User {
  id: string;
  name: string;
  role: string;
}

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('esami');
  const [checkInOpen, setCheckInOpen] = useState(false);

  // Check existing session on mount
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
          setCurrentUserId(data.user.id);
          // Initialize rotation start date from user-scoped storage
          const stored = getDietStartDate();
          if (stored) setRotationStartDate(stored);
        }
      })
      .catch(() => {})
      .finally(() => setAuthChecked(true));
  }, []);

  const handleLogin = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentUserId(loggedInUser.id);
    // Initialize rotation start date from user-scoped storage
    const stored = getDietStartDate();
    if (stored) setRotationStartDate(stored);
  }, []);

  const handleLogout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setCurrentUserId(null);
    setActiveTab('esami');
  }, []);

  // Loading state while checking auth
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-cream-dark)] border-t-[var(--color-terracotta)] rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in — show login
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Logged in — show app
  return (
    <div className="min-h-screen pb-20 max-w-lg mx-auto relative">
      {/* User header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-0">
        <span className="text-xs text-[var(--color-text-lighter)]">
          {user.name}
        </span>
        <button
          onClick={handleLogout}
          className="text-xs text-[var(--color-text-lighter)] hover:text-[var(--color-terracotta)] transition-colors"
        >
          Esci
        </button>
      </div>

      {activeTab === 'esami' && <EsamiView />}
      {activeTab === 'alimenti' && <AlimentiView />}
      {activeTab === 'alimentazione' && <AlimentazioneView />}

      {/* Weekly Check-In FAB */}
      <button
        onClick={() => setCheckInOpen(true)}
        className="fixed bottom-24 right-4 z-40 bg-[var(--color-terracotta)] text-white rounded-full px-4 py-3 shadow-lg flex items-center gap-2 text-sm font-medium transition-transform duration-200 hover:scale-105 active:scale-95"
        aria-label="Check-in settimanale"
      >
        <span>Come stai?</span>
      </button>

      {checkInOpen && <WeeklyCheckIn onClose={() => setCheckInOpen(false)} />}

      <BottomNav activeTab={activeTab} onNavigate={setActiveTab} />
    </div>
  );
}
