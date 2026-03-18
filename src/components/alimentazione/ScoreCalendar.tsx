'use client';

import { useState, useMemo } from 'react';
import type { DailyLog } from '@/lib/types';
import { getRotationPhase, getMealType } from '@/data/constants';
import type { StreakData } from '@/lib/types';

interface ScoreCalendarProps {
  allLogs: DailyLog[];
  streak: StreakData;
}

const WEEKDAY_LABELS = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];

function getScoreDotColor(score: number | undefined): string {
  if (score === undefined) return 'transparent';
  if (score >= 4) return 'var(--color-sage)';
  if (score >= 2.5) return 'var(--color-amber)';
  return 'var(--color-terracotta)';
}

function getDayBgColor(score: number | undefined): string {
  if (score === undefined) return '';
  if (score >= 4) return 'bg-[var(--color-sage-light)]';
  if (score >= 2.5) return 'bg-[var(--color-amber-light)]';
  return 'bg-[var(--color-terracotta-bg)]';
}

const MONTH_NAMES = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
];

export default function ScoreCalendar({ allLogs, streak }: ScoreCalendarProps) {
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  // Index logs by date for quick lookup
  const logsByDate = useMemo(() => {
    const map: Record<string, DailyLog> = {};
    for (const log of allLogs) {
      map[log.date] = log;
    }
    return map;
  }, [allLogs]);

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const lastOfMonth = new Date(viewYear, viewMonth + 1, 0);

    // Monday = 0 in our grid
    let startDow = firstOfMonth.getDay();
    startDow = (startDow + 6) % 7; // shift so Monday=0

    const days: (number | null)[] = [];

    // Padding before first day
    for (let i = 0; i < startDow; i++) {
      days.push(null);
    }

    // Actual days
    for (let d = 1; d <= lastOfMonth.getDate(); d++) {
      days.push(d);
    }

    return days;
  }, [viewMonth, viewYear]);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
    setSelectedDay(null);
  };

  const todayStr = today.toISOString().split('T')[0];

  // Selected day detail
  const selectedLog = selectedDay ? logsByDate[selectedDay] : null;
  const selectedDate = selectedDay ? new Date(selectedDay + 'T12:00:00') : null;
  const selectedMealType = selectedDate ? getMealType(selectedDate) : null;

  return (
    <div className="space-y-3">
      <div className="card space-y-3">
        {/* Month nav + streak */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-light)] hover:bg-[var(--color-cream-dark)] transition-colors"
            aria-label="Mese precedente"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="text-center">
            <h3 className="text-sm font-semibold text-[var(--color-text)]">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </h3>
            {streak.count > 0 && (
              <p className="text-xs text-[var(--color-text-lighter)]">{streak.count} giorni ✦</p>
            )}
          </div>
          <button
            onClick={nextMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--color-text-light)] hover:bg-[var(--color-cream-dark)] transition-colors"
            aria-label="Mese successivo"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1">
          {WEEKDAY_LABELS.map((label, i) => (
            <div key={i} className="text-center text-[10px] font-medium text-[var(--color-text-lighter)] py-1">
              {label}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="h-9" />;
            }

            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const log = logsByDate[dateStr];
            const score = log?.score;
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDay;
            const isFuture = dateStr > todayStr;
            const dotColor = getScoreDotColor(score);
            const bgColor = getDayBgColor(score);

            return (
              <button
                key={dateStr}
                onClick={() => !isFuture && setSelectedDay(isSelected ? null : dateStr)}
                disabled={isFuture}
                className={`h-9 rounded-lg flex flex-col items-center justify-center relative transition-all duration-150 ${
                  isFuture ? 'opacity-30' : 'hover:bg-[var(--color-cream-dark)]'
                } ${isSelected ? 'ring-2 ring-[var(--color-terracotta)] ring-offset-1' : ''} ${
                  isToday && !isSelected ? 'ring-1 ring-[var(--color-text-lighter)]' : ''
                } ${bgColor}`}
              >
                {score !== undefined && (
                  <span className="text-xs font-semibold" style={{ color: dotColor }}>{score}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 pt-1">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-sage)' }} />
            <span className="text-[10px] text-[var(--color-text-lighter)]">≥ 4</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-amber)' }} />
            <span className="text-[10px] text-[var(--color-text-lighter)]">2.5–3.5</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--color-terracotta)' }} />
            <span className="text-[10px] text-[var(--color-text-lighter)]">≤ 2</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--color-cream-dark)]" />
            <span className="text-[10px] text-[var(--color-text-lighter)]">—</span>
          </div>
        </div>
      </div>

      {/* Selected day detail */}
      {selectedDay && (
        <div className="card animate-[scaleIn_0.2s_ease-out]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-[var(--color-text)]">
              {new Date(selectedDay + 'T12:00:00').toLocaleDateString('it-IT', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </p>
            {selectedMealType && (
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  selectedMealType === 'controlled'
                    ? 'bg-[var(--color-terracotta-bg)] text-[var(--color-terracotta)]'
                    : selectedMealType === 'partial'
                      ? 'bg-[var(--color-amber-light)] text-[var(--color-amber)]'
                      : 'bg-[var(--color-sage-light)] text-[var(--color-sage-dark)]'
                }`}
              >
                {selectedMealType === 'controlled' ? 'Controllato' : selectedMealType === 'partial' ? 'Parziale' : 'Libero'}
              </span>
            )}
          </div>
          {selectedLog ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span
                  className="text-lg font-bold"
                  style={{ color: getScoreDotColor(selectedLog.score) }}
                >
                  {selectedLog.score}/5
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-light)] leading-relaxed">
                {selectedLog.aiComment}
              </p>
              {selectedLog.selectedFoods.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {selectedLog.selectedFoods.map((food) => (
                    <span
                      key={food}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--color-cream-dark)] text-[var(--color-text-lighter)]"
                    >
                      {food}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-[var(--color-text-lighter)]">
              Nessun pasto registrato per questo giorno.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
