'use client';

interface ScoreResultProps {
  score: number;
  aiComment: string;
  onDone: () => void;
}

function getScoreColor(score: number): string {
  if (score >= 4) return 'var(--color-sage)';
  if (score >= 2.5) return 'var(--color-amber)';
  return 'var(--color-terracotta)';
}

function StarIcon({ fill }: { fill: 'full' | 'half' | 'empty' }) {
  const color = 'currentColor';

  if (fill === 'empty') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
      </svg>
    );
  }

  if (fill === 'half') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24">
        <defs>
          <clipPath id="halfClip">
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
        </defs>
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
        />
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"
          fill={color}
          clipPath="url(#halfClip)"
        />
      </svg>
    );
  }

  // full
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="1.5">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
    </svg>
  );
}

function StarDisplay({ score }: { score: number }) {
  const stars: ('full' | 'half' | 'empty')[] = [];

  for (let i = 1; i <= 5; i++) {
    if (score >= i) {
      stars.push('full');
    } else if (score >= i - 0.5) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }

  return (
    <div className="flex items-center gap-1" style={{ color: getScoreColor(score) }}>
      {stars.map((fill, idx) => (
        <StarIcon key={idx} fill={fill} />
      ))}
    </div>
  );
}

export default function ScoreResult({ score, aiComment, onDone }: ScoreResultProps) {
  return (
    <div className="px-4 py-8 flex flex-col items-center text-center space-y-6">
      {/* Star display */}
      <StarDisplay score={score} />

      {/* Score label */}
      <p className="text-lg font-bold text-[var(--color-text)]">
        {score} / 5
      </p>

      {/* AI comment */}
      <p className="text-sm text-[var(--color-text-light)] leading-relaxed max-w-sm">
        {aiComment}
      </p>

      {/* Close button */}
      <button
        onClick={onDone}
        className="text-sm font-medium text-[var(--color-text-lighter)] hover:text-[var(--color-text-light)] transition-colors duration-200 mt-2"
      >
        Chiudi
      </button>
    </div>
  );
}
