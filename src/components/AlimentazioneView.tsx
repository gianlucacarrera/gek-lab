'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { getDayType } from '@/lib/dayTypes';
import { getDailyLog, getStreak, getAllDailyLogs } from '@/lib/storage';
import type { DailyLog, StreakData } from '@/lib/types';
import JourneyBanner from '@/components/alimentazione/JourneyBanner';
import TodayCard from '@/components/alimentazione/TodayCard';
import EveningRecap from '@/components/alimentazione/EveningRecap';
import TodayResult from '@/components/alimentazione/TodayResult';
import ScoreCalendar from '@/components/alimentazione/ScoreCalendar';

export default function AlimentazioneView() {
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
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setTodayLog(getDailyLog(todayStr));
    setStreak(getStreak());
    setAllLogs(getAllDailyLogs());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    setYesterdayLog(getDailyLog(yesterday.toISOString().split('T')[0]));
  }, [todayStr, today, refreshKey]);

  const handleRecapComplete = useCallback(() => {
    setRefreshKey((k) => k + 1);
    setShowFoodInput(false);
  }, []);

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
        {todayLog ? (
          /* Already logged today — show result */
          <TodayResult
            todayLog={todayLog}
            yesterdayScore={yesterdayLog?.score ?? null}
            tomorrowDayType={tomorrowDayType}
          />
        ) : showFoodInput ? (
          /* Food input mode */
          <EveningRecap
            dayType={dayType}
            date={todayStr}
            onComplete={handleRecapComplete}
          />
        ) : (
          /* CTA to start logging */
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
