export interface DayTypeDefinition {
  id: string;
  label: string;
  avoidList: string[];
  contextSentence: string;
  severityWeight: number;
}

export interface FoodRule {
  food: string;
  status: 'allowed' | 'limited' | 'excluded';
  category: 'proteine' | 'carboidrati' | 'verdure' | 'grassi' | 'altro';
  note?: string;
}

export interface DailyLog {
  date: string;              // ISO YYYY-MM-DD
  dayTypeId: string;
  selectedFoods: string[];   // food names
  score: number;
  aiComment: string;
  note?: string;             // optional free-text note
}

export interface StreakData {
  count: number;
  lastDate: string;          // ISO YYYY-MM-DD
}
