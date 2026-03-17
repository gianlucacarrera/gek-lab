'use client';

import { useState, useMemo } from 'react';
import type { DayTypeDefinition } from '@/lib/types';
import { FOOD_RULES } from '@/data/foodRules';
import { calculateScore, classifyCustomFood } from '@/lib/scoringEngine';
import { saveDailyLog, updateStreak } from '@/lib/storage';
import type { FoodClassification } from '@/lib/storage';
import FoodGrid from './FoodGrid';

interface EveningRecapProps {
  dayType: DayTypeDefinition;
  date: string;
  onComplete: () => void;
  initialFoods?: string[];
}

type Step = 'select' | 'classifying' | 'saving';

/* ─── Classification Modal ─────────────────────────────────────────── */
function ClassificationModal({
  food,
  classification,
  onClose,
}: {
  food: string;
  classification: FoodClassification;
  onClose: () => void;
}) {
  const isProblematic = classification.status !== 'allowed';

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto bg-white rounded-2xl shadow-xl p-5 animate-[scaleIn_0.2s_ease-out]">
        <div className="space-y-4">
          {/* Food name */}
          <div className="flex items-start justify-between">
            <h3 className="text-base font-semibold text-[var(--color-text)] pr-4">
              {food}
            </h3>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-[var(--color-cream-dark)] flex items-center justify-center text-[var(--color-text-lighter)] hover:text-[var(--color-text)] flex-shrink-0"
              aria-label="Chiudi"
            >
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Status badge */}
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                classification.status === 'excluded'
                  ? 'bg-[var(--color-terracotta-bg)] text-[var(--color-terracotta)]'
                  : classification.status === 'limited'
                    ? 'bg-[var(--color-amber-light)] text-[var(--color-amber)]'
                    : 'bg-[var(--color-sage-light)] text-[var(--color-sage-dark)]'
              }`}
            >
              {classification.status === 'excluded'
                ? 'Da evitare'
                : classification.status === 'limited'
                  ? 'Limitato'
                  : 'Consentito'}
            </span>
          </div>

          {/* Restricted groups */}
          {isProblematic && classification.groups.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {classification.groups.map((group) => {
                const labels: Record<string, string> = {
                  wheat: '🌾 Frumento/Glutine',
                  yeasts: '🧀 Lieviti/Fermentati',
                  nickel: '🔬 Nichel',
                };
                return (
                  <span
                    key={group}
                    className="inline-flex items-center px-2.5 py-1 rounded-full bg-[var(--color-terracotta-bg)] text-[var(--color-terracotta)] text-xs font-medium"
                  >
                    {labels[group] ?? group}
                  </span>
                );
              })}
            </div>
          )}

          {/* Reason */}
          {classification.reason && (
            <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
              {classification.reason}
            </p>
          )}

          {/* Allowed message */}
          {!isProblematic && (
            <p className="text-sm text-[var(--color-sage-dark)] leading-relaxed">
              Questo alimento non contiene ingredienti dei gruppi in rotazione. Nessuna penalità.
            </p>
          )}

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[var(--color-cream-dark)] text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-cream)]"
          >
            Ho capito
          </button>
        </div>
      </div>
    </>
  );
}

/* ─── Score color helper ───────────────────────────────────────────── */
function getScoreColor(score: number): string {
  if (score >= 4) return 'var(--color-sage)';
  if (score >= 2.5) return 'var(--color-amber)';
  return 'var(--color-terracotta)';
}

/* ─── Custom food chip with status color ───────────────────────────── */
function CustomFoodChip({
  food,
  classification,
  onRemove,
}: {
  food: string;
  classification?: FoodClassification;
  onRemove: () => void;
}) {
  const status = classification?.status ?? 'allowed';
  const chipColor =
    status === 'excluded'
      ? 'bg-[var(--color-terracotta-bg)] text-[var(--color-terracotta)]'
      : status === 'limited'
        ? 'bg-[var(--color-amber-light)] text-[var(--color-amber)]'
        : 'bg-[var(--color-sage-light)] text-[var(--color-sage-dark)]';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ${chipColor}`}
    >
      {food}
      <button
        onClick={onRemove}
        className="opacity-60 hover:opacity-100 ml-0.5"
        aria-label={`Rimuovi ${food}`}
      >
        ×
      </button>
    </span>
  );
}

/* ─── Main Component ───────────────────────────────────────────────── */
export default function EveningRecap({ dayType, date, onComplete, initialFoods }: EveningRecapProps) {
  const [step, setStep] = useState<Step>('select');
  const [selectedFoods, setSelectedFoods] = useState<string[]>(initialFoods ?? []);
  const [customFoods, setCustomFoods] = useState<string[]>([]);
  const [customClassifications, setCustomClassifications] = useState<Record<string, FoodClassification>>({});
  const [customInput, setCustomInput] = useState('');

  // Modal state
  const [modalFood, setModalFood] = useState<string | null>(null);
  const [modalClassification, setModalClassification] = useState<FoodClassification | null>(null);

  const handleToggle = (food: string) => {
    setSelectedFoods((prev) =>
      prev.includes(food) ? prev.filter((f) => f !== food) : [...prev, food]
    );
  };

  // Classify on add — show modal with result
  const handleAddCustom = async () => {
    const trimmed = customInput.trim();
    if (!trimmed || customFoods.includes(trimmed) || selectedFoods.includes(trimmed)) return;

    setCustomInput('');
    setStep('classifying');

    const classification = await classifyCustomFood(trimmed);

    setCustomClassifications((prev) => ({ ...prev, [trimmed]: classification }));
    setCustomFoods((prev) => [...prev, trimmed]);
    setSelectedFoods((prev) => [...prev, trimmed]);
    setStep('select');

    // Show modal
    setModalFood(trimmed);
    setModalClassification(classification);
  };

  const handleRemoveCustom = (food: string) => {
    setCustomFoods((prev) => prev.filter((f) => f !== food));
    setSelectedFoods((prev) => prev.filter((f) => f !== food));
    setCustomClassifications((prev) => {
      const next = { ...prev };
      delete next[food];
      return next;
    });
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustom();
    }
  };

  // Live running score
  const runningScore = useMemo(
    () => calculateScore(selectedFoods, FOOD_RULES, dayType, customClassifications),
    [selectedFoods, dayType, customClassifications]
  );

  const handleSubmit = async () => {
    setStep('saving');

    // Build food status map for the AI
    const foodStatuses = selectedFoods.map((food) => {
      const rule = FOOD_RULES.find((r) => r.food === food);
      const customClass = customClassifications[food];
      return {
        food,
        status: rule?.status ?? customClass?.status ?? 'allowed',
        reason: customClass?.reason,
      };
    });

    let comment = 'Buon lavoro oggi. Continua così!';
    try {
      const res = await fetch('/api/alimentazione', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayType: { id: dayType.id, label: dayType.label, avoidList: dayType.avoidList, severityWeight: dayType.severityWeight },
          selectedFoods: foodStatuses,
          score: runningScore,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        comment = data.comment || comment;
      }
    } catch {
      // fallback comment already set
    }

    saveDailyLog({
      date,
      dayTypeId: dayType.id,
      selectedFoods,
      score: runningScore,
      aiComment: comment,
    });

    updateStreak(date, runningScore);
    onComplete();
  };

  // Classifying spinner (brief, while Haiku responds)
  if (step === 'classifying') {
    return (
      <div className="py-8 flex flex-col items-center space-y-3">
        <div className="w-8 h-8 border-2 border-[var(--color-cream-dark)] border-t-[var(--color-terracotta)] rounded-full animate-spin" />
        <p className="text-sm text-[var(--color-text-lighter)]">Analizzo l&apos;alimento...</p>
      </div>
    );
  }

  // Saving spinner
  if (step === 'saving') {
    return (
      <div className="py-12 flex flex-col items-center space-y-4">
        <div className="w-10 h-10 border-3 border-[var(--color-cream-dark)] border-t-[var(--color-terracotta)] rounded-full animate-spin" />
        <p className="text-sm text-[var(--color-text-lighter)]">Sto valutando...</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          {/* Header with running score */}
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[var(--color-text)]">
              Cosa hai mangiato oggi?
            </h2>
            {selectedFoods.length > 0 && (
              <span
                className="text-lg font-bold transition-colors duration-300"
                style={{ color: getScoreColor(runningScore) }}
              >
                {runningScore}/5
              </span>
            )}
          </div>

          <FoodGrid
            foodRules={FOOD_RULES}
            selectedFoods={selectedFoods}
            onToggle={handleToggle}
          />

          {/* Custom food input */}
          <div className="pt-2 border-t border-[var(--color-cream-dark)] space-y-2.5">
            <p className="text-xs font-medium text-[var(--color-text-lighter)]">Altro non in lista?</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={handleCustomKeyDown}
                placeholder="es. lasagne, tiramisù..."
                className="flex-1 rounded-xl border border-[var(--color-cream-dark)] bg-[var(--color-cream)] px-3 py-2
                           text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-lighter)]
                           focus:outline-none focus:border-[var(--color-terracotta)] transition-colors duration-200"
              />
              <button
                onClick={handleAddCustom}
                disabled={!customInput.trim()}
                className="px-3 py-2 rounded-xl bg-[var(--color-terracotta)] text-white text-sm font-semibold
                           transition-opacity duration-200 hover:opacity-90 disabled:opacity-40"
              >
                +
              </button>
            </div>
            {customFoods.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {customFoods.map((food) => (
                  <CustomFoodChip
                    key={food}
                    food={food}
                    classification={customClassifications[food]}
                    onRemove={() => handleRemoveCustom(food)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={selectedFoods.length === 0}
          className="w-full py-3 rounded-xl bg-[var(--color-terracotta)] text-white text-sm font-semibold
                     transition-opacity duration-200 hover:opacity-90 active:opacity-80
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Valuta
        </button>
      </div>

      {/* Classification Modal */}
      {modalFood && modalClassification && (
        <ClassificationModal
          food={modalFood}
          classification={modalClassification}
          onClose={() => {
            setModalFood(null);
            setModalClassification(null);
          }}
        />
      )}
    </>
  );
}
