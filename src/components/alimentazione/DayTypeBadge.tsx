'use client';

import type { DayTypeDefinition } from '@/lib/types';

interface DayTypeBadgeProps {
  dayType: DayTypeDefinition;
}

function getBadgeStyle(id: string): { className: string; style?: React.CSSProperties } {
  switch (id) {
    case 'controlled':
      return { className: 'bg-[var(--color-terracotta)] text-white' };
    case 'partial':
      return {
        className: 'text-white',
        style: {
          background: `linear-gradient(135deg, var(--color-terracotta) 50%, var(--color-sage) 50%)`,
        },
      };
    case 'free':
      return { className: 'bg-[var(--color-sage)] text-white' };
    default:
      return { className: 'bg-[var(--color-text-light)] text-white' };
  }
}

export default function DayTypeBadge({ dayType }: DayTypeBadgeProps) {
  const { className, style } = getBadgeStyle(dayType.id);

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold ${className}`}
      style={style}
    >
      <span>{dayType.label}</span>
      {dayType.avoidList.length > 0 && (
        <span className="opacity-80">— evita {dayType.avoidList.join(', ')}</span>
      )}
    </div>
  );
}
