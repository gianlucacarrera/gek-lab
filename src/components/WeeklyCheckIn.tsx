'use client';

import React, { useState, useEffect } from 'react';
import type { CheckInResponse } from '@/types/app';
import { getCheckIns, saveCheckIn } from '@/lib/storage';

interface WeeklyCheckInProps {
  onClose: () => void;
}

const QUESTIONS = [
  { key: 'energy' as const, text: "Come ti è sembrata l'energia questa settimana?" },
  { key: 'digestion' as const, text: "Com'è stata la digestione?" },
  { key: 'adherence' as const, text: 'Hai seguito la rotazione più spesso del solito?' },
];

const EMOJI_SCALE = [
  { value: 1, emoji: '😔', label: 'Per niente' },
  { value: 2, emoji: '😕', label: 'Poco' },
  { value: 3, emoji: '😐', label: 'Così così' },
  { value: 4, emoji: '🙂', label: 'Abbastanza' },
  { value: 5, emoji: '😊', label: 'Molto' },
];

function getWeekKey(): string {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((dayOfWeek + 6) % 7));
  return monday.toISOString().split('T')[0];
}

function getEncouragement(energy: number, digestion: number, adherence: number): string {
  const avg = (energy + digestion + adherence) / 3;
  if (avg >= 4)
    return 'Ottimo lavoro! Il tuo corpo sta rispondendo bene alle tue scelte. Continua così!';
  if (avg >= 3)
    return 'Stai andando nella direzione giusta. Ogni piccolo passo conta, e i risultati arriveranno.';
  if (avg >= 2)
    return 'Settimana un po\' faticosa? È normale. L\'importante è riprendere con calma, senza fretta.';
  return 'Ogni settimana è un nuovo inizio. Concentrati su una piccola cosa alla volta — il tuo corpo lo apprezzerà.';
}

/* ─── Sparkline ────────────────────────────────────────────────────── */
function Sparkline({ checkIns }: { checkIns: CheckInResponse[] }) {
  if (checkIns.length < 2) return null;

  const recent = checkIns.slice(-6);
  const values = recent.map(
    (c) => (c.energy + c.digestion + c.adherence) / 3
  );
  const max = 5;
  const min = 1;
  const width = 160;
  const height = 40;
  const padding = 4;

  const points = values.map((v, i) => {
    const x = padding + (i / (values.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((v - min) / (max - min)) * (height - 2 * padding);
    return `${x},${y}`;
  });

  return (
    <div className="flex flex-col items-center mt-3">
      <p className="text-[10px] text-[var(--color-text-lighter)] mb-1">Il tuo andamento</p>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <polyline
          points={points.join(' ')}
          fill="none"
          stroke="var(--color-sage)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.map((pt, i) => {
          const [x, y] = pt.split(',').map(Number);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill={i === points.length - 1 ? 'var(--color-terracotta)' : 'var(--color-sage)'}
            />
          );
        })}
      </svg>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────── */
export default function WeeklyCheckIn({ onClose }: WeeklyCheckInProps) {
  const [step, setStep] = useState(0); // 0-2 = questions, 3 = result
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [checkIns, setCheckIns] = useState<CheckInResponse[]>([]);

  useEffect(() => {
    setCheckIns(getCheckIns());
  }, []);

  const handleAnswer = (key: string, value: number) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);

    if (step < 2) {
      // Auto-advance to next question
      setTimeout(() => setStep(step + 1), 300);
    } else {
      // All answered — save and show result
      const response: CheckInResponse = {
        week: getWeekKey(),
        energy: updated.energy ?? 3,
        digestion: updated.digestion ?? 3,
        adherence: updated.adherence ?? 3,
      };
      saveCheckIn(response);
      setCheckIns([...checkIns, response]);
      setTimeout(() => setStep(3), 300);
    }
  };

  const currentQuestion = QUESTIONS[step];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 animate-[scaleIn_0.3s_ease-out]">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[var(--color-cream-dark)] flex items-center justify-center text-[var(--color-text-lighter)] hover:text-[var(--color-text)]"
          aria-label="Chiudi"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {step < 3 ? (
          <>
            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-6">
              {QUESTIONS.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    i <= step ? 'bg-[var(--color-terracotta)]' : 'bg-[var(--color-cream-dark)]'
                  }`}
                />
              ))}
            </div>

            {/* Question */}
            <h3 className="text-base font-semibold text-[var(--color-text)] text-center mb-6">
              {currentQuestion.text}
            </h3>

            {/* Emoji scale */}
            <div className="flex justify-center gap-3">
              {EMOJI_SCALE.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleAnswer(currentQuestion.key, option.value)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 min-w-[48px] ${
                    answers[currentQuestion.key] === option.value
                      ? 'bg-[var(--color-terracotta-bg)] scale-110'
                      : 'hover:bg-[var(--color-cream)] hover:scale-105'
                  }`}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span className="text-[9px] text-[var(--color-text-lighter)]">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          /* Result */
          <div className="text-center space-y-4 pt-2">
            <span className="text-4xl">✨</span>
            <h3 className="text-base font-semibold text-[var(--color-text)]">
              Grazie per il check-in!
            </h3>
            <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
              {getEncouragement(
                answers.energy ?? 3,
                answers.digestion ?? 3,
                answers.adherence ?? 3
              )}
            </p>

            <Sparkline checkIns={checkIns} />

            <button onClick={onClose} className="btn-primary w-full justify-center mt-4">
              Chiudi
            </button>
          </div>
        )}
      </div>
    </>
  );
}
