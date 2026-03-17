'use client';

import type { DayTypeDefinition } from '@/lib/types';

interface MorningSignalProps {
  dayType: DayTypeDefinition;
  onStartRecap: () => void;
}

export default function MorningSignal({ dayType, onStartRecap }: MorningSignalProps) {
  const isFreeDay = dayType.avoidList.length === 0;

  return (
    <div className="px-4 py-6 flex flex-col items-center text-center space-y-5">
      {/* Context sentence */}
      <p className="text-sm text-[var(--color-text-light)] leading-relaxed max-w-xs">
        {dayType.contextSentence}
      </p>

      {/* Avoid list pills or free day badge */}
      {!isFreeDay && (
        <div className="flex flex-wrap justify-center gap-2">
          {dayType.avoidList.map((item) => (
            <span
              key={item}
              className="inline-flex items-center rounded-full bg-[var(--color-terracotta-bg)] px-3 py-1 text-xs font-medium text-[var(--color-terracotta)]"
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {/* Start recap button */}
      <button
        onClick={onStartRecap}
        className="w-full max-w-xs py-3 rounded-xl bg-[var(--color-terracotta)] text-white text-sm font-semibold
                   transition-opacity duration-200 hover:opacity-90 active:opacity-80 mt-2"
      >
        Registra i pasti
      </button>
    </div>
  );
}
