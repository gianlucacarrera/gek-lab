'use client';

import type { DayTypeDefinition } from '@/lib/types';

interface TodayCardProps {
  dayType: DayTypeDefinition;
}

const SUGGESTIONS: Record<string, string[]> = {
  controlled: [
    'Prova il grano saraceno al posto della pasta di frumento',
    'Condisci con olio extravergine e erbe aromatiche',
  ],
  partial: [
    'Evita gli zuccheri raffinati — scegli frutta fresca se hai voglia di dolce',
    'Un piatto con proteine e verdure è sempre una scelta sicura',
  ],
  free: [
    'Oggi puoi reintrodurre i tuoi alimenti abituali — goditi il pasto',
    'Se vuoi, è un buon giorno per provare una ricetta nuova',
  ],
};

function getDayTypeStyles(id: string) {
  switch (id) {
    case 'controlled':
      return {
        bg: 'bg-[var(--color-terracotta-bg)]',
        border: 'border-[var(--color-terracotta-light)]',
        badge: 'bg-[var(--color-terracotta)] text-white',
        text: 'text-[var(--color-terracotta)]',
      };
    case 'partial':
      return {
        bg: 'bg-[var(--color-amber-bg)]',
        border: 'border-[var(--color-amber-light)]',
        badge: 'bg-[var(--color-amber)] text-white',
        text: 'text-[var(--color-amber)]',
      };
    case 'free':
      return {
        bg: 'bg-[var(--color-sage-light)]',
        border: 'border-[var(--color-sage)]',
        badge: 'bg-[var(--color-sage)] text-white',
        text: 'text-[var(--color-sage-dark)]',
      };
    default:
      return {
        bg: 'bg-[var(--color-cream)]',
        border: 'border-[var(--color-cream-dark)]',
        badge: 'bg-[var(--color-text-light)] text-white',
        text: 'text-[var(--color-text-light)]',
      };
  }
}

export default function TodayCard({ dayType }: TodayCardProps) {
  const styles = getDayTypeStyles(dayType.id);
  const suggestions = SUGGESTIONS[dayType.id] ?? [];

  return (
    <div className={`rounded-2xl ${styles.bg} border ${styles.border} p-4 space-y-3`}>
      {/* Day type badge + context */}
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles.badge}`}>
          {dayType.label}
        </span>
        {dayType.avoidList.length > 0 && (
          <span className="text-xs text-[var(--color-text-light)]">
            evita {dayType.avoidList.join(', ')}
          </span>
        )}
      </div>

      {/* Context sentence */}
      <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
        {dayType.contextSentence}
      </p>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-1.5">
          {suggestions.map((suggestion, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className={`mt-1 text-xs ${styles.text}`}>→</span>
              <p className="text-xs text-[var(--color-text-light)] leading-relaxed">
                {suggestion}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
