'use client';

import { useMemo } from 'react';
import type { DailyLog } from '@/lib/types';

interface ComplianceTrendProps {
  allLogs: DailyLog[];
}

function getPointColor(score: number): string {
  if (score >= 4) return 'var(--color-sage)';
  if (score >= 2.5) return 'var(--color-amber)';
  return 'var(--color-terracotta)';
}

export default function ComplianceTrend({ allLogs }: ComplianceTrendProps) {
  const chartData = useMemo(() => {
    const today = new Date();
    const days: Array<{ date: string; score: number | null; sugarUnits: number | null; label: string }> = [];

    const logByDate: Record<string, DailyLog> = {};
    for (const log of allLogs) {
      logByDate[log.date] = log;
    }

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayNum = d.getDate();
      const showLabel = i === 29 || i === 0 || i % 7 === 0;
      const log = logByDate[dateStr];
      days.push({
        date: dateStr,
        score: log?.score ?? null,
        sugarUnits: log?.sugarUnits ?? null,
        label: showLabel ? `${dayNum}/${d.getMonth() + 1}` : '',
      });
    }

    return days;
  }, [allLogs]);

  const scoredDays = chartData.filter((d) => d.score !== null);
  if (scoredDays.length === 0) return null;

  const width = 320;
  const height = 120;
  const padding = { top: 12, bottom: 24, left: 8, right: 8 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Score line points
  const scorePoints = chartData
    .map((day, i) => {
      if (day.score === null) return null;
      const x = padding.left + (i / 29) * chartW;
      const y = padding.top + chartH - (day.score / 5) * chartH;
      return { x, y, score: day.score, isToday: i === 29 };
    })
    .filter(Boolean) as Array<{ x: number; y: number; score: number; isToday: boolean }>;

  // Sugar unit star points (scaled to same Y axis: max 5 units maps to score 5)
  const sugarPoints = chartData
    .map((day, i) => {
      if (day.sugarUnits === null || day.sugarUnits === 0) return null;
      const x = padding.left + (i / 29) * chartW;
      const y = padding.top + chartH - (day.sugarUnits / 5) * chartH;
      return { x, y, units: day.sugarUnits };
    })
    .filter(Boolean) as Array<{ x: number; y: number; units: number }>;

  // Score line path
  const linePath = scorePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Area fill
  const areaPath = scorePoints.length > 1
    ? `${linePath} L ${scorePoints[scorePoints.length - 1].x} ${padding.top + chartH} L ${scorePoints[0].x} ${padding.top + chartH} Z`
    : '';

  return (
    <div className="card space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">Andamento ultimi 30 giorni</h3>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[var(--color-sage)]" />
            <span className="text-[9px] text-[var(--color-text-lighter)]">punteggio</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[var(--color-amber)] text-[9px]">★</span>
            <span className="text-[9px] text-[var(--color-text-lighter)]">zuccheri</span>
          </div>
        </div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Threshold lines */}
        <line
          x1={padding.left} x2={width - padding.right}
          y1={padding.top + chartH * (1 - 4 / 5)} y2={padding.top + chartH * (1 - 4 / 5)}
          stroke="var(--color-sage)" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.3"
        />
        <line
          x1={padding.left} x2={width - padding.right}
          y1={padding.top + chartH * (1 - 2.5 / 5)} y2={padding.top + chartH * (1 - 2.5 / 5)}
          stroke="var(--color-amber)" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.3"
        />

        {/* Area fill */}
        {areaPath && (
          <path d={areaPath} fill="var(--color-sage)" opacity="0.08" />
        )}

        {/* Score line */}
        {scorePoints.length > 1 && (
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-sage)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Score points */}
        {scorePoints.map((p, i) => (
          <circle
            key={`score-${i}`}
            cx={p.x}
            cy={p.y}
            r={p.isToday ? 4 : 2.5}
            fill={getPointColor(p.score)}
            stroke={p.isToday ? 'var(--color-terracotta)' : 'none'}
            strokeWidth={p.isToday ? 1.5 : 0}
          />
        ))}

        {/* Sugar unit stars */}
        {sugarPoints.map((p, i) => (
          <text
            key={`sugar-${i}`}
            x={p.x}
            y={p.y + 1}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="8"
            fill="var(--color-amber)"
          >
            ★
          </text>
        ))}

        {/* Date labels */}
        {chartData.map((day, i) => {
          if (!day.label) return null;
          const x = padding.left + (i / 29) * chartW;
          return (
            <text
              key={`label-${day.date}`}
              x={x}
              y={height - 4}
              textAnchor="middle"
              fontSize="7"
              fill="var(--color-text-lighter)"
            >
              {day.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
