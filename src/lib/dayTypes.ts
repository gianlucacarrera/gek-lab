import { getMealType } from '@/data/constants';
import type { DayTypeDefinition } from './types';

const DAY_TYPES: Record<string, DayTypeDefinition> = {
  controlled: {
    id: 'controlled',
    label: 'Giorno di Controllo',
    avoidList: ['Frumento e glutine', 'Lieviti e fermentati', 'Nichel'],
    contextSentence: 'Oggi il tuo corpo riposa dai gruppi reattivi. Ogni giorno di controllo aiuta a ridurre l\'infiammazione.',
    severityWeight: 1.5,
  },
  partial: {
    id: 'partial',
    label: 'Giorno Parziale',
    avoidList: ['Zuccheri raffinati'],
    contextSentence: 'Oggi puoi essere più flessibile, ma occhio agli zuccheri raffinati.',
    severityWeight: 1.0,
  },
  free: {
    id: 'free',
    label: 'Giorno Libero',
    avoidList: [],
    contextSentence: 'Oggi è il tuo giorno libero. Goditi i pasti con serenità.',
    severityWeight: 0.5,
  },
};

export function getDayType(date: Date): DayTypeDefinition {
  const mealType = getMealType(date);
  return DAY_TYPES[mealType];
}

export { DAY_TYPES };
