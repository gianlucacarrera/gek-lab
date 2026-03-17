'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { getDayType } from '@/lib/dayTypes';
import { getDailyLog, getStreak, getAllDailyLogs, getDietStartDate, setDietStartDate, saveDailyLog, updateStreak, getCachedClassification } from '@/lib/storage';
import { FOOD_RULES } from '@/data/foodRules';
import { calculateScore } from '@/lib/scoringEngine';
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
  const [dietStarted, setDietStarted] = useState<boolean | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    getDietStartDate().then((stored) => {
      if (stored) {
        setRotationStartDate(stored);
        setDietStarted(true);
      } else {
        setDietStarted(false);
      }
    });
  }, []);

  const handleStartDiet = useCallback(async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    await setDietStartDate(todayStr);
    setRotationStartDate(todayStr);
    setDietStarted(true);
  }, []);

  if (dietStarted === null) return null;

  if (!dietStarted) {
    return <DietStartPrompt onStart={handleStartDiet} />;
  }

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [log, streakData, logs] = await Promise.all([
        getDailyLog(todayStr),
        getStreak(),
        getAllDailyLogs(),
      ]);
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yLog = await getDailyLog(yesterday.toISOString().split('T')[0]);

      setTodayLog(log);
      setStreak(streakData);
      setAllLogs(logs);
      setYesterdayLog(yLog);
      setLoading(false);
    }
    load();
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

  const handleRemoveFood = useCallback(async (foodToRemove: string) => {
    if (!todayLog) return;

    const updatedFoods = todayLog.selectedFoods.filter((f) => f !== foodToRemove);

    const customClassifications: Record<string, { status: 'excluded' | 'limited' | 'allowed'; groups: string[]; reason: string }> = {};
    for (const food of updatedFoods) {
      if (!FOOD_RULES.find((r) => r.food === food)) {
        const cached = getCachedClassification(food);
        if (cached) customClassifications[food] = cached;
      }
    }

    const newScore = calculateScore(updatedFoods, FOOD_RULES, dayType, customClassifications);

    const foodStatuses = updatedFoods.map((food) => {
      const rule = FOOD_RULES.find((r) => r.food === food);
      const customClass = customClassifications[food];
      return { food, status: rule?.status ?? customClass?.status ?? 'allowed' };
    });

    let comment = todayLog.aiComment;
    try {
      const res = await fetch('/api/alimentazione', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayType: { id: dayType.id, label: dayType.label, avoidList: dayType.avoidList, severityWeight: dayType.severityWeight },
          selectedFoods: foodStatuses,
          score: newScore,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        comment = data.comment || comment;
      }
    } catch {
      // keep existing comment
    }

    await saveDailyLog({
      date: todayStr,
      dayTypeId: dayType.id,
      selectedFoods: updatedFoods,
      score: newScore,
      aiComment: comment,
    });
    await updateStreak(todayStr, newScore);
    onRefresh();
  }, [todayLog, dayType, todayStr, onRefresh]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-cream-dark)] border-t-[var(--color-terracotta)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pb-24">
      <div className="px-4 pt-5 pb-3">
        <h1 className="text-xl font-bold text-[var(--color-text)]">Alimentazione</h1>
      </div>

      <div className="px-4 space-y-4">
        <JourneyBanner allLogs={allLogs} />
        <TodayCard dayType={dayType} />

        {showFoodInput ? (
          <EveningRecap
            dayType={dayType}
            date={todayStr}
            onComplete={handleRecapComplete}
            initialFoods={editingFoods}
          />
        ) : todayLog ? (
          <TodayResult
            todayLog={todayLog}
            yesterdayScore={yesterdayLog?.score ?? null}
            tomorrowDayType={tomorrowDayType}
            onEdit={handleEdit}
            onRemoveFood={handleRemoveFood}
          />
        ) : (
          <button
            onClick={() => setShowFoodInput(true)}
            className="btn-primary w-full justify-center py-4"
          >
            Registra i pasti di oggi
          </button>
        )}

        <div className="pt-2">
          <ScoreCalendar allLogs={allLogs} streak={streak} />
        </div>
      </div>
    </div>
  );
}
