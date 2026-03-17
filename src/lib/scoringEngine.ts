import type { FoodRule, DayTypeDefinition } from './types';

export function calculateScore(
  selectedFoods: string[],
  foodRules: FoodRule[],
  dayType: DayTypeDefinition
): number {
  let score = 5;

  for (const foodName of selectedFoods) {
    const rule = foodRules.find(r => r.food === foodName);
    if (!rule) continue;

    if (rule.status === 'excluded') {
      score -= 1.5 * dayType.severityWeight;
    } else if (rule.status === 'limited') {
      score -= 0.5 * dayType.severityWeight;
    }
  }

  // Clamp to [1, 5] and round to nearest 0.5
  score = Math.max(1, Math.min(5, score));
  score = Math.round(score * 2) / 2;

  return score;
}
