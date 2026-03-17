'use client';

import { useState, useEffect } from 'react';
import type { Tab } from '@/types/app';
import { getDietStartDate } from '@/lib/storage';
import { setRotationStartDate } from '@/data/constants';
import EsamiView from '@/components/EsamiView';
import AlimentiView from '@/components/AlimentiView';
import AlimentazioneView from '@/components/AlimentazioneView';
import WeeklyCheckIn from '@/components/WeeklyCheckIn';
import BottomNav from '@/components/BottomNav';

export default function Page() {
  const [activeTab, setActiveTab] = useState<Tab>('esami');
  const [checkInOpen, setCheckInOpen] = useState(false);

  // Initialize rotation start date from storage on app load
  useEffect(() => {
    const stored = getDietStartDate();
    if (stored) {
      setRotationStartDate(stored);
    }
  }, []);

  return (
    <div className="min-h-screen pb-20 max-w-lg mx-auto relative">
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
