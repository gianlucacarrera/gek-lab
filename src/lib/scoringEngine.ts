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

const STATUS_SEVERITY: Record<string, number> = { excluded: 2, limited: 1, allowed: 0 };

/**
 * Return the stricter of two classifications.
 */
function stricterOf(a: FoodClassification, b: FoodClassification): FoodClassification {
  return (STATUS_SEVERITY[a.status] ?? 0) >= (STATUS_SEVERITY[b.status] ?? 0) ? a : b;
}

/**
 * Classify a custom food via API (with localStorage cache).
 * Cross-checks against keyword list and always takes the stricter result.
 */
export async function classifyCustomFood(food: string): Promise<FoodClassification> {
  // Check cache first
  const cached = getCachedClassification(food);
  if (cached) return cached;

  // Keyword baseline — always computed as safety net
  const keywordResult = classifyByKeywords(food);

  // Call API
  let apiResult: FoodClassification | null = null;
  try {
    const res = await fetch('/api/classify-food', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ food }),
    });

    if (res.ok) {
      const data = await res.json();
      apiResult = {
        status: data.status ?? 'allowed',
        groups: data.groups ?? [],
        reason: data.reason ?? '',
      };
    }
  } catch {
    // API failed — keyword result is our only source
  }

  // Take the stricter of API and keyword results
  const final = apiResult ? stricterOf(apiResult, keywordResult) : keywordResult;
  cacheFoodClassification(food, final);
  return final;
}

const ALCOHOL_KEYWORDS = [
  'vino', 'birra', 'prosecco', 'champagne', 'spumante',
  'cocktail', 'spritz', 'liquore', 'amaro', 'grappa',
  'whisky', 'rum', 'gin', 'vodka', 'aperol', 'negroni',
];

function isAlcohol(foodName: string): boolean {
  const lower = foodName.toLowerCase();
  return ALCOHOL_KEYWORDS.some((kw) => lower.includes(kw));
}

/**
 * Synchronous score calculation using pre-resolved classifications.
 * On free days, only alcohol is penalized — all other restricted foods are allowed.
 */
export function calculateScore(
  selectedFoods: string[],
  foodRules: FoodRule[],
  dayType: DayTypeDefinition,
  customClassifications?: Record<string, FoodClassification>
): number {
  let score = 5;
  const isFreeDay = dayType.id === 'free';

  for (const foodName of selectedFoods) {
    const rule = foodRules.find(r => r.food === foodName);

    let status: string;
    if (rule) {
      status = rule.status;
    } else if (customClassifications?.[foodName]) {
      status = customClassifications[foodName].status;
    } else {
      status = classifyByKeywords(foodName).status;
    }

    // On free days, skip penalties for everything except alcohol
    if (isFreeDay && !isAlcohol(foodName)) {
      continue;
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
