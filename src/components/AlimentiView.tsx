'use client';

import { useState, useMemo } from 'react';
import {
  ACTIVE_FOOD_GROUPS,
  ALWAYS_ALLOWED_FOODS,
  RESTRICTED_FOODS,
  MENU_IDEAS,
  GROUP_ARTICLES,
  NON_REACTIVE_FOOD_GROUPS,
  IGE_DISCLAIMER,
  MEDICAL_DISCLAIMER,
  getMealType,
  getRotationPhase,
} from '@/data/constants';
import type { MealType } from '@/types/app';

export default function AlimentiView() {
  const [search, setSearch] = useState('');
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [expandedMenu, setExpandedMenu] = useState<number | null>(null);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const today = new Date();
  const mealType: MealType = getMealType(today);
  const phase = getRotationPhase(today);
  const phaseLabel =
    phase === 1 ? 'Fase 1' : phase === 2 ? 'Fase 2' : 'Mantenimento';

  // Calendar
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
  const monthName = today.toLocaleDateString('it-IT', {
    month: 'long',
    year: 'numeric',
  });

  const mealTypeForDay = (day: number): MealType =>
    getMealType(new Date(year, month, day));

  // Always-allowed foods grouped by category
  const groupedAllowed = useMemo(() => {
    const q = search.toLowerCase();
    const filtered = q
      ? ALWAYS_ALLOWED_FOODS.filter((f) => f.name.toLowerCase().includes(q))
      : ALWAYS_ALLOWED_FOODS;
    const grouped: Record<string, typeof filtered> = {};
    filtered.forEach((f) => {
      if (!grouped[f.category]) grouped[f.category] = [];
      grouped[f.category].push(f);
    });
    Object.values(grouped).forEach((arr) =>
      arr.sort((a, b) => a.name.localeCompare(b.name))
    );
    return grouped;
  }, [search]);

  // Restricted foods grouped by category
  const groupedRestricted = useMemo(() => {
    const grouped: Record<string, typeof RESTRICTED_FOODS> = {};
    RESTRICTED_FOODS.forEach((f) => {
      if (!grouped[f.category]) grouped[f.category] = [];
      grouped[f.category].push(f);
    });
    return grouped;
  }, []);

  // Menu ideas by meal type
  const breakfastIdeas = MENU_IDEAS.filter((m) => m.mealType === 'BREAKFAST');
  const lunchIdeas = MENU_IDEAS.filter((m) => m.mealType === 'LUNCH');
  const dinnerIdeas = MENU_IDEAS.filter((m) => m.mealType === 'DINNER');

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pb-12">
      <div className="mx-auto max-w-lg px-4 pt-6">
        {/* ── 1. Page Title ─────────────────────────────────────────── */}
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          I tuoi alimenti
        </h1>

        {/* ── 2. Today's Rotation Status Banner ─────────────────────── */}
        <div className="mt-5">
          {mealType === 'controlled' && (
            <div className="rounded-xl bg-[var(--color-sage-light)] p-4">
              <p className="text-base font-semibold text-[var(--color-sage-dark)]">
                🍽️ Oggi: pasto controllato
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-light)]">
                Segui la lista degli alimenti consentiti
              </p>
            </div>
          )}
          {mealType === 'partial' && (
            <div className="rounded-xl bg-[var(--color-sage-light)] p-4">
              <p className="text-base font-semibold text-[var(--color-sage-dark)]">
                🍽️ Oggi: controllato tranne a cena
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-light)]">
                Colazione e pranzo controllati, la cena è libera
              </p>
            </div>
          )}
          {mealType === 'free' && (
            <div className="rounded-xl bg-[var(--color-amber-light)] p-4">
              <p className="text-base font-semibold text-[var(--color-text)]">
                🎉 Oggi: pasto libero
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-light)]">
                Puoi reintrodurre i tuoi soliti alimenti
              </p>
            </div>
          )}
        </div>

        {/* ── 3. Rotation Calendar ──────────────────────────────────── */}
        <div className="mt-5 rounded-xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold capitalize text-[var(--color-text)]">
              {monthName}
            </p>
            <span className="rounded-full bg-[var(--color-cream-dark)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--color-text-light)]">
              {phaseLabel}
            </span>
          </div>

          {/* Day headers */}
          <div className="mb-1 grid grid-cols-7 gap-1">
            {['L', 'M', 'M', 'G', 'V', 'S', 'D'].map((d, i) => (
              <div
                key={i}
                className="text-center text-[10px] font-medium text-[var(--color-text-lighter)]"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startOffset }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const mt = mealTypeForDay(day);
              const isToday = day === today.getDate();
              const isSelected = selectedDay === day;
              const partialStyle = mt === 'partial'
                ? { background: 'linear-gradient(135deg, var(--color-cream-dark) 50%, var(--color-sage-light) 50%)' }
                : undefined;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  style={partialStyle}
                  className={`relative flex aspect-square items-center justify-center rounded-lg text-xs font-medium transition-colors duration-150 ${
                    mt === 'controlled'
                      ? 'bg-[var(--color-cream-dark)] text-[var(--color-text)]'
                      : mt === 'partial'
                        ? 'text-[var(--color-text)]'
                        : 'bg-[var(--color-sage-light)] text-[var(--color-sage-dark)]'
                  } ${isToday ? 'ring-2 ring-[var(--color-terracotta)]' : ''}`}
                >
                  {day}
                  {isSelected && (
                    <span className="absolute -bottom-5 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-[var(--color-text)] px-1.5 py-0.5 text-[9px] text-white">
                      {mt === 'controlled'
                        ? 'Controllato'
                        : mt === 'partial'
                          ? 'Cena libera'
                          : 'Libero'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-[var(--color-cream-dark)]" />
              <span className="text-[10px] text-[var(--color-text-light)]">
                Controllato
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-[var(--color-sage-light)]" />
              <span className="text-[10px] text-[var(--color-text-light)]">
                Libero
              </span>
            </div>
            {phase === 1 && (
              <div className="flex items-center gap-1.5">
                <span
                  className="h-3 w-3 rounded"
                  style={{ background: 'linear-gradient(135deg, var(--color-cream-dark) 50%, var(--color-sage-light) 50%)' }}
                />
                <span className="text-[10px] text-[var(--color-text-light)]">
                  Cena libera
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── 4. Food Groups in Rotation ────────────────────────────── */}
        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            Gruppi alimentari in rotazione
          </h2>

          {ACTIVE_FOOD_GROUPS.map((group) => {
            const article = GROUP_ARTICLES[group.id as keyof typeof GROUP_ARTICLES];
            const isExpanded = expandedGroup === group.id;
            return (
              <div key={group.id} className="rounded-xl bg-white p-4 shadow-sm">
                {/* Group header */}
                <h3 className="text-base font-semibold text-[var(--color-text)]">
                  {group.icon} {group.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-light)]">
                  {group.description}
                </p>

                {/* Foods in group */}
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-lighter)]">
                    Alimenti nel gruppo
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {group.foods.map((food) => (
                      <span
                        key={food}
                        className="rounded-full bg-[var(--color-terracotta-bg)] px-2.5 py-1 text-xs text-[var(--color-terracotta)]"
                      >
                        {food}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Substitutes */}
                <div className="mt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-lighter)]">
                    Sostituisci con
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {group.substitutes.map((sub) => (
                      <span
                        key={sub}
                        className="rounded-full bg-[var(--color-sage-light)] px-2.5 py-1 text-xs text-[var(--color-sage-dark)]"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Expandable GROUP_ARTICLES detail */}
                {article && (
                  <div className="mt-4">
                    <button
                      onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                      className="text-xs font-medium text-[var(--color-terracotta)] underline underline-offset-2"
                    >
                      {isExpanded ? 'Nascondi dettagli' : 'Approfondisci'}
                    </button>
                    {isExpanded && (
                      <div className="mt-3 space-y-3 border-t border-[var(--color-cream-dark)] pt-3">
                        {article.sections.map((section) => (
                          <div key={section.title}>
                            <p className="text-xs font-semibold text-[var(--color-text)]">
                              {section.title}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-[var(--color-text-light)]">
                              {section.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Non-reactive food groups */}
          {NON_REACTIVE_FOOD_GROUPS.length > 0 && (
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <h3 className="text-base font-semibold text-[var(--color-text)]">
                Gruppi non reattivi
              </h3>
              <p className="mt-2 text-sm text-[var(--color-text-light)]">
                I seguenti gruppi alimentari non hanno mostrato reattivit&agrave; e possono essere consumati liberamente.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {NON_REACTIVE_FOOD_GROUPS.map((g) => (
                  <span
                    key={g.name}
                    className="rounded-full bg-[var(--color-sage-light)] px-3 py-1.5 text-xs font-medium text-[var(--color-sage-dark)]"
                  >
                    {g.icon} {g.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* IgE Disclaimer */}
          <div className="rounded-xl bg-[var(--color-cream-dark)] p-4">
            <p className="text-xs leading-relaxed text-[var(--color-text-light)]">
              {IGE_DISCLAIMER}
            </p>
          </div>
        </div>

        {/* ── 5. Sempre consentiti ──────────────────────────────────── */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            Sempre consentiti
          </h2>

          {/* Search bar */}
          <div className="relative mt-3">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-lighter)]"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle
                cx="7"
                cy="7"
                r="5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M11 11L14 14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cerca un alimento..."
              className="w-full rounded-xl border border-[var(--color-cream-dark)] bg-white py-2.5 pl-9 pr-4 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-lighter)] focus:outline-none focus:ring-2 focus:ring-[var(--color-terracotta-light)]"
            />
          </div>

          {/* Grouped allowed foods */}
          <div className="mt-3 space-y-4">
            {Object.entries(groupedAllowed).map(([category, foods]) => (
              <div key={category}>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-lighter)]">
                  {category}
                </p>
                <div className="divide-y divide-[var(--color-cream-dark)] rounded-xl bg-white">
                  {foods.map((food) => (
                    <div
                      key={food.name}
                      className="px-3 py-2 text-sm text-[var(--color-text)]"
                    >
                      {food.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {Object.keys(groupedAllowed).length === 0 && (
              <p className="py-8 text-center text-sm text-[var(--color-text-lighter)]">
                Nessun risultato per &ldquo;{search}&rdquo;
              </p>
            )}
          </div>
        </div>

        {/* ── 6. Da evitare nei pasti controllati ───────────────────── */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            Da evitare nei pasti controllati
          </h2>

          <div className="mt-3 space-y-4">
            {Object.entries(groupedRestricted).map(([category, foods]) => (
              <div key={category}>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-lighter)]">
                  {category}
                </p>
                <div className="divide-y divide-[var(--color-cream-dark)] rounded-xl bg-white">
                  {foods.map((food) => (
                    <div
                      key={food.name}
                      className="px-3 py-2 text-sm text-[var(--color-text)]"
                    >
                      {food.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 7. Idee per i pasti ───────────────────────────────────── */}
        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold text-[var(--color-text)]">
            Idee per i pasti
          </h2>

          {[
            { label: 'Colazione', ideas: breakfastIdeas },
            { label: 'Pranzo', ideas: lunchIdeas },
            { label: 'Cena', ideas: dinnerIdeas },
          ].map(({ label, ideas }) => (
            <div key={label}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-lighter)]">
                {label}
              </p>
              <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-hide">
                {ideas.map((idea, idx) => {
                  const globalIdx = MENU_IDEAS.indexOf(idea);
                  const isExpanded = expandedMenu === globalIdx;
                  return (
                    <button
                      key={idx}
                      onClick={() =>
                        setExpandedMenu(isExpanded ? null : globalIdx)
                      }
                      className="min-w-[220px] flex-shrink-0 rounded-xl bg-white p-3 text-left shadow-sm transition-shadow duration-200 hover:shadow-md"
                    >
                      <p className="text-sm leading-snug text-[var(--color-text)]">
                        {idea.shortDescription}
                      </p>
                      {isExpanded && (
                        <p className="mt-2 text-xs leading-relaxed text-[var(--color-text-light)]">
                          {idea.fullDescription}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── 8. Medical Disclaimer ───────────────────────────────────── */}
        <div className="mt-8 border-t border-[var(--color-cream-dark)] pt-4 pb-4">
          <p className="text-[10px] leading-relaxed text-[var(--color-text-lighter)]">
            {MEDICAL_DISCLAIMER}
          </p>
        </div>
      </div>
    </div>
  );
}
