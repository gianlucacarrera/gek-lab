'use client';

import type { DailyLog, DayTypeDefinition } from '@/lib/types';

interface TodayResultProps {
  todayLog: DailyLog;
  yesterdayScore: number | null;
  tomorrowDayType: DayTypeDefinition;
  onEdit: () => void;
}

function getScoreColor(score: number): string {
  if (score >= 4) return 'var(--color-sage)';
  if (score >= 2.5) return 'var(--color-amber)';
  return 'var(--color-terracotta)';
}

function StarIcon({ fill }: { fill: 'full' | 'half' | 'empty' }) {
  const color = 'currentColor';

  if (fill === 'empty') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
      </svg>
    );
  }

  if (fill === 'half') {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24">
        <defs>
          <clipPath id="halfClipResult">
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
        </defs>
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" fill="none" stroke={color} strokeWidth="1.5" />
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" fill={color} clipPath="url(#halfClipResult)" />
      </svg>
    );
  }

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  );
}

function StarDisplay({ score }: { score: number }) {
  const stars: ('full' | 'half' | 'empty')[] = [];
  for (let i = 1; i <= 5; i++) {
    if (score >= i) stars.push('full');
    else if (score >= i - 0.5) stars.push('half');
    else stars.push('empty');
  }

  return (
    <div className="flex items-center gap-0.5" style={{ color: getScoreColor(score) }}>
      {stars.map((fill, idx) => (
        <StarIcon key={idx} fill={fill} />
      ))}
    </div>
  );
}

function getTomorrowBadgeStyles(id: string) {
  switch (id) {
    case 'controlled':
      return 'bg-[var(--color-terracotta-bg)] text-[var(--color-terracotta)]';
    case 'partial':
      return 'bg-[var(--color-amber-light)] text-[var(--color-amber)]';
    case 'free':
      return 'bg-[var(--color-sage-light)] text-[var(--color-sage-dark)]';
    default:
      return 'bg-[var(--color-cream-dark)] text-[var(--color-text-light)]';
  }
}

export default function TodayResult({ todayLog, yesterdayScore, tomorrowDayType, onEdit }: TodayResultProps) {
  return (
    <div className="space-y-4">
      {/* Today's score card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--color-text)]">Il tuo punteggio di oggi</h3>
          <span className="text-lg font-bold" style={{ color: getScoreColor(todayLog.score) }}>
            {todayLog.score}/5
          </span>
        </div>

        <div className="flex justify-center">
          <StarDisplay score={todayLog.score} />
        </div>

        {/* AI comment */}
        <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
          {todayLog.aiComment}
        </p>

        {/* Yesterday comparison */}
        {yesterdayScore !== null && (
          <div className="pt-2 border-t border-[var(--color-cream-dark)]">
            <p className="text-xs text-[var(--color-text-lighter)]">
              Ieri: {yesterdayScore}/5
              {todayLog.score > yesterdayScore && ' — in miglioramento'}
              {todayLog.score === yesterdayScore && ' — costante'}
              {todayLog.score < yesterdayScore && ' — un passo indietro, domani si riparte'}
            </p>
          </div>
        )}
      </div>

      {/* Logged foods + edit */}
      <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
        {todayLog.selectedFoods.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {todayLog.selectedFoods.map((food) => (
              <span
                key={food}
                className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-cream)] text-[var(--color-text-light)]"
              >
                {food}
              </span>
            ))}
          </div>
        )}
        <button
          onClick={onEdit}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-[var(--color-cream-dark)] text-sm font-medium text-[var(--color-text-light)] hover:border-[var(--color-terracotta-light)] hover:text-[var(--color-terracotta)] transition-colors duration-200"
        >
          + Modifica i pasti
        </button>
      </div>

      {/* Tomorrow bridge */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getTomorrowBadgeStyles(tomorrowDayType.id)}`}>
          {tomorrowDayType.label}
        </span>
        <p className="text-xs text-[var(--color-text-light)] flex-1">
          {tomorrowDayType.avoidList.length > 0
            ? `Domani evita: ${tomorrowDayType.avoidList.join(', ')}`
            : 'Domani è il tuo giorno libero'}
        </p>
      </div>
    </div>
  );
}
