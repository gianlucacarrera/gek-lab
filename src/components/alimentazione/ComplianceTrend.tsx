'use client';

import { useMemo } from 'react';
import type { DailyLog } from '@/lib/types';

interface ComplianceTrendProps {
  allLogs: DailyLog[];
}

function getBarColor(score: number): string {
  if (score >= 4) return 'var(--color-sage)';
  if (score >= 2.5) return 'var(--color-amber)';
  return 'var(--color-terracotta)';
}

export default function ComplianceTrend({ allLogs }: ComplianceTrendProps) {
  const chartData = useMemo(() => {
    const today = new Date();
    const days: Array<{ date: string; score: number | null; label: string }> = [];

    // Build log lookup
    const logByDate: Record<string, number> = {};
    for (const log of allLogs) {
      logByDate[log.date] = log.score;
    }

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayNum = d.getDate();
      // Show label every 7 days or on first/last
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
  const hasData = chartData.some((d) => d.score !== null);
  if (!hasData) return null;

  const width = 320;
  const height = 120;
  const padding = { top: 10, bottom: 24, left: 4, right: 4 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const barW = chartW / 30;
  const gap = 1.5;

  return (
    <div className="card space-y-2">
      <h3 className="text-sm font-semibold text-[var(--color-text)]">Andamento ultimi 30 giorni</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Threshold lines */}
        <line
          x1={padding.left}
          x2={width - padding.right}
          y1={padding.top + chartH * (1 - 4 / 5)}
          y2={padding.top + chartH * (1 - 4 / 5)}
          stroke="var(--color-sage)"
          strokeWidth="0.5"
          strokeDasharray="3,3"
          opacity="0.4"
        />
        <line
          x1={padding.left}
          x2={width - padding.right}
          y1={padding.top + chartH * (1 - 2.5 / 5)}
          y2={padding.top + chartH * (1 - 2.5 / 5)}
          stroke="var(--color-amber)"
          strokeWidth="0.5"
          strokeDasharray="3,3"
          opacity="0.4"
        />

        {/* Bars */}
        {chartData.map((day, i) => {
          const x = padding.left + i * barW + gap / 2;
          const w = barW - gap;

          if (day.score === null) {
            // Empty day — tiny gray stub
            return (
              <rect
                key={day.date}
                x={x}
                y={padding.top + chartH - 2}
                width={w}
                height={2}
                rx={1}
                fill="var(--color-cream-dark)"
              />
            );
          }

          const barH = Math.max(2, (day.score / 5) * chartH);
          const y = padding.top + chartH - barH;
          const isToday = i === 29;

          return (
            <g key={day.date}>
              <rect
                x={x}
                y={y}
                width={w}
                height={barH}
                rx={1.5}
                fill={getBarColor(day.score)}
                opacity={isToday ? 1 : 0.75}
              />
              {isToday && (
                <rect
                  x={x - 1}
                  y={y - 1}
                  width={w + 2}
                  height={barH + 2}
                  rx={2}
                  fill="none"
                  stroke="var(--color-terracotta)"
                  strokeWidth="1"
                  opacity="0.6"
                />
              )}
            </g>
          );
        })}

        {/* Date labels */}
        {chartData.map((day, i) => {
          if (!day.label) return null;
          const x = padding.left + i * barW + barW / 2;
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
