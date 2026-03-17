'use client';

import { useState, useMemo } from 'react';
import type { DailyLog, StreakData } from '@/lib/types';

const DAY_LABELS = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];

interface WeeklyStripProps {
  weekLogs: (DailyLog | null)[];
  streak: StreakData;
  weekKey: string;
  savedNote: string;
  onSaveNote: (weekKey: string, note: string) => void;
}

function getDotColor(score: number | null): string {
  if (score === null) return 'var(--color-cream-dark)';
  if (score >= 4) return 'var(--color-sage)';
  if (score >= 2.5) return 'var(--color-amber)';
  return 'var(--color-terracotta)';
}

function derivePattern(weekLogs: (DailyLog | null)[]): string {
  // Count how many times excluded foods appear on controlled/partial days
  const excludedCounts: Record<string, number> = {};

  for (const log of weekLogs) {
    if (!log) continue;
    // Only flag foods on non-free days
    if (log.dayTypeId === 'free') continue;
    for (const food of log.selectedFoods) {
      excludedCounts[food] = (excludedCounts[food] || 0) + 1;
    }
  }

  // Find the most frequent food that appeared 2+ times
  let maxFood = '';
  let maxCount = 0;

  for (const [food, count] of Object.entries(excludedCounts)) {
    if (count > maxCount && count >= 2) {
      maxFood = food;
      maxCount = count;
    }
  }

  if (maxFood) {
    return `Questa settimana ${maxFood.toLowerCase()} è comparso ${maxCount} volte nei giorni di controllo.`;
  }

  // Check if there are any logs at all
  const hasAnyLogs = weekLogs.some((log) => log !== null);
  if (!hasAnyLogs) {
    return 'Inizia a registrare i tuoi pasti per vedere i progressi della settimana.';
  }

  return 'Buona settimana finora. Continua a registrare per scoprire i tuoi pattern.';
}

export default function WeeklyStrip({ weekLogs, streak, weekKey, savedNote, onSaveNote }: WeeklyStripProps) {
  const [note, setNote] = useState(savedNote);
  const [saved, setSaved] = useState(false);

  const isSunday = new Date().getDay() === 0;

  const pattern = useMemo(() => derivePattern(weekLogs), [weekLogs]);

  const handleSave = () => {
    onSaveNote(weekKey, note);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="px-4 py-5 space-y-5">
      {/* Score strip */}
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold text-[var(--color-text)] text-center">
          Questa settimana
        </h3>

        {/* Day dots */}
        <div className="flex justify-center gap-3">
          {DAY_LABELS.map((label, i) => {
            const log = weekLogs[i] ?? null;
            const score = log ? log.score : null;
            const color = getDotColor(score);

            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white transition-all duration-200"
                  style={{ backgroundColor: color }}
                >
                  {score !== null ? score : ''}
                </div>
                <span className="text-[10px] text-[var(--color-text-lighter)]">
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Streak counter */}
        <div className="flex justify-center">
          <span className="text-sm text-[var(--color-text-light)]">
            {streak.count} giorni ✦
          </span>
        </div>
      </div>

      {/* Pattern observation */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
          {pattern}
        </p>
      </div>

      {/* Sunday prompt */}
      {isSunday && (
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
          <p className="text-sm font-medium text-[var(--color-text)]">
            Come ti sei sentita questa settimana?
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Scrivi qui le tue riflessioni..."
            rows={3}
            className="w-full rounded-xl border border-[var(--color-cream-dark)] bg-[var(--color-cream)] px-4 py-3
                       text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-lighter)]
                       focus:outline-none focus:border-[var(--color-terracotta)] transition-colors duration-200 resize-none"
          />
          <button
            onClick={handleSave}
            className="w-full py-2.5 rounded-xl bg-[var(--color-terracotta)] text-white text-sm font-semibold
                       transition-opacity duration-200 hover:opacity-90 active:opacity-80"
          >
            {saved ? 'Salvato!' : 'Salva'}
          </button>
        </div>
      )}
    </div>
  );
}
