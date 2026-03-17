import type { FoodRule, DayTypeDefinition } from './types';
import { getCachedClassification, cacheFoodClassification } from './storage';
import type { FoodClassification } from './storage';

/**
 * Keyword fallback for offline/error classification.
 */
const EXCLUDED_KEYWORDS: string[] = [
  'frumento', 'grano', 'glutine', 'pasta', 'pane', 'pizza', 'focaccia',
  'lasagne', 'lasagna', 'gnocchi', 'ravioli', 'tortellini', 'tagliatelle',
  'spaghetti', 'penne', 'fusilli', 'rigatoni', 'fettuccine', 'cannelloni',
  'carbonara', 'amatriciana', 'cacio e pepe', 'bolognese',
  'farro', 'kamut', 'orzo', 'segale', 'spelta', 'bulgur', 'cous cous',
  'seitan', 'panino', 'tramezzino', 'toast', 'bruschetta', 'crostini',
  'grissini', 'cracker', 'fette biscottate', 'brioche', 'cornetto', 'croissant',
  'torta', 'biscotti', 'merendina', 'dolce', 'tiramisù', 'tiramisu',
  'piadina', 'wrap', 'burrito', 'panzerotto', 'calzone',
  'impanato', 'impanatura', 'cotoletta', 'milanese',
  'formaggio', 'parmigiano', 'grana', 'pecorino', 'gorgonzola', 'mozzarella',
  'ricotta', 'mascarpone', 'yogurt', 'kefir',
  'tofu', 'tempeh', 'miso', 'soia',
  'fungo', 'funghi',
  'aceto', 'maionese',
  'vino', 'birra', 'prosecco', 'champagne', 'spumante',
  'spinaci', 'pomodoro', 'sugo', 'ragù', 'ragu', 'asparagi',
  'cioccolato', 'cacao', 'nutella',
  'lenticchie', 'avena', 'mais', 'polenta',
  'kiwi', 'pera',
  'mandorle', 'nocciole', 'arachidi', 'pistacchi', 'noci',
];

const LIMITED_KEYWORDS: string[] = [
  'zucchero', 'miele', 'marmellata', 'gelato', 'caramella',
  'succo', 'bibita', 'coca cola', 'sprite', 'fanta',
  'cocktail', 'spritz', 'liquore', 'amaro',
  'fritto', 'frittura', 'fritti',
];

function classifyByKeywords(food: string): FoodClassification {
  const lower = food.toLowerCase();

  for (const keyword of EXCLUDED_KEYWORDS) {
    if (lower.includes(keyword)) {
      return { status: 'excluded', groups: [], reason: `Contiene "${keyword}"` };
    }
  }

  for (const keyword of LIMITED_KEYWORDS) {
    if (lower.includes(keyword)) {
      return { status: 'limited', groups: [], reason: `Contiene "${keyword}"` };
    }
  }

  return { status: 'allowed', groups: [], reason: '' };
}

/**
 * Classify a custom food via API (with localStorage cache).
 * Falls back to keyword matching on error.
 */
export async function classifyCustomFood(food: string): Promise<FoodClassification> {
  // Check cache first
  const cached = getCachedClassification(food);
  if (cached) return cached;

  // Call API
  try {
    const res = await fetch('/api/classify-food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ food }),
    });

    if (res.ok) {
      const data = await res.json();
      const classification: FoodClassification = {
        status: data.status ?? 'allowed',
        groups: data.groups ?? [],
        reason: data.reason ?? '',
      };
      cacheFoodClassification(food, classification);
      return classification;
    }
  } catch {
    // fall through to keyword fallback
  }

  // Keyword fallback
  const fallback = classifyByKeywords(food);
  cacheFoodClassification(food, fallback);
  return fallback;
}

/**
 * Synchronous score calculation using pre-resolved classifications.
 */
export function calculateScore(
  selectedFoods: string[],
  foodRules: FoodRule[],
  dayType: DayTypeDefinition,
  customClassifications?: Record<string, FoodClassification>
): number {
  let score = 5;

  for (const foodName of selectedFoods) {
    const rule = foodRules.find(r => r.food === foodName);

    let status: string;
    if (rule) {
      status = rule.status;
    } else if (customClassifications?.[foodName]) {
      status = customClassifications[foodName].status;
    } else {
      // Sync fallback — keyword match
      status = classifyByKeywords(foodName).status;
    }

    if (status === 'excluded') {
      score -= 1.5 * dayType.severityWeight;
    } else if (status === 'limited') {
      score -= 0.5 * dayType.severityWeight;
    }
  }

  score = Math.max(1, Math.min(5, score));
  score = Math.round(score * 2) / 2;

  return score;
}
