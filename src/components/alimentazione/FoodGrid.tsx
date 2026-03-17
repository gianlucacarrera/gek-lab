'use client';

import { useState } from 'react';
import type { FoodRule } from '@/lib/types';

type Category = FoodRule['category'];

const CATEGORY_LABELS: Record<Category, string> = {
  proteine: 'Proteine',
  carboidrati: 'Carboidrati',
  verdure: 'Verdure',
  grassi: 'Grassi',
  altro: 'Altro',
};

const CATEGORY_ORDER: Category[] = ['proteine', 'carboidrati', 'verdure', 'grassi', 'altro'];

interface FoodGridProps {
  foodRules: FoodRule[];
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

export default function FoodGrid({ foodRules, selectedFoods, onToggle }: FoodGridProps) {
  const [activeCategory, setActiveCategory] = useState<Category>('proteine');

  const foodsByCategory = CATEGORY_ORDER.reduce<Record<Category, FoodRule[]>>((acc, cat) => {
    acc[cat] = foodRules.filter((r) => r.category === cat);
    return acc;
  }, {} as Record<Category, FoodRule[]>);

  // Only show categories that have foods
  const availableCategories = CATEGORY_ORDER.filter((cat) => foodsByCategory[cat].length > 0);

  return (
    <div className="space-y-4">
      {/* Category tabs — pill strip */}
      <div className="flex gap-1 rounded-full bg-[var(--color-cream-dark)] p-1">
        {availableCategories.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white text-[var(--color-text)] shadow-sm'
                  : 'text-[var(--color-text-lighter)]'
              }`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          );
        })}
      </div>

      {/* Food chips */}
      <div className="flex flex-wrap gap-2">
        {foodsByCategory[activeCategory]?.map((rule) => {
          const isSelected = selectedFoods.includes(rule.food);
          const statusStyles = getStatusStyles(rule.status, isSelected);

          return (
            <button
              key={rule.food}
              onClick={() => onToggle(rule.food)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-200 ${statusStyles}`}
            >
              {isSelected && <CheckIcon />}
              <span className={rule.status === 'excluded' ? 'line-through' : ''}>
                {rule.food}
              </span>
              {rule.status === 'limited' && (
                <span className="text-[10px] opacity-70">limitato</span>
              )}
              {rule.status === 'excluded' && (
                <span className="text-[10px] opacity-70">da evitare</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
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
