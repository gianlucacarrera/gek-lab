import type { FoodRule, DayTypeDefinition } from './types';

/**
 * Keywords that indicate a custom food belongs to a restricted group.
 * Grouped by the food group they map to (all treated as 'excluded').
 */
const EXCLUDED_KEYWORDS: string[] = [
  // Frumento e Glutine
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
  // Lieviti e Fermentati
  'formaggio', 'parmigiano', 'grana', 'pecorino', 'gorgonzola', 'mozzarella',
  'ricotta', 'mascarpone', 'yogurt', 'kefir',
  'tofu', 'tempeh', 'miso', 'soia',
  'fungo', 'funghi',
  'aceto', 'maionese',
  'vino', 'birra', 'prosecco', 'champagne', 'spumante',
  // Nichel Solfato
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

/**
 * Classify a custom (free-text) food against restricted keywords.
 * Returns 'excluded', 'limited', or 'allowed'.
 */
export function classifyCustomFood(food: string): FoodRule['status'] {
  const lower = food.toLowerCase();

  for (const keyword of EXCLUDED_KEYWORDS) {
    if (lower.includes(keyword)) return 'excluded';
  }

  for (const keyword of LIMITED_KEYWORDS) {
    if (lower.includes(keyword)) return 'limited';
  }

  return 'allowed';
}

export function calculateScore(
  selectedFoods: string[],
  foodRules: FoodRule[],
  dayType: DayTypeDefinition
): number {
  let score = 5;

  for (const foodName of selectedFoods) {
    const rule = foodRules.find(r => r.food === foodName);

    // Use rule if it exists, otherwise classify custom food by keywords
    const status = rule ? rule.status : classifyCustomFood(foodName);

    if (status === 'excluded') {
      score -= 1.5 * dayType.severityWeight;
    } else if (status === 'limited') {
      score -= 0.5 * dayType.severityWeight;
    }
  }

  // Clamp to [1, 5] and round to nearest 0.5
  score = Math.max(1, Math.min(5, score));
  score = Math.round(score * 2) / 2;

  return score;
}
