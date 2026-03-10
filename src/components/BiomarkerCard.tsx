"use client";

import { BiomarkerWithStatus } from "@/types";
import { STATUS_COLORS } from "@/lib/biomarkers";

export default function BiomarkerCard({ biomarker }: { biomarker: BiomarkerWithStatus }) {
  const { range, status, value, name, unit } = biomarker;
  const colors = STATUS_COLORS[status];

  // Calculate position on the range bar (0-100%)
  const totalRange = range.high - range.low;
  const clampedValue = Math.max(range.low, Math.min(value, range.high));
  const position = totalRange > 0 ? ((clampedValue - range.low) / totalRange) * 100 : 50;

  const optimalStart = ((range.optimalLow - range.low) / totalRange) * 100;
  const optimalWidth = ((range.optimalHigh - range.optimalLow) / totalRange) * 100;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold text-sm text-gray-900">{name}</h3>
          <p className="text-xs text-gray-500">{range.description}</p>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
          {status.toUpperCase()}
        </span>
      </div>

      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-sm text-gray-500">{unit}</span>
      </div>

      {/* Range bar */}
      <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden mb-1">
        {/* Low zone */}
        <div
          className="absolute top-0 h-full bg-blue-200"
          style={{ left: 0, width: `${optimalStart}%` }}
        />
        {/* Optimal zone */}
        <div
          className="absolute top-0 h-full bg-green-200"
          style={{ left: `${optimalStart}%`, width: `${optimalWidth}%` }}
        />
        {/* High zone */}
        <div
          className="absolute top-0 h-full bg-red-200"
          style={{ left: `${optimalStart + optimalWidth}%`, width: `${100 - optimalStart - optimalWidth}%` }}
        />
        {/* Value indicator */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow ${colors.bar}`}
          style={{ left: `${position}%`, transform: `translate(-50%, -50%)` }}
        />
      </div>

      <div className="flex justify-between text-[10px] text-gray-400">
        <span>{range.low}</span>
        <span className="text-green-600">{range.optimalLow} - {range.optimalHigh}</span>
        <span>{range.high}</span>
      </div>
    </div>
  );
}
