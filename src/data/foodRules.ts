import type { FoodRule } from '@/lib/types';

/**
 * Curated food rules for the Alimentazione daily logger.
 *
 * Derived from ALWAYS_ALLOWED_FOODS and RESTRICTED_FOODS in constants.ts.
 * - ALWAYS_ALLOWED_FOODS → status: 'allowed'
 * - RESTRICTED_FOODS (Cereali e glutine) → status: 'excluded'
 * - RESTRICTED_FOODS (Lieviti e fermentati) → status: 'excluded'
 * - RESTRICTED_FOODS (Nichel) → status: 'limited'
 * - RESTRICTED_FOODS (Preparazioni industriali) → status: 'excluded'
 *
 * ~40 most representative items for daily food logging.
 */
export const FOOD_RULES: FoodRule[] = [
  // ── Proteine (allowed) ──────────────────────────────────────────
  { food: 'Pollo', status: 'allowed', category: 'proteine' },
  { food: 'Tacchino', status: 'allowed', category: 'proteine' },
  { food: 'Manzo', status: 'allowed', category: 'proteine' },
  { food: 'Pesce fresco', status: 'allowed', category: 'proteine' },
  { food: 'Uova', status: 'allowed', category: 'proteine' },
  { food: 'Legumi', status: 'allowed', category: 'proteine' },
  { food: 'Prosciutto crudo', status: 'allowed', category: 'proteine' },

  // ── Proteine (restricted) ───────────────────────────────────────
  { food: 'Formaggi stagionati', status: 'excluded', category: 'proteine', note: 'Lieviti e fermentati' },
  { food: 'Mozzarella / Ricotta', status: 'excluded', category: 'proteine', note: 'Lieviti e fermentati' },
  { food: 'Yogurt', status: 'excluded', category: 'proteine', note: 'Lieviti e fermentati' },
  { food: 'Ostriche', status: 'limited', category: 'proteine', note: 'Nichel' },

  // ── Carboidrati (allowed) ───────────────────────────────────────
  { food: 'Riso', status: 'allowed', category: 'carboidrati' },
  { food: 'Quinoa', status: 'allowed', category: 'carboidrati' },
  { food: 'Grano saraceno', status: 'allowed', category: 'carboidrati' },
  { food: 'Miglio', status: 'allowed', category: 'carboidrati' },
  { food: 'Patate', status: 'allowed', category: 'carboidrati' },
  { food: 'Gallette di riso', status: 'allowed', category: 'carboidrati' },

  // ── Carboidrati (restricted) ────────────────────────────────────
  { food: 'Pasta di frumento', status: 'excluded', category: 'carboidrati', note: 'Cereali e glutine' },
  { food: 'Pane', status: 'excluded', category: 'carboidrati', note: 'Cereali e glutine' },
  { food: 'Pizza', status: 'excluded', category: 'carboidrati', note: 'Cereali e glutine' },
  { food: 'Farro', status: 'excluded', category: 'carboidrati', note: 'Cereali e glutine' },
  { food: 'Avena', status: 'limited', category: 'carboidrati', note: 'Nichel' },
  { food: 'Mais', status: 'limited', category: 'carboidrati', note: 'Nichel' },

  // ── Verdure (allowed) ───────────────────────────────────────────
  { food: 'Zucchine', status: 'allowed', category: 'verdure' },
  { food: 'Insalata', status: 'allowed', category: 'verdure' },
  { food: 'Carote', status: 'allowed', category: 'verdure' },
  { food: 'Broccoli', status: 'allowed', category: 'verdure' },
  { food: 'Mela', status: 'allowed', category: 'verdure' },
  { food: 'Banana', status: 'allowed', category: 'verdure' },
  { food: 'Fragole', status: 'allowed', category: 'verdure' },

  // ── Verdure (restricted — Nichel) ───────────────────────────────
  { food: 'Spinaci', status: 'limited', category: 'verdure', note: 'Nichel' },
  { food: 'Pomodoro', status: 'limited', category: 'verdure', note: 'Nichel' },
  { food: 'Kiwi', status: 'limited', category: 'verdure', note: 'Nichel' },
  { food: 'Pera', status: 'limited', category: 'verdure', note: 'Nichel' },

  // ── Grassi ──────────────────────────────────────────────────────
  { food: 'Olio extravergine d\'oliva', status: 'allowed', category: 'grassi' },
  { food: 'Avocado', status: 'allowed', category: 'grassi' },
  { food: 'Mandorle tostate', status: 'limited', category: 'grassi', note: 'Nichel' },
  { food: 'Noci', status: 'limited', category: 'grassi', note: 'Nichel' },

  // ── Altro (allowed) ─────────────────────────────────────────────
  { food: 'Caffè', status: 'allowed', category: 'altro' },
  { food: 'Tè verde', status: 'allowed', category: 'altro' },

  // ── Altro (restricted) ──────────────────────────────────────────
  { food: 'Cioccolato', status: 'limited', category: 'altro', note: 'Nichel' },
  { food: 'Vino', status: 'excluded', category: 'altro', note: 'Lieviti e fermentati' },
  { food: 'Birra', status: 'excluded', category: 'altro', note: 'Lieviti e fermentati' },
  { food: 'Merendine confezionate', status: 'excluded', category: 'altro', note: 'Preparazioni industriali' },
];
