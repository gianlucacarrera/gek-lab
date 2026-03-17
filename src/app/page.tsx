'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Tab } from '@/types/app';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { getDietStartDate } from '@/lib/storage';
import { setRotationStartDate } from '@/data/constants';
import LoginPage from '@/components/LoginPage';
import EsamiView from '@/components/EsamiView';
import AlimentiView from '@/components/AlimentiView';
import AlimentazioneView from '@/components/AlimentazioneView';
import WeeklyCheckIn from '@/components/WeeklyCheckIn';
import BottomNav from '@/components/BottomNav';

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('esami');
  const [checkInOpen, setCheckInOpen] = useState(false);

  // Check existing session + listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Initialize rotation start date when user is set
  useEffect(() => {
    if (!user) return;
    getDietStartDate().then((stored) => {
      if (stored) setRotationStartDate(stored);
    });
  }, [user]);

  const handleLogin = useCallback(() => {
    // Auth state change listener will update `user`
  }, []);

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    setActiveTab('esami');
  }, []);

  // Loading
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-cream-dark)] border-t-[var(--color-terracotta)] rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const userName = user.user_metadata?.name ?? user.email?.split('@')[0] ?? '';

  return (
    <div className="min-h-screen pb-20 max-w-lg mx-auto relative">
      {/* User header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-0">
        <span className="text-xs text-[var(--color-text-lighter)]">
          {userName}
        </span>
        <button
          onClick={handleLogout}
          className="text-xs text-[var(--color-text-lighter)] hover:text-[var(--color-terracotta)] transition-colors"
        >
          Esci
        </button>
      </div>

      {activeTab === 'esami' && <EsamiView userName={userName} />}
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
