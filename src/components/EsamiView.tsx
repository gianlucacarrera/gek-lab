'use client';

import React, { useState, useRef, useEffect } from 'react';
import Accordion from '@/components/Accordion';
import {
  LAB_MARKERS,
  GENETIC_RESULTS,
  INFIAMMAZIONE_L3,
  ZUCCHERI_L3,
  DNA_L3,
  SUPPLEMENTS,
  PATIENT,
  MARKER_INTERPRETATIONS,
  CLINICAL_SUMMARY,
  GENE_INTERPRETATIONS,
  SUPPLEMENTS_NOTE,
  MEDICAL_DISCLAIMER,
  RETEST_RECOMMENDATIONS,
} from '@/data/constants';

/* ─── Term Definitions ─────────────────────────────────────────────── */
const TERM_DEFINITIONS: Record<string, string> = {
  PNPLA3: 'Gene che codifica un enzima del fegato coinvolto nel metabolismo dei grassi.',
  TCF7L2:
    "Gene associato alla regolazione dell'insulina e alla predisposizione al diabete di tipo 2.",
  FTO: "Gene associato alla regolazione dell'appetito e alla predisposizione al sovrappeso.",
  TNFSF13B: 'Gene che codifica per la proteina BAFF, coinvolta nella risposta immunitaria.',
  BAFF: 'B-Cell Activating Factor: citochina del sistema immunitario che regola le cellule B.',
  MASLD: 'Steatosi epatica metabolica: accumulo di grasso nel fegato legato a fattori metabolici.',
  MASH: 'Steatoepatite metabolica: forma più avanzata di MASLD con infiammazione epatica.',
  SNP: 'Polimorfismo a singolo nucleotide: una variazione in un singolo punto del DNA.',
  DNA: 'Acido desossiribonucleico: la molecola che contiene le informazioni genetiche.',
};

const TERM_REGEX = /(\b(?:PNPLA3|TCF7L2|FTO|TNFSF13B|BAFF|MASLD|MASH|SNP|DNA)\b)/g;

/* ─── TermWithTooltip ──────────────────────────────────────────────── */
function TermWithTooltip({ term }: { term: string }) {
  const [show, setShow] = useState(false);
  const definition = TERM_DEFINITIONS[term];
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!show) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setShow(false);
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [show]);

  return (
    <span ref={ref} className="relative inline">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setShow(!show);
        }}
        className="text-[var(--color-terracotta)] font-medium"
        style={{ textDecorationLine: 'underline', textDecorationStyle: 'dotted' }}
      >
        {term}
      </button>
      {show && definition && (
        <span className="absolute top-full left-0 mt-1 z-20 w-56 rounded-lg bg-white p-3 shadow-lg border border-[var(--color-cream-dark)] text-xs text-[var(--color-text-light)] leading-relaxed block">
          <span className="font-semibold text-[var(--color-text)] block mb-0.5">{term}</span>
          {definition}
        </span>
      )}
    </span>
  );
}

/** Render text content with TermWithTooltip for known medical terms */
function RichText({ text }: { text: string }) {
  return (
    <p className="leading-relaxed whitespace-pre-line">
      {text.split(TERM_REGEX).map((part, i) =>
        TERM_REGEX.test(part) ? <TermWithTooltip key={i} term={part} /> : part
      )}
    </p>
  );
}

/* ─── Expandable Section Wrapper ───────────────────────────────────── */
function ExpandableSection({
  expanded,
  children,
}: {
  expanded: boolean;
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [expanded, children]);

  return (
    <div
      className="overflow-hidden transition-[max-height,opacity] duration-300 ease-out"
      style={{
        maxHeight: expanded ? height : 0,
        opacity: expanded ? 1 : 0,
      }}
    >
      <div ref={contentRef}>{children}</div>
    </div>
  );
}

/* ─── BAFF Semicircular Gauge ──────────────────────────────────────── */
function BaffGauge() {
  const baff = LAB_MARKERS.BAFF;

  const cx = 140;
  const cy = 130;
  const r = 100;

  const arcPath = (from: number, to: number) => {
    const x1 = cx + r * Math.cos(Math.PI - from * Math.PI);
    const y1 = cy - r * Math.sin(Math.PI - from * Math.PI);
    const x2 = cx + r * Math.cos(Math.PI - to * Math.PI);
    const y2 = cy - r * Math.sin(Math.PI - to * Math.PI);
    const largeArc = to - from > 0.5 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const zones = [
    { from: 0, to: 0.33, color: 'var(--color-sage)', label: 'Tranquilla' },
    { from: 0.33, to: 0.66, color: 'var(--color-amber)', label: 'Attenzione leggera' },
    { from: 0.66, to: 1, color: 'var(--color-terracotta)', label: 'Attenzione alta' },
  ];

  // Marker at boundary between zone 1 and zone 2
  const markerPos = 0.33;
  const markerX = cx + r * Math.cos(Math.PI - markerPos * Math.PI);
  const markerY = cy - r * Math.sin(Math.PI - markerPos * Math.PI);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 280 160" className="w-full max-w-[280px]">
        {zones.map((zone) => (
          <path
            key={zone.label}
            d={arcPath(zone.from, zone.to)}
            fill="none"
            stroke={zone.color}
            strokeWidth="18"
            strokeLinecap="butt"
          />
        ))}
        <circle
          cx={markerX}
          cy={markerY}
          r="10"
          fill="white"
          stroke="var(--color-terracotta)"
          strokeWidth="3"
        />
        <circle cx={markerX} cy={markerY} r="4" fill="var(--color-terracotta)" />
      </svg>
      <div className="flex justify-between w-full max-w-[280px] -mt-2 px-1">
        {zones.map((zone) => (
          <span
            key={zone.label}
            className="text-[10px] text-[var(--color-text-light)] text-center flex-1"
          >
            {zone.label}
          </span>
        ))}
      </div>
      <p className="mt-2 text-sm text-[var(--color-text-light)]">
        BAFF:{' '}
        <span className="font-semibold text-[var(--color-text)]">
          {baff.value} {baff.unit}
        </span>
        <span className="text-[var(--color-text-lighter)]">
          {' '}
          (rif. {baff.refLow}&ndash;{baff.refHigh})
        </span>
      </p>
    </div>
  );
}

/* ─── Arc Gauge (240 degrees) for Albumina / MGO ───────────────────── */
function ArcGauge({
  value,
  unit,
  refHigh,
  label,
}: {
  value: number;
  unit: string;
  refHigh: number;
  label: string;
}) {
  const maxVal = refHigh * 1.3;
  const fraction = Math.min(value / maxVal, 1);
  const refFraction = refHigh / maxVal;
  const isAbove = value > refHigh;

  // 240-degree arc: from 150 degrees to -30 degrees (going clockwise)
  const totalAngle = 240;
  const startAngleDeg = 150;
  const cx = 120;
  const cy = 110;
  const r = 85;

  const degToRad = (d: number) => (d * Math.PI) / 180;

  const polarToCart = (angleDeg: number) => ({
    x: cx + r * Math.cos(degToRad(angleDeg)),
    y: cy - r * Math.sin(degToRad(angleDeg)),
  });

  const describeArc = (startDeg: number, endDeg: number) => {
    const s = polarToCart(startDeg);
    const e = polarToCart(endDeg);
    const sweep = startDeg - endDeg;
    const largeArc = sweep > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

  const bgStart = startAngleDeg;
  const bgEnd = startAngleDeg - totalAngle;
  const fillEnd = startAngleDeg - fraction * totalAngle;
  const refAngle = startAngleDeg - refFraction * totalAngle;

  // Tick mark at refHigh
  const tickInner = {
    x: cx + (r - 14) * Math.cos(degToRad(refAngle)),
    y: cy - (r - 14) * Math.sin(degToRad(refAngle)),
  };
  const tickOuter = {
    x: cx + (r + 14) * Math.cos(degToRad(refAngle)),
    y: cy - (r + 14) * Math.sin(degToRad(refAngle)),
  };

  const fillColor = isAbove ? 'var(--color-amber)' : 'var(--color-sage)';

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 240 180" className="w-full max-w-[240px]">
        {/* Background arc */}
        <path
          d={describeArc(bgStart, bgEnd)}
          fill="none"
          stroke="#e5ddd4"
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Fill arc */}
        <path
          d={describeArc(bgStart, fillEnd)}
          fill="none"
          stroke={fillColor}
          strokeWidth="16"
          strokeLinecap="round"
        />
        {/* Reference tick */}
        <line
          x1={tickInner.x}
          y1={tickInner.y}
          x2={tickOuter.x}
          y2={tickOuter.y}
          stroke="var(--color-text-lighter)"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Center value */}
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          className="text-2xl font-bold"
          fill="var(--color-text)"
          fontSize="28"
          fontWeight="700"
        >
          {value}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fill="var(--color-text-light)"
          fontSize="12"
        >
          {unit}
        </text>
      </svg>
      <p className="mt-1 text-xs text-[var(--color-text-lighter)]">
        {label} &mdash; rif. max {refHigh} {unit}
      </p>
    </div>
  );
}

/* ─── Status Badge ─────────────────────────────────────────────────── */
function StatusBadge({ status }: { status: string }) {
  const isNormal = status === 'normal';
  const isHigh = status === 'high';
  const label = isNormal
    ? 'nella norma'
    : status === 'mildly_elevated'
      ? 'leggermente elevato'
      : isHigh
        ? 'elevato'
        : 'elevato';
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isNormal
          ? 'bg-[var(--color-sage-light)] text-[var(--color-sage-dark)]'
          : isHigh
            ? 'bg-[var(--color-terracotta-bg)] text-[var(--color-terracotta)]'
            : 'bg-[var(--color-amber-light)] text-[var(--color-amber)]'
      }`}
    >
      {label}
    </span>
  );
}

/* ─── Chevron Icon ─────────────────────────────────────────────────── */
function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={`text-[var(--color-text-light)] transition-transform duration-300 ease-out ${
        expanded ? 'rotate-180' : ''
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
  );
}

/* ─── BAFF Section ─────────────────────────────────────────────────── */
function useAccordionToggle() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const toggle = (title: string) => setExpandedSection((prev) => (prev === title ? null : title));
  return { expandedSection, toggle };
}

function BaffSection() {
  const [depth, setDepth] = useState(0);
  const accordion = useAccordionToggle();
  const baff = LAB_MARKERS.BAFF;

  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Depth 0: Compact card */}
      <button
        onClick={() => setDepth(depth === 0 ? 1 : 0)}
        className="w-full flex items-center justify-between p-4 text-left transition-colors duration-200 hover:bg-[var(--color-cream-dark)]/30"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-[var(--color-text)]">{baff.name}</span>
            <StatusBadge status={baff.status} />
          </div>
          <p className="text-sm text-[var(--color-text-light)]">
            {baff.value} {baff.unit}
          </p>
        </div>
        <Chevron expanded={depth > 0} />
      </button>

      {/* Depth 1: Gauge + explanation + TNFSF13B callout */}
      <ExpandableSection expanded={depth >= 1}>
        <div className="px-4 pb-4 space-y-4">
          <div className="pt-2">
            <BaffGauge />
          </div>

          <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
            {MARKER_INTERPRETATIONS.BAFF.depth1Summary}
          </p>

          {/* TNFSF13B callout */}
          <div className="rounded-xl bg-[var(--color-sage-light)] border border-[var(--color-sage)] p-4">
            <p className="text-sm text-[var(--color-sage-dark)] leading-relaxed">
              {MARKER_INTERPRETATIONS.BAFF.tnfsf13bCallout}
            </p>
          </div>

          {/* CTA to Depth 2 */}
          {depth === 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDepth(2);
              }}
              className="w-full py-2.5 rounded-xl bg-[var(--color-terracotta)] text-white text-sm font-medium transition-colors duration-200 hover:opacity-90 active:opacity-80"
            >
              Approfondisci &rarr;
            </button>
          )}
        </div>
      </ExpandableSection>

      {/* Depth 2: Science accordion from INFIAMMAZIONE_L3 */}
      <ExpandableSection expanded={depth >= 2}>
        <div className="px-4 pb-4 space-y-4">
          <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
            {MARKER_INTERPRETATIONS.BAFF.scienceIntro}
          </p>
          <Accordion
            sections={INFIAMMAZIONE_L3.map((s) => ({
              title: s.title,
              content: (
                <div className="space-y-3">
                  {s.content.split('\n\n').map((p, i) => (
                    <RichText key={i} text={p} />
                  ))}
                </div>
              ),
            }))}
            expandedSection={accordion.expandedSection}
            onToggle={accordion.toggle}
          />
        </div>
      </ExpandableSection>
    </div>
  );
}

/* ─── Albumina Glicata Section ─────────────────────────────────────── */
function AlbuminaGlicataSection() {
  const [depth, setDepth] = useState(0);
  const accordion = useAccordionToggle();
  const marker = LAB_MARKERS.ALBUMINA_GLICATA;

  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Depth 0 */}
      <button
        onClick={() => setDepth(depth === 0 ? 1 : 0)}
        className="w-full flex items-center justify-between p-4 text-left transition-colors duration-200 hover:bg-[var(--color-cream-dark)]/30"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-[var(--color-text)]">{marker.name}</span>
            <StatusBadge status={marker.status} />
          </div>
          <p className="text-sm text-[var(--color-text-light)]">
            {marker.value}
            {marker.unit}
            <span className="text-[var(--color-text-lighter)]">
              {' '}
              (rif. max {marker.refHigh}%)
            </span>
          </p>
        </div>
        <Chevron expanded={depth > 0} />
      </button>

      {/* Depth 1 */}
      <ExpandableSection expanded={depth >= 1}>
        <div className="px-4 pb-4 space-y-4">
          <ArcGauge
            value={marker.value}
            unit={marker.unit}
            refHigh={marker.refHigh!}
            label={marker.name}
          />

          <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
            {MARKER_INTERPRETATIONS.ALBUMINA_GLICATA.depth1Summary}
          </p>

          {depth === 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDepth(2);
              }}
              className="w-full py-2.5 rounded-xl bg-[var(--color-terracotta)] text-white text-sm font-medium transition-colors duration-200 hover:opacity-90 active:opacity-80"
            >
              Approfondisci &rarr;
            </button>
          )}
        </div>
      </ExpandableSection>

      {/* Depth 2 */}
      <ExpandableSection expanded={depth >= 2}>
        <div className="px-4 pb-4 space-y-4">
          <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
            {MARKER_INTERPRETATIONS.ALBUMINA_GLICATA.scienceIntro}
          </p>
          <Accordion
            sections={ZUCCHERI_L3.filter((s) =>
              ['Cos\'è la glicazione e perché ci interessa', 'Albumina glicata vs. emoglobina glicata'].includes(s.title)
            ).map((s) => ({
              title: s.title,
              content: (
                <div className="space-y-3">
                  {s.content.split('\n\n').map((p, i) => (
                    <RichText key={i} text={p} />
                  ))}
                </div>
              ),
            }))}
            expandedSection={accordion.expandedSection}
            onToggle={accordion.toggle}
          />
        </div>
      </ExpandableSection>
    </div>
  );
}

/* ─── Metilgliossale Section ───────────────────────────────────────── */
function MetilgliossaleSection() {
  const [depth, setDepth] = useState(0);
  const accordion = useAccordionToggle();
  const marker = LAB_MARKERS.METILGLIOSSALE;

  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Depth 0 */}
      <button
        onClick={() => setDepth(depth === 0 ? 1 : 0)}
        className="w-full flex items-center justify-between p-4 text-left transition-colors duration-200 hover:bg-[var(--color-cream-dark)]/30"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-[var(--color-text)]">{marker.name}</span>
            <StatusBadge status={marker.status} />
          </div>
          <p className="text-sm text-[var(--color-text-light)]">
            {marker.value} {marker.unit}
          </p>
        </div>
        <Chevron expanded={depth > 0} />
      </button>

      {/* Depth 1 */}
      <ExpandableSection expanded={depth >= 1}>
        <div className="px-4 pb-4 space-y-4">
          <ArcGauge
            value={marker.value}
            unit={marker.unit}
            refHigh={marker.refHigh!}
            label={marker.name}
          />

          <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
            {MARKER_INTERPRETATIONS.METILGLIOSSALE.depth1Summary}
          </p>

          {depth === 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDepth(2);
              }}
              className="w-full py-2.5 rounded-xl bg-[var(--color-terracotta)] text-white text-sm font-medium transition-colors duration-200 hover:opacity-90 active:opacity-80"
            >
              Approfondisci &rarr;
            </button>
          )}
        </div>
      </ExpandableSection>

      {/* Depth 2 */}
      <ExpandableSection expanded={depth >= 2}>
        <div className="px-4 pb-4 space-y-4">
          <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
            {MARKER_INTERPRETATIONS.METILGLIOSSALE.scienceIntro}
          </p>
          <Accordion
            sections={ZUCCHERI_L3.filter((s) =>
              ['Il Metilgliossale', 'Fruttosio, alcol e dolcificanti: tutti contano', 'Consigli pratici per ridurre i picchi glicemici'].includes(s.title)
            ).map((s) => ({
              title: s.title,
              content: (
                <div className="space-y-3">
                  {s.content.split('\n\n').map((p, i) => (
                    <RichText key={i} text={p} />
                  ))}
                </div>
              ),
            }))}
            expandedSection={accordion.expandedSection}
            onToggle={accordion.toggle}
          />
        </div>
      </ExpandableSection>
    </div>
  );
}

/* ─── Gene Section ─────────────────────────────────────────────────── */
function GeneSection({
  gene,
}: {
  gene: (typeof GENETIC_RESULTS)[number];
}) {
  const [depth, setDepth] = useState(0);
  const accordion = useAccordionToggle();

  // Find relevant DNA_L3 sections for this gene
  const relevantL3 = DNA_L3.filter((s) => {
    const titleLower = s.title.toLowerCase();
    const geneLower = gene.gene.toLowerCase();
    if (geneLower === 'pnpla3') return titleLower.includes('pnpla3') || titleLower.includes('sensibilit');
    if (geneLower === 'tcf7l2') return titleLower.includes('tcf7l2') || titleLower.includes('diabete');
    if (geneLower === 'fto') return titleLower.includes('fto') || titleLower.includes('sovrappeso');
    if (geneLower === 'tnfsf13b') return titleLower.includes('tnfsf13b') || titleLower.includes('baff');
    return false;
  });

  // Include the general "polimorfismi" and "odds ratio" sections for all genes
  const generalL3 = DNA_L3.filter(
    (s) =>
      s.title.includes('polimorfismi') || s.title.includes('Odds ratio')
  );
  const allL3 = [...relevantL3, ...generalL3.filter((g) => !relevantL3.includes(g))];

  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Depth 0 */}
      <button
        onClick={() => setDepth(depth === 0 ? 1 : 0)}
        className="w-full flex items-center justify-between p-4 text-left transition-colors duration-200 hover:bg-[var(--color-cream-dark)]/30"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-[var(--color-text)]">{gene.gene}</span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                gene.isVariant
                  ? 'bg-[var(--color-amber-light)] text-[var(--color-amber)]'
                  : 'bg-[var(--color-sage-light)] text-[var(--color-sage-dark)]'
              }`}
            >
              {gene.isVariant ? 'variante' : 'normale'}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-lighter)]">{gene.plainLabel}</p>
        </div>
        <Chevron expanded={depth > 0} />
      </button>

      {/* Depth 1 */}
      <ExpandableSection expanded={depth >= 1}>
        <div className="px-4 pb-4 space-y-3">
          <p className="text-sm text-[var(--color-text-light)] leading-relaxed">{gene.meaning}</p>
          <p className="text-xs text-[var(--color-text-lighter)]">
            SNP: {gene.snp} &mdash; Risultato: {gene.result}
          </p>

          {GENE_INTERPRETATIONS[gene.gene]?.depth1Extra && (
            <div className="rounded-xl bg-[var(--color-amber-bg)] border border-[var(--color-amber-light)] p-3">
              <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
                {GENE_INTERPRETATIONS[gene.gene].depth1Extra}
              </p>
            </div>
          )}

          {depth === 1 && allL3.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDepth(2);
              }}
              className="w-full py-2.5 rounded-xl bg-[var(--color-terracotta)] text-white text-sm font-medium transition-colors duration-200 hover:opacity-90 active:opacity-80"
            >
              Approfondisci &rarr;
            </button>
          )}
        </div>
      </ExpandableSection>

      {/* Depth 2 */}
      <ExpandableSection expanded={depth >= 2}>
        <div className="px-4 pb-4 space-y-4">
          <Accordion
            sections={allL3.map((s) => ({
              title: s.title,
              content: (
                <div className="space-y-3">
                  {s.content.split('\n\n').map((p, i) => (
                    <RichText key={i} text={p} />
                  ))}
                </div>
              ),
            }))}
            expandedSection={accordion.expandedSection}
            onToggle={accordion.toggle}
          />
        </div>
      </ExpandableSection>
    </div>
  );
}

/* ─── Main Component ───────────────────────────────────────────────── */
export default function EsamiView({ userName }: { userName?: string }) {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] pb-24">
      {/* Header */}
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">I tuoi esami</h1>
        <p className="mt-1 text-sm text-[var(--color-text-light)]">
          Ciao {userName || PATIENT.firstName}, ecco il quadro completo dei tuoi risultati del{' '}
          {PATIENT.reportDateFormatted}.
        </p>
      </div>

      {/* Narrative Summary */}
      <div className="px-4 pt-3 pb-1">
        <div className="rounded-2xl bg-white p-5 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">{CLINICAL_SUMMARY.title}</h2>
          {CLINICAL_SUMMARY.paragraphs.map((paragraph, i) => (
            <p key={i} className="text-sm text-[var(--color-text-light)] leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {/* Lab Markers */}
      <div className="px-4 pt-4 space-y-3">
        <BaffSection />
        <AlbuminaGlicataSection />
        <MetilgliossaleSection />
      </div>

      {/* Divider + Genetic Profile Header */}
      <div className="px-4 pt-8 pb-2">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--color-cream-dark)]" />
          <h2 className="text-base font-semibold text-[var(--color-text)]">Profilo Genetico</h2>
          <div className="flex-1 h-px bg-[var(--color-cream-dark)]" />
        </div>
        <p className="mt-2 text-xs text-[var(--color-text-lighter)] text-center">
          4 geni analizzati per personalizzare il tuo percorso
        </p>
      </div>

      {/* Gene Cards */}
      <div className="px-4 pt-2 space-y-3">
        {GENETIC_RESULTS.map((gene) => (
          <GeneSection key={gene.gene} gene={gene} />
        ))}
      </div>

      {/* Supplements Section */}
      <div className="px-4 pt-8 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--color-cream-dark)]" />
          <h2 className="text-base font-semibold text-[var(--color-text)]">Integratori utili</h2>
          <div className="flex-1 h-px bg-[var(--color-cream-dark)]" />
        </div>

        {SUPPLEMENTS.map((supp) => (
          <div key={supp.name} className="rounded-2xl bg-white p-4 shadow-sm">
            <p className="text-sm font-semibold text-[var(--color-text)]">{supp.name}</p>
            <p className="mt-1 text-sm text-[var(--color-text-light)] leading-relaxed">
              {supp.benefit}
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-lighter)]">{supp.dosage}</p>
          </div>
        ))}

        <div className="rounded-xl bg-[var(--color-terracotta-bg)] p-3 border border-[var(--color-terracotta-light)]">
          <p className="text-xs text-[var(--color-terracotta)] font-medium text-center">
            {SUPPLEMENTS_NOTE}
          </p>
        </div>
      </div>

      {/* Retest Recommendations */}
      <div className="px-4 pt-6 space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-[var(--color-cream-dark)]" />
          <h2 className="text-base font-semibold text-[var(--color-text)]">Prossimi controlli</h2>
          <div className="flex-1 h-px bg-[var(--color-cream-dark)]" />
        </div>
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <p className="text-sm text-[var(--color-text-light)] leading-relaxed">
            {RETEST_RECOMMENDATIONS.intermediate.description}
          </p>
          <p className="mt-2 text-xs text-[var(--color-text-lighter)]">
            Marcatori: {RETEST_RECOMMENDATIONS.intermediate.markers.join(', ')} — Tempistica: {RETEST_RECOMMENDATIONS.intermediate.timeframe}
          </p>
        </div>
      </div>

      {/* Medical Disclaimer */}
      <div className="px-4 pt-6 pb-4">
        <p className="text-xs text-[var(--color-text-lighter)] leading-relaxed text-center">
          {MEDICAL_DISCLAIMER}
        </p>
      </div>
    </div>
  );
}
