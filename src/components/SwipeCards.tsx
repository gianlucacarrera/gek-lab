'use client';

import React, { useState, useRef, useCallback } from 'react';

interface SwipeCardsProps {
  cards: React.ReactNode[];
}

export default function SwipeCards({ cards }: SwipeCardsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const isDragging = useRef(false);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < cards.length) {
        setActiveIndex(index);
      }
    },
    [cards.length]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    const threshold = 50;
    if (touchDeltaX.current < -threshold) {
      goTo(activeIndex + 1);
    } else if (touchDeltaX.current > threshold) {
      goTo(activeIndex - 1);
    }
    touchDeltaX.current = 0;
  };

  if (cards.length === 0) return null;

  return (
    <div className="relative">
      {/* Cards viewport */}
      <div
        className="overflow-hidden rounded-xl"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {cards.map((card, i) => (
            <div key={i} className="w-full flex-shrink-0 px-1">
              {card}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop arrows */}
      {activeIndex > 0 && (
        <button
          onClick={() => goTo(activeIndex - 1)}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 items-center justify-center rounded-full bg-white shadow-md text-[var(--color-text-light)] hover:text-[var(--color-text)] transition-colors duration-200"
          aria-label="Precedente"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
      {activeIndex < cards.length - 1 && (
        <button
          onClick={() => goTo(activeIndex + 1)}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-8 h-8 items-center justify-center rounded-full bg-white shadow-md text-[var(--color-text-light)] hover:text-[var(--color-text)] transition-colors duration-200"
          aria-label="Successivo"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}

      {/* Dot indicators */}
      {cards.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'bg-[var(--color-terracotta)] w-4'
                  : 'bg-[var(--color-text-lighter)]'
              }`}
              aria-label={`Vai alla scheda ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
