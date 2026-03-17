'use client';

import React, { useRef, useEffect, useState } from 'react';

interface AccordionSection {
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  sections: AccordionSection[];
  expandedSection: string | null;
  onToggle: (title: string) => void;
}

function AccordionItem({
  section,
  isExpanded,
  onToggle,
}: {
  section: AccordionSection;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded, section.content]);

  return (
    <div className="border-b border-[var(--color-cream-dark)]">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left transition-colors duration-200 hover:bg-[var(--color-cream-dark)]/50"
        aria-expanded={isExpanded}
      >
        <span className="text-sm font-medium text-[var(--color-text)]">
          {section.title}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`text-[var(--color-text-light)] transition-transform duration-300 ease-out ${
            isExpanded ? 'rotate-180' : ''
          }`}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
        style={{
          maxHeight: isExpanded ? height : 0,
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="px-4 pb-4 text-sm text-[var(--color-text-light)]">
          {section.content}
        </div>
      </div>
    </div>
  );
}

export default function Accordion({ sections, expandedSection, onToggle }: AccordionProps) {
  return (
    <div className="rounded-xl bg-white overflow-hidden">
      {sections.map((section) => (
        <AccordionItem
          key={section.title}
          section={section}
          isExpanded={expandedSection === section.title}
          onToggle={() => onToggle(section.title)}
        />
      ))}
    </div>
  );
}
