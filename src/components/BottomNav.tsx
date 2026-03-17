'use client';

import type { Tab } from '@/types/app';

const NAV_ITEMS: { tab: Tab; label: string; icon: string }[] = [
  { tab: 'esami', label: 'Esami', icon: '🔬' },
  { tab: 'alimenti', label: 'Alimenti', icon: '🥗' },
  { tab: 'alimentazione', label: 'Alimentazione', icon: '🍽️' },
];

interface BottomNavProps {
  activeTab: Tab;
  onNavigate: (tab: Tab) => void;
}

export default function BottomNav({ activeTab, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[var(--color-cream-dark)] pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-stretch justify-around max-w-lg mx-auto">
        {NAV_ITEMS.map(({ tab, label, icon }) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onNavigate(tab)}
              className={`flex flex-col items-center gap-0.5 py-2.5 px-1 flex-1 transition-colors duration-200 ${
                isActive
                  ? 'text-[var(--color-terracotta)]'
                  : 'text-[var(--color-text-lighter)]'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={label}
            >
              <span className="text-lg leading-none">{icon}</span>
              <span
                className={`text-[10px] leading-tight truncate ${
                  isActive ? 'font-semibold' : 'font-medium'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
