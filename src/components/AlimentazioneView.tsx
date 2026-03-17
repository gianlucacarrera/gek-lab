'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { getDayType } from '@/lib/dayTypes';
import { getDailyLog, getStreak, getAllDailyLogs, getDietStartDate, setDietStartDate } from '@/lib/storage';
import { setRotationStartDate } from '@/data/constants';
import type { DailyLog, StreakData } from '@/lib/types';
import JourneyBanner from '@/components/alimentazione/JourneyBanner';
import TodayCard from '@/components/alimentazione/TodayCard';
import EveningRecap from '@/components/alimentazione/EveningRecap';
import TodayResult from '@/components/alimentazione/TodayResult';
import ScoreCalendar from '@/components/alimentazione/ScoreCalendar';

/* ─── Diet Start Onboarding ────────────────────────────────────────── */
function DietStartPrompt({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] pb-24">
      <div className="px-4 pt-12 flex flex-col items-center text-center space-y-6">
        <span className="text-5xl">🌱</span>
        <h1 className="text-xl font-bold text-[var(--color-text)]">
          Inizia il tuo percorso
        </h1>
        <p className="text-sm text-[var(--color-text-light)] leading-relaxed max-w-xs">
          La dieta a rotazione dura 16 settimane, divise in due fasi da 8.
          Ogni giorno sapremo dirti cosa evitare e come stai andando.
        </p>
        <div className="w-full max-w-xs space-y-3 pt-2">
          <button
            onClick={onStart}
            className="btn-primary w-full justify-center py-4"
          >
            Inizia oggi
          </button>
          <p className="text-xs text-[var(--color-text-lighter)]">
            Potrai sempre ripristinare la data di inizio dalle impostazioni.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main View ────────────────────────────────────────────────────── */
export default function AlimentazioneView() {
  const [dietStarted, setDietStarted] = useState<boolean | null>(null); // null = loading
  const [refreshKey, setRefreshKey] = useState(0);

  // Initialize diet start date from storage
  useEffect(() => {
    const stored = getDietStartDate();
    if (stored) {
      setRotationStartDate(stored);
      setDietStarted(true);
    } else {
      setDietStarted(false);
    }
  }, []);

  const handleStartDiet = useCallback(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    setDietStartDate(todayStr);
    setRotationStartDate(todayStr);
    setDietStarted(true);
  }, []);

  // Loading state
  if (dietStarted === null) return null;

  // Onboarding: diet not started yet
  if (!dietStarted) {
    return <DietStartPrompt onStart={handleStartDiet} />;
  }

  // Diet is active — show the full view
  return <AlimentazioneActive refreshKey={refreshKey} onRefresh={() => setRefreshKey((k) => k + 1)} />;
}

/* ─── Active Diet View ─────────────────────────────────────────────── */
function AlimentazioneActive({
  refreshKey,
  onRefresh,
}: {
  refreshKey: number;
  onRefresh: () => void;
}) {
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => today.toISOString().split('T')[0], [today]);
  const dayType = useMemo(() => getDayType(today), [today]);
  const tomorrowDayType = useMemo(() => {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return getDayType(tomorrow);
  }, [today]);

  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [yesterdayLog, setYesterdayLog] = useState<DailyLog | null>(null);
  const [streak, setStreak] = useState<StreakData>({ count: 0, lastDate: '' });
  const [allLogs, setAllLogs] = useState<DailyLog[]>([]);
  const [showFoodInput, setShowFoodInput] = useState(false);
  const [editingFoods, setEditingFoods] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    setTodayLog(getDailyLog(todayStr));
    setStreak(getStreak());
    setAllLogs(getAllDailyLogs());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    setYesterdayLog(getDailyLog(yesterday.toISOString().split('T')[0]));
  }, [todayStr, today, refreshKey]);

  const handleRecapComplete = useCallback(() => {
    onRefresh();
    setShowFoodInput(false);
    setEditingFoods(undefined);
  }, [onRefresh]);

  const handleEdit = useCallback(() => {
    if (todayLog) {
      setEditingFoods(todayLog.selectedFoods);
      setShowFoodInput(true);
    }
  }, [todayLog]);

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pb-24">
      {/* Header */}
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-bold text-[var(--color-text)]">Alimentazione</h1>
      </div>

      <div className="px-4 space-y-4">
        {/* 1. Journey Banner — 30,000ft view */}
        <JourneyBanner allLogs={allLogs} />

        {/* 2. Today's Card — day type + suggestions */}
        <TodayCard dayType={dayType} />

        {/* 3. Food Input / Result */}
        {showFoodInput ? (
          /* Food input mode (new or edit) */
          <EveningRecap
            dayType={dayType}
            date={todayStr}
            onComplete={handleRecapComplete}
            initialFoods={editingFoods}
          />
        ) : todayLog ? (
          /* Already logged — show result with edit option */
          <TodayResult
            todayLog={todayLog}
            yesterdayScore={yesterdayLog?.score ?? null}
            tomorrowDayType={tomorrowDayType}
            onEdit={handleEdit}
          />
        ) : (
          /* No log yet — CTA */
          <button
            onClick={() => setShowFoodInput(true)}
            className="btn-primary w-full justify-center py-4"
          >
            Registra i pasti di oggi
          </button>
        )}

        {/* 4. Score Calendar */}
        <div className="pt-2">
          <ScoreCalendar allLogs={allLogs} streak={streak} />
        </div>
      </div>
    </div>
  );
}
