import type { DailyLog, StreakData } from './types';
import type { CheckInResponse, SugarTrackerState } from '@/types/app';
import { supabase } from './supabase';

// ─── Food classification cache (localStorage — shared, not user-specific) ───
export interface FoodClassification {
  status: 'excluded' | 'limited' | 'allowed';
  groups: string[];
  reason: string;
}

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function getFoodCache(): Record<string, FoodClassification> {
  return readLocal('gek_food_cache', {});
}

export function getCachedClassification(food: string): FoodClassification | null {
  const cache = getFoodCache();
  return cache[food.toLowerCase()] ?? null;
}

export function cacheFoodClassification(food: string, classification: FoodClassification): void {
  const cache = getFoodCache();
  cache[food.toLowerCase()] = classification;
  writeLocal('gek_food_cache', cache);
}

// ─── Daily logs (Supabase) ──────────────────────────────────────────
export async function getDailyLogs(): Promise<Record<string, DailyLog>> {
  const { data } = await supabase
    .from('daily_logs')
    .select('date, day_type_id, selected_foods, score, ai_comment');

  if (!data) return {};

  const logs: Record<string, DailyLog> = {};
  for (const row of data) {
    logs[row.date] = {
      date: row.date,
      dayTypeId: row.day_type_id,
      selectedFoods: row.selected_foods ?? [],
      score: Number(row.score),
      aiComment: row.ai_comment ?? '',
    };
  }
  return logs;
}

export async function getDailyLog(date: string): Promise<DailyLog | null> {
  const { data } = await supabase
    .from('daily_logs')
    .select('date, day_type_id, selected_foods, score, ai_comment')
    .eq('date', date)
    .maybeSingle();

  if (!data) return null;

  return {
    date: data.date,
    dayTypeId: data.day_type_id,
    selectedFoods: data.selected_foods ?? [],
    score: Number(data.score),
    aiComment: data.ai_comment ?? '',
  };
}

export async function saveDailyLog(log: DailyLog): Promise<void> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) return;

  await supabase.from('daily_logs').upsert(
    {
      user_id: userId,
      date: log.date,
      day_type_id: log.dayTypeId,
      selected_foods: log.selectedFoods,
      score: log.score,
      ai_comment: log.aiComment,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,date' }
  );
}

// ─── Streak (Supabase) ──────────────────────────────────────────────
export async function getStreak(): Promise<StreakData> {
  const { data } = await supabase
    .from('streaks')
    .select('count, last_date')
    .maybeSingle();

  if (!data) return { count: 0, lastDate: '' };
  return { count: data.count ?? 0, lastDate: data.last_date ?? '' };
}

export async function updateStreak(date: string, score: number): Promise<StreakData> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) return { count: 0, lastDate: '' };

  const streak = await getStreak();

  if (score >= 3) {
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (streak.lastDate === yesterdayStr || streak.lastDate === date) {
      if (streak.lastDate !== date) {
        streak.count += 1;
      }
    } else {
      streak.count = 1;
    }
    streak.lastDate = date;
  } else {
    streak.count = 0;
    streak.lastDate = date;
  }

  await supabase.from('streaks').upsert(
    {
      user_id: userId,
      count: streak.count,
      last_date: streak.lastDate || null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );

  return streak;
}

// ─── All logs (for averages / calendar) ─────────────────────────────
export async function getAllDailyLogs(): Promise<DailyLog[]> {
  const logs = await getDailyLogs();
  return Object.values(logs).sort((a, b) => a.date.localeCompare(b.date));
}

// ─── Diet start date (Supabase) ─────────────────────────────────────
export async function getDietStartDate(): Promise<string | null> {
  const { data } = await supabase
    .from('diet_settings')
    .select('diet_start_date')
    .maybeSingle();

  return data?.diet_start_date ?? null;
}

export async function setDietStartDate(date: string): Promise<void> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) return;

  await supabase.from('diet_settings').upsert(
    {
      user_id: userId,
      diet_start_date: date,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );
}

// ─── Weekly notes (Supabase) ────────────────────────────────────────
export async function getWeeklyNotes(): Promise<Record<string, string>> {
  const { data } = await supabase
    .from('weekly_notes')
    .select('week_key, note');

  if (!data) return {};
  const notes: Record<string, string> = {};
  for (const row of data) {
    notes[row.week_key] = row.note;
  }
  return notes;
}

export async function saveWeeklyNote(weekKey: string, note: string): Promise<void> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) return;

  await supabase.from('weekly_notes').upsert(
    {
      user_id: userId,
      week_key: weekKey,
      note,
    },
    { onConflict: 'user_id,week_key' }
  );
}

// ─── Weekly Check-In (Supabase) ─────────────────────────────────────
export async function getCheckIns(): Promise<CheckInResponse[]> {
  const { data } = await supabase
    .from('check_ins')
    .select('week, energy, digestion, adherence')
    .order('created_at', { ascending: true });

  if (!data) return [];
  return data.map((row) => ({
    week: row.week,
    energy: row.energy,
    digestion: row.digestion,
    adherence: row.adherence,
  }));
}

export async function saveCheckIn(response: CheckInResponse): Promise<void> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) return;

  await supabase.from('check_ins').upsert(
    {
      user_id: userId,
      week: response.week,
      energy: response.energy,
      digestion: response.digestion,
      adherence: response.adherence,
    },
    { onConflict: 'user_id,week' }
  );
}

// ─── Sugar Tracker (Supabase) ───────────────────────────────────────
export async function getSugarTracker(): Promise<SugarTrackerState> {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  const defaultStart = monday.toISOString().split('T')[0];

  const { data } = await supabase
    .from('sugar_tracker')
    .select('week_start_date, daily_totals')
    .maybeSingle();

  if (!data || data.week_start_date !== defaultStart) {
    // New week or no data — return fresh state (will be saved on first add)
    return { weekStartDate: defaultStart, dailyTotals: {} };
  }

  return {
    weekStartDate: data.week_start_date,
    dailyTotals: (data.daily_totals as Record<string, number>) ?? {},
  };
}

export async function addSugarUnits(dayIndex: number, units: number): Promise<SugarTrackerState> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) return { weekStartDate: '', dailyTotals: {} };

  const state = await getSugarTracker();
  state.dailyTotals[dayIndex] = (state.dailyTotals[dayIndex] ?? 0) + units;

  await supabase.from('sugar_tracker').upsert(
    {
      user_id: userId,
      week_start_date: state.weekStartDate,
      daily_totals: state.dailyTotals,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );

  return state;
}

export async function clearSugarDay(dayIndex: number): Promise<SugarTrackerState> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) return { weekStartDate: '', dailyTotals: {} };

  const state = await getSugarTracker();
  delete state.dailyTotals[dayIndex];

  await supabase.from('sugar_tracker').upsert(
    {
      user_id: userId,
      week_start_date: state.weekStartDate,
      daily_totals: state.dailyTotals,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );

  return state;
}

export async function resetSugarWeek(): Promise<SugarTrackerState> {
  const userId = (await supabase.auth.getUser()).data.user?.id;
  if (!userId) return { weekStartDate: '', dailyTotals: {} };

  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  const state: SugarTrackerState = {
    weekStartDate: monday.toISOString().split('T')[0],
    dailyTotals: {},
  };

  await supabase.from('sugar_tracker').upsert(
    {
      user_id: userId,
      week_start_date: state.weekStartDate,
      daily_totals: state.dailyTotals,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' }
  );

  return state;
}

// Legacy sync exports removed — all storage is now async via Supabase
// Components must use useEffect + useState to load data
