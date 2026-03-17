'use client';

import { getRotationPhase } from '@/data/constants';
import type { DailyLog } from '@/lib/types';
import type { RotationPhase } from '@/types/app';

interface JourneyBannerProps {
  allLogs: DailyLog[];
}

const ROTATION_START = new Date('2026-02-27');

function getPhaseLabel(phase: RotationPhase): string {
  if (phase === 1) return 'Fase 1';
  if (phase === 2) return 'Fase 2';
  return 'Mantenimento';
}

function getPhaseTotalWeeks(phase: RotationPhase): number {
  if (phase === 1) return 8;
  if (phase === 2) return 8;
  return 0; // maintenance is open-ended
}

function getPhaseStartWeek(phase: RotationPhase): number {
  if (phase === 1) return 0;
  if (phase === 2) return 8;
  return 16;
}

export default function JourneyBanner({ allLogs }: JourneyBannerProps) {
  const today = new Date();
  const phase = getRotationPhase(today);

  const diffMs = today.getTime() - ROTATION_START.getTime();
  const totalDaysElapsed = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  const totalWeeksElapsed = Math.floor(totalDaysElapsed / 7);

  const phaseStartWeek = getPhaseStartWeek(phase);
  const weekInPhase = totalWeeksElapsed - phaseStartWeek + 1;
  const phaseTotalWeeks = getPhaseTotalWeeks(phase);
  const dayInWeek = (totalDaysElapsed % 7) + 1;

  // Progress bar: fraction through current phase
  const phaseProgress =
    phaseTotalWeeks > 0
      ? Math.min(1, (totalWeeksElapsed - phaseStartWeek) / phaseTotalWeeks)
      : 0;

  // Average score from all logs
  const logsWithScore = allLogs.filter((l) => l.score > 0);
  const avgScore =
    logsWithScore.length > 0
      ? logsWithScore.reduce((sum, l) => sum + l.score, 0) / logsWithScore.length
      : 0;

  // Trend: compare last 7 days avg to previous 7 days avg
  const todayStr = today.toISOString().split('T')[0];
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const fourteenDaysAgo = new Date(today);
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const recentLogs = logsWithScore.filter(
    (l) => l.date > sevenDaysAgo.toISOString().split('T')[0] && l.date <= todayStr
  );
  const previousLogs = logsWithScore.filter(
    (l) =>
      l.date > fourteenDaysAgo.toISOString().split('T')[0] &&
      l.date <= sevenDaysAgo.toISOString().split('T')[0]
  );

  const recentAvg =
    recentLogs.length > 0
      ? recentLogs.reduce((s, l) => s + l.score, 0) / recentLogs.length
      : 0;
  const previousAvg =
    previousLogs.length > 0
      ? previousLogs.reduce((s, l) => s + l.score, 0) / previousLogs.length
      : 0;

  let trendText = '';
  if (recentLogs.length === 0) {
    trendText = 'Inizia a registrare per vedere il tuo andamento';
  } else if (previousLogs.length === 0) {
    trendText = `Media attuale: ${avgScore.toFixed(1)}/5`;
  } else if (recentAvg > previousAvg + 0.3) {
    trendText = 'In miglioramento rispetto alla settimana scorsa';
  } else if (recentAvg < previousAvg - 0.3) {
    trendText = 'Leggero calo — piccoli aggiustamenti ti riportano in pista';
  } else {
    trendText = 'Costante — stai mantenendo un buon ritmo';
  }

  const scoreColor =
    avgScore >= 4
      ? 'var(--color-sage)'
      : avgScore >= 2.5
        ? 'var(--color-amber)'
        : avgScore > 0
          ? 'var(--color-terracotta)'
          : 'var(--color-text-lighter)';

  return (
    <div className="card space-y-3">
      {/* Phase + week */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-semibold text-[var(--color-terracotta)] uppercase tracking-wider">
            {getPhaseLabel(phase)}
          </span>
          <p className="text-sm text-[var(--color-text)]">
            {phaseTotalWeeks > 0 ? (
              <>
                Settimana {weekInPhase} di {phaseTotalWeeks}
                <span className="text-[var(--color-text-lighter)]"> · giorno {dayInWeek}</span>
              </>
            ) : (
              <>
                Settimana {weekInPhase}
                <span className="text-[var(--color-text-lighter)]"> · giorno {dayInWeek}</span>
              </>
            )}
          </p>
        </div>

        {/* Average score */}
        {avgScore > 0 && (
          <div className="text-right">
            <span className="text-2xl font-bold" style={{ color: scoreColor }}>
              {avgScore.toFixed(1)}
            </span>
            <span className="text-xs text-[var(--color-text-lighter)]">/5</span>
          </div>
        )}
      </div>

      {/* Phase progress bar */}
      {phaseTotalWeeks > 0 && (
        <div className="relative h-2 rounded-full bg-[var(--color-cream-dark)] overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-terracotta)] transition-all duration-500"
            style={{ width: `${phaseProgress * 100}%` }}
          />
        </div>
      )}

      {/* Trend */}
      <p className="text-xs text-[var(--color-text-light)] leading-relaxed">
        {trendText}
      </p>
    </div>
  );
}
