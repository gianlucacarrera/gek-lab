'use client';

import type { FoodRule } from '@/lib/types';
import { FOOD_RULES } from '@/data/foodRules';
import { getCachedClassification } from '@/lib/storage';

interface FoodGridProps {
  frequentFoods: Array<{ food: string; count: number }>;
  selectedFoods: string[];
  onToggle: (food: string) => void;
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="flex-shrink-0">
      <path d="M3 7.5L5.5 10L11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function getFoodStatus(food: string): FoodRule['status'] {
  const rule = FOOD_RULES.find((r) => r.food === food);
  if (rule) return rule.status;
  const cached = getCachedClassification(food);
  if (cached) return cached.status;
  return 'allowed';
}

function getStatusStyles(status: FoodRule['status'], isSelected: boolean): string {
  const ringClass = isSelected ? 'ring-2 ring-offset-1' : '';

  switch (status) {
    case 'allowed':
      return `bg-[var(--color-sage-light)] text-[var(--color-sage-dark)] ${
        isSelected ? 'ring-[var(--color-sage)]' : ''
      } ${ringClass}`;
    case 'limited':
      return `bg-[var(--color-amber-light)] text-[var(--color-amber)] ${
        isSelected ? 'ring-[var(--color-amber)]' : ''
      } ${ringClass}`;
    case 'excluded':
      return `bg-[var(--color-cream-dark)] text-[var(--color-text-lighter)] ${
        isSelected ? 'ring-[var(--color-text-lighter)]' : ''
      } ${ringClass}`;
  }
}

export default function FoodGrid({ frequentFoods, selectedFoods, onToggle }: FoodGridProps) {
  if (frequentFoods.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-sm text-[var(--color-text-lighter)] leading-relaxed">
          Inizia a registrare i tuoi pasti con il campo qui sotto.
          <br />
          Le tue scelte più frequenti appariranno qui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-[var(--color-text-lighter)]">I tuoi alimenti più frequenti</p>
      <div className="flex flex-wrap gap-2">
        {frequentFoods.map(({ food }) => {
          const isSelected = selectedFoods.includes(food);
          const status = getFoodStatus(food);
          const statusStyles = getStatusStyles(status, isSelected);

          return (
            <button
              key={food}
              onClick={() => onToggle(food)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 ${statusStyles}`}
            >
              {isSelected && <CheckIcon />}
              <span className={status === 'excluded' ? 'line-through' : ''}>
                {food}
              </span>
              {status === 'limited' && (
                <span className="text-[10px] opacity-70">limitato</span>
              )}
              {status === 'excluded' && (
                <span className="text-[10px] opacity-70">da evitare</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
