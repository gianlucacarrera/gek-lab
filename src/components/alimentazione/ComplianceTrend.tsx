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
    const days: Array<{ date: string; score: number | null; label: string }> = [];

    const logByDate: Record<string, number> = {};
    for (const log of allLogs) {
      logByDate[log.date] = log.score;
    }

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayNum = d.getDate();
      const showLabel = i === 29 || i === 0 || i % 7 === 0;
      days.push({
        date: dateStr,
        score: logByDate[dateStr] ?? null,
        label: showLabel ? `${dayNum}/${d.getMonth() + 1}` : '',
      });
    }

    return days;
  }, [allLogs]);

  // Only show if there's at least one log
  const scoredDays = chartData.filter((d) => d.score !== null);
  if (scoredDays.length === 0) return null;

  const width = 320;
  const height = 100;
  const padding = { top: 12, bottom: 24, left: 8, right: 8 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  // Build points for scored days only
  const points = chartData
    .map((day, i) => {
      if (day.score === null) return null;
      const x = padding.left + (i / 29) * chartW;
      const y = padding.top + chartH - (day.score / 5) * chartH;
      return { x, y, score: day.score, isToday: i === 29 };
    })
    .filter(Boolean) as Array<{ x: number; y: number; score: number; isToday: boolean }>;

  // Build the line path
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Build gradient fill path (area under the line)
  const areaPath = points.length > 1
    ? `${linePath} L ${points[points.length - 1].x} ${padding.top + chartH} L ${points[0].x} ${padding.top + chartH} Z`
    : '';

  return (
    <div className="card space-y-2">
      <h3 className="text-sm font-semibold text-[var(--color-text)]">Andamento ultimi 30 giorni</h3>
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

        {/* Line */}
        {points.length > 1 && (
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-sage)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Points */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.isToday ? 4 : 2.5}
            fill={getPointColor(p.score)}
            stroke={p.isToday ? 'var(--color-terracotta)' : 'none'}
            strokeWidth={p.isToday ? 1.5 : 0}
          />
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
