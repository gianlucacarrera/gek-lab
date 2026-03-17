'use client';

import { useState } from 'react';
import type { DayTypeDefinition } from '@/lib/types';
import { FOOD_RULES } from '@/data/foodRules';
import { calculateScore } from '@/lib/scoringEngine';
import { saveDailyLog, updateStreak } from '@/lib/storage';
import FoodGrid from './FoodGrid';

interface EveningRecapProps {
  dayType: DayTypeDefinition;
  date: string;
  onComplete: () => void;
  initialFoods?: string[];
}

type Step = 'select' | 'loading';

export default function EveningRecap({ dayType, date, onComplete, initialFoods }: EveningRecapProps) {
  const [step, setStep] = useState<Step>('select');
  const [selectedFoods, setSelectedFoods] = useState<string[]>(initialFoods ?? []);
  const [customFoods, setCustomFoods] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');

  const handleToggle = (food: string) => {
    setSelectedFoods((prev) =>
      prev.includes(food) ? prev.filter((f) => f !== food) : [...prev, food]
    );
  };

  const handleAddCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !customFoods.includes(trimmed) && !selectedFoods.includes(trimmed)) {
      setCustomFoods((prev) => [...prev, trimmed]);
      setSelectedFoods((prev) => [...prev, trimmed]);
      setCustomInput('');
    }
  };

  const handleRemoveCustom = (food: string) => {
    setCustomFoods((prev) => prev.filter((f) => f !== food));
    setSelectedFoods((prev) => prev.filter((f) => f !== food));
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom();
    }
  };

  const handleSubmit = async () => {
    setStep('loading');

    const computed = calculateScore(selectedFoods, FOOD_RULES, dayType);

    // Build food status map for the API
    const foodStatuses = selectedFoods.map((food) => {
      const rule = FOOD_RULES.find((r) => r.food === food);
      return { food, status: rule?.status ?? 'allowed' };
    });

    let comment = 'Buon lavoro oggi. Continua cosi!';
    try {
      const res = await fetch('/api/alimentazione', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayType: { id: dayType.id, label: dayType.label, avoidList: dayType.avoidList, severityWeight: dayType.severityWeight },
          selectedFoods: foodStatuses,
          customFoods: customFoods.length > 0 ? customFoods : undefined,
          score: computed,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        comment = data.comment || comment;
      }
    } catch {
      // fallback comment already set
    }

    // Save to storage
    saveDailyLog({
      date,
      dayTypeId: dayType.id,
      selectedFoods,
      score: computed,
      aiComment: comment,
    });

    updateStreak(date, computed);

    // Notify parent to refresh state from storage
    onComplete();
  };

  // Step: Food selection
  if (step === 'select') {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">
            Cosa hai mangiato oggi?
          </h2>

          <FoodGrid
            foodRules={FOOD_RULES}
            selectedFoods={selectedFoods}
            onToggle={handleToggle}
          />
        </div>

        {/* Custom food input */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">
            Altro non in lista?
          </h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={handleCustomKeyDown}
              placeholder="es. hummus, tofu..."
              className="flex-1 rounded-xl border border-[var(--color-cream-dark)] bg-[var(--color-cream)] px-4 py-2.5
                         text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-lighter)]
                         focus:outline-none focus:border-[var(--color-terracotta)] transition-colors duration-200"
            />
            <button
              onClick={handleAddCustom}
              disabled={!customInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-[var(--color-terracotta)] text-white text-sm font-semibold
                         transition-opacity duration-200 hover:opacity-90 disabled:opacity-40"
            >
              +
            </button>
          </div>
          {customFoods.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {customFoods.map((food) => (
                <span
                  key={food}
                  className="inline-flex items-center gap-1 rounded-full bg-[var(--color-cream)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-light)]"
                >
                  {food}
                  <button
                    onClick={() => handleRemoveCustom(food)}
                    className="text-[var(--color-text-lighter)] hover:text-[var(--color-terracotta)] ml-0.5"
                    aria-label={`Rimuovi ${food}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={selectedFoods.length === 0 && customFoods.length === 0}
          className="w-full py-3 rounded-xl bg-[var(--color-terracotta)] text-white text-sm font-semibold
                     transition-opacity duration-200 hover:opacity-90 active:opacity-80
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Valuta
        </button>
      </div>
    );
  }

  // Step: Loading
  if (step === 'loading') {
    return (
      <div className="py-12 flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-3 border-[var(--color-cream-dark)] border-t-[var(--color-terracotta)] rounded-full animate-spin" />
        <p className="text-sm text-[var(--color-text-lighter)]">Sto valutando...</p>
      </div>
    );
  }

  // Unreachable — parent switches view after onComplete
  return null;
}
