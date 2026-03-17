'use client';

import React, { useState, useEffect } from 'react';
import { SUGAR_UNIT_ITEMS, MAX_WEEKLY_SUGAR_UNITS } from '@/data/constants';
import {
  getSugarTracker,
  addSugarUnits,
  clearSugarDay,
  resetSugarWeek,
} from '@/lib/storage';

const DAY_LABELS = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];

const CATEGORY_TABS = [
  { key: 'SWEETS' as const, label: 'Dolci' },
  { key: 'DRINKS' as const, label: 'Bevande' },
  { key: 'SWEETENERS' as const, label: 'Dolcificanti' },
  { key: 'DRIED_FRUIT' as const, label: 'Frutta secca' },
];

export default function SugarTracker() {
  const [tracker, setTracker] = useState<{ weekStartDate: string; dailyTotals: Record<number, number> }>({ weekStartDate: '', dailyTotals: {} });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORY_TABS[number]['key']>('SWEETS');

  useEffect(() => {
    getSugarTracker().then(setTracker);
  }, []);

  const todayIndex = (() => {
    const day = new Date().getDay();
    return (day + 6) % 7; // Monday=0, Sunday=6
  })();

  const weeklyTotal = Object.values(tracker.dailyTotals).reduce((sum, v) => sum + v, 0);
  const todayTotal = tracker.dailyTotals[todayIndex] ?? 0;

  // Color for the circular gauge
  const gaugeColor =
    weeklyTotal >= MAX_WEEKLY_SUGAR_UNITS
      ? 'var(--color-terracotta)'
      : weeklyTotal >= 11
        ? 'var(--color-amber)'
        : 'var(--color-sage)';

  // SVG circular gauge
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.min(weeklyTotal / MAX_WEEKLY_SUGAR_UNITS, 1);
  const dashOffset = circumference * (1 - fraction);

  const handleAddItem = async (units: number) => {
    const updated = await addSugarUnits(todayIndex, units);
    setTracker({ ...updated });
  };

  const handleClearToday = async () => {
    const updated = await clearSugarDay(todayIndex);
    setTracker({ ...updated });
  };

  const handleNewWeek = async () => {
    const updated = await resetSugarWeek();
    setTracker({ ...updated });
  };

  const filteredItems = SUGAR_UNIT_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <>
      <div className="card space-y-4">
        {/* Circular Counter */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <svg width="150" height="150" viewBox="0 0 150 150">
              {/* Background circle */}
              <circle
                cx="75"
                cy="75"
                r={radius}
                fill="none"
                stroke="var(--color-cream-dark)"
                strokeWidth="12"
              />
              {/* Progress arc */}
              <circle
                cx="75"
                cy="75"
                r={radius}
                fill="none"
                stroke={gaugeColor}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 75 75)"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-[var(--color-text)]">{weeklyTotal}</span>
              <span className="text-xs text-[var(--color-text-lighter)]">/ {MAX_WEEKLY_SUGAR_UNITS}</span>
            </div>
          </div>
          <p className="text-xs text-[var(--color-text-light)] mt-1">Unità zuccherine questa settimana</p>
        </div>

        {/* Day dots */}
        <div className="flex justify-center gap-2">
          {DAY_LABELS.map((label, i) => {
            const dayUnits = tracker.dailyTotals[i] ?? 0;
            const isToday = i === todayIndex;
            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors duration-200 ${
                    isToday
                      ? 'ring-2 ring-[var(--color-terracotta)] ring-offset-1'
                      : ''
                  } ${
                    dayUnits > 0
                      ? 'bg-[var(--color-amber-light)] text-[var(--color-amber)]'
                      : 'bg-[var(--color-cream-dark)] text-[var(--color-text-lighter)]'
                  }`}
                >
                  {dayUnits > 0 ? dayUnits : ''}
                </div>
                <span className={`text-[10px] ${isToday ? 'font-semibold text-[var(--color-text)]' : 'text-[var(--color-text-lighter)]'}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Add button */}
        <button
          onClick={() => setSheetOpen(true)}
          className="btn-primary w-full justify-center"
        >
          + Aggiungi quello che hai mangiato
        </button>

        {/* Clear / Reset buttons */}
        <div className="flex gap-2">
          {todayTotal > 0 && (
            <button
              onClick={handleClearToday}
              className="flex-1 text-xs text-[var(--color-text-lighter)] py-2 hover:text-[var(--color-terracotta)] transition-colors"
            >
              Svuota oggi
            </button>
          )}
          <button
            onClick={handleNewWeek}
            className="flex-1 text-xs text-[var(--color-text-lighter)] py-2 hover:text-[var(--color-terracotta)] transition-colors"
          >
            Nuova settimana
          </button>
        </div>
      </div>

      {/* Bottom Sheet */}
      {sheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSheetOpen(false)}
          />
          {/* Sheet */}
          <div className="bottom-sheet z-50 p-5 pb-8">
            {/* Handle */}
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full bg-[var(--color-cream-dark)]" />
            </div>

            <h3 className="text-base font-semibold text-[var(--color-text)] mb-3">
              Aggiungi unità zuccherine
            </h3>

            {/* Category tabs */}
            <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveCategory(tab.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors duration-200 ${
                    activeCategory === tab.key
                      ? 'bg-[var(--color-terracotta)] text-white'
                      : 'bg-[var(--color-cream-dark)] text-[var(--color-text-light)]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Items list */}
            <div className="space-y-1 max-h-[50vh] overflow-y-auto">
              {filteredItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleAddItem(item.units)}
                  className="w-full flex items-center justify-between p-3 rounded-xl text-left hover:bg-[var(--color-cream)] transition-colors duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[var(--color-text)]">{item.name}</p>
                    <p className="text-xs text-[var(--color-text-lighter)]">{item.portion}</p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {Array.from({ length: item.units }, (_, i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full bg-[var(--color-amber)]"
                      />
                    ))}
                    {Array.from({ length: Math.max(0, 5 - item.units) }, (_, i) => (
                      <span
                        key={`empty-${i}`}
                        className="w-2 h-2 rounded-full bg-[var(--color-cream-dark)]"
                      />
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setSheetOpen(false)}
              className="w-full mt-4 py-3 rounded-xl bg-[var(--color-cream-dark)] text-sm font-medium text-[var(--color-text-light)] transition-colors hover:bg-[var(--color-cream)]"
            >
              Chiudi
            </button>
          </div>
        </>
      )}
    </>
  );
}
