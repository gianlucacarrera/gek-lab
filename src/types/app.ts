// Navigation
export type Tab = 'esami' | 'alimenti' | 'alimentazione';

// Sugar Tracker
export interface SugarTrackerState {
  weekStartDate: string;
  dailyTotals: Record<number, number>;
}

// Weekly Check-In
export interface CheckInResponse {
  week: string;
  energy: number;
  digestion: number;
  adherence: number;
}

export interface WeeklyCheckInState {
  responses: CheckInResponse[];
}

// AI Meal Plan
export interface MealPlanRequest {
  date: string;
  fridgeItems?: string[];
}

export interface GeneratedMealPlan {
  breakfast: { title: string; description: string };
  lunch: { title: string; description: string };
  dinner: { title: string; description: string };
  notes?: string;
}

// Data types
export interface LabMarker {
  name: string;
  value: number;
  unit: string;
  refLow?: number;
  refHigh?: number;
  status: 'normal' | 'mildly_elevated' | 'elevated' | 'high';
}

export interface GeneResult {
  gene: string;
  snp: string;
  result: string;
  isVariant: boolean;
  plainLabel: string;
  meaning: string;
}

export interface FoodItem {
  name: string;
  category: string;
}

export interface SugarUnitItem {
  name: string;
  portion: string;
  units: number;
  category: 'SWEETS' | 'DRINKS' | 'SWEETENERS' | 'DRIED_FRUIT';
}

export interface MenuIdea {
  mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  shortDescription: string;
  fullDescription: string;
}

export interface Supplement {
  name: string;
  benefit: string;
  dosage: string;
}

export type MealType = 'controlled' | 'free' | 'partial';
export type RotationPhase = 1 | 2 | 'maintenance';
