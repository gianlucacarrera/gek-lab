import type { DailyLog, StreakData } from './types';
import type { CheckInResponse, SugarTrackerState } from '@/types/app';

// Current user — set on login, used to scope all storage keys
let _currentUserId: string | null = null;

export function setCurrentUserId(userId: string | null): void {
  _currentUserId = userId;
}

export function getCurrentUserId(): string | null {
  return _currentUserId;
}

function userKey(base: string): string {
  const uid = _currentUserId ?? 'anonymous';
  return `gek_${uid}_${base}`;
}

// Food cache is shared across users (food classification doesn't change per user)
const SHARED_KEYS = {
  FOOD_CACHE: 'gek_food_cache',
} as const;

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

// Daily logs
export function getDailyLogs(): Record<string, DailyLog> {
  return read(userKey('daily_logs'), {});
}

export function getDailyLog(date: string): DailyLog | null {
  const logs = getDailyLogs();
  return logs[date] ?? null;
}

export function saveDailyLog(log: DailyLog): void {
  const logs = getDailyLogs();
  logs[log.date] = log;
  write(userKey('daily_logs'), logs);
}

// Streak
export function getStreak(): StreakData {
  return read(userKey('streak'), { count: 0, lastDate: '' });
}

export function updateStreak(date: string, score: number): StreakData {
  const streak = getStreak();

  if (score >= 3) {
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (streak.lastDate === yesterdayStr || streak.lastDate === date) {
      // Consecutive or same day update
      if (streak.lastDate !== date) {
        streak.count += 1;
      }
    } else {
      // Gap — reset
      streak.count = 1;
    }
    streak.lastDate = date;
  } else {
    // Score < 3 resets streak
    streak.count = 0;
    streak.lastDate = date;
  }

  write(userKey('streak'), streak);
  return streak;
}

// Weekly notes
export function getWeeklyNotes(): Record<string, string> {
  return read(userKey('weekly_notes'), {});
}

export function saveWeeklyNote(weekKey: string, note: string): void {
  const notes = getWeeklyNotes();
  notes[weekKey] = note;
  write(userKey('weekly_notes'), notes);
}

// Get the last 7 days of logs for weekly view
export function getWeekLogs(endDate: string): (DailyLog | null)[] {
  const logs = getDailyLogs();
  const result: (DailyLog | null)[] = [];
  const end = new Date(endDate);

  for (let i = 6; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    result.push(logs[key] ?? null);
  }

  return result;
}

// Diet start date
export function getDietStartDate(): string | null {
  return read(userKey('diet_start'), null);
}

export function setDietStartDate(date: string): void {
  write(userKey('diet_start'), date);
}

// Food classification cache
export interface FoodClassification {
  status: 'excluded' | 'limited' | 'allowed';
  groups: string[];
  reason: string;
}

export function getFoodCache(): Record<string, FoodClassification> {
  return read(SHARED_KEYS.FOOD_CACHE, {});
}

export function getCachedClassification(food: string): FoodClassification | null {
  const cache = getFoodCache();
  return cache[food.toLowerCase()] ?? null;
}

export function cacheFoodClassification(food: string, classification: FoodClassification): void {
  const cache = getFoodCache();
  cache[food.toLowerCase()] = classification;
  write(SHARED_KEYS.FOOD_CACHE, cache);
}

// All logs (for computing averages / calendar)
export function getAllDailyLogs(): DailyLog[] {
  const logs = getDailyLogs();
  return Object.values(logs).sort((a, b) => a.date.localeCompare(b.date));
}

// Sugar Tracker
export function getSugarTracker(): SugarTrackerState {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  const defaultStart = monday.toISOString().split('T')[0];

  const state = read<SugarTrackerState>(userKey('sugar_tracker'), {
    weekStartDate: defaultStart,
    dailyTotals: {},
  });

  // Reset if we're in a new week
  if (state.weekStartDate !== defaultStart) {
    state.weekStartDate = defaultStart;
    state.dailyTotals = {};
    write(userKey('sugar_tracker'), state);
  }

  return state;
}

export function addSugarUnits(dayIndex: number, units: number): SugarTrackerState {
  const state = getSugarTracker();
  state.dailyTotals[dayIndex] = (state.dailyTotals[dayIndex] ?? 0) + units;
  write(userKey('sugar_tracker'), state);
  return state;
}

export function clearSugarDay(dayIndex: number): SugarTrackerState {
  const state = getSugarTracker();
  delete state.dailyTotals[dayIndex];
  write(userKey('sugar_tracker'), state);
  return state;
}

export function resetSugarWeek(): SugarTrackerState {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  const state: SugarTrackerState = {
    weekStartDate: monday.toISOString().split('T')[0],
    dailyTotals: {},
  };
  write(userKey('sugar_tracker'), state);
  return state;
}

// Weekly Check-In
export function getCheckIns(): CheckInResponse[] {
  return read(userKey('check_ins'), []);
}

export function saveCheckIn(response: CheckInResponse): void {
  const checkIns = getCheckIns();
  // Replace if same week already exists
  const existing = checkIns.findIndex((c) => c.week === response.week);
  if (existing >= 0) {
    checkIns[existing] = response;
  } else {
    checkIns.push(response);
  }
  write(userKey('check_ins'), checkIns);
}
