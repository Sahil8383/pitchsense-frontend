'use client';

import { getScoreLabel, getScoreVariant } from '@/lib/utils';

export interface ScoreOverviewProps {
  overallScore: number;
  variant?: 'default' | 'compact';
}

const GAUGE_DEFAULT = { size: 140, stroke: 10 };
const GAUGE_COMPACT = { size: 130, stroke: 10 };

function getGaugeConstants(variant: 'default' | 'compact') {
  const { size, stroke } =
    variant === 'compact' ? GAUGE_COMPACT : GAUGE_DEFAULT;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  return { size, stroke, radius, circumference };
}

export function ScoreOverview({
  overallScore,
  variant = 'default',
}: ScoreOverviewProps) {
  const label = getScoreLabel(overallScore);
  const variantStyle = getScoreVariant(overallScore);
  const clamped = Math.min(100, Math.max(0, overallScore));
  const { size: gaugeSize, stroke, circumference } = getGaugeConstants(variant);
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  const colorClass =
    variantStyle === 'success'
      ? 'text-success'
      : variantStyle === 'warning'
        ? 'text-warning'
        : 'text-destructive';

  const strokeColor =
    variantStyle === 'success'
      ? 'var(--success)'
      : variantStyle === 'warning'
        ? 'var(--warning)'
        : 'var(--destructive)';

  const isCompact = variant === 'compact';

  if (isCompact) {
    return (
      <div className="rounded-lg p-4">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Overall score
        </h2>
        <div className="mt-2 flex items-center gap-4">
          <div
            className="relative shrink-0"
            style={{ width: gaugeSize, height: gaugeSize }}
            aria-hidden
          >
            <svg
              width={gaugeSize}
              height={gaugeSize}
              className="-rotate-90"
              aria-hidden
            >
              <circle
                cx={gaugeSize / 2}
                cy={gaugeSize / 2}
                r={(gaugeSize - stroke) / 2}
                fill="none"
                stroke="currentColor"
                strokeWidth={stroke}
                className="text-muted/30"
              />
              <circle
                cx={gaugeSize / 2}
                cy={gaugeSize / 2}
                r={(gaugeSize - stroke) / 2}
                fill="none"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-700 ease-out"
                style={{ stroke: strokeColor }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-row items-center justify-center">
              <span
                className={`text-4xl font-bold tabular-nums leading-none ${colorClass}`}
              >
                {Math.round(overallScore)}
              </span>
              <span className="mt-2 text-sm text-muted-foreground">/ 100</span>
            </div>
          </div>
          <span className={`text-sm font-medium ${colorClass}`}>{label}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg p-6 md:p-8">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Overall score
      </h2>
      <div className="mt-4 flex flex-wrap items-center gap-8 md:gap-10">
        <div
          className="relative shrink-0"
          style={{ width: gaugeSize, height: gaugeSize }}
          aria-hidden
        >
          <svg
            width={gaugeSize}
            height={gaugeSize}
            className="-rotate-90"
            aria-hidden
          >
            <circle
              cx={gaugeSize / 2}
              cy={gaugeSize / 2}
              r={(gaugeSize - stroke) / 2}
              fill="none"
              stroke="currentColor"
              strokeWidth={stroke}
              className="text-muted/30"
            />
            <circle
              cx={gaugeSize / 2}
              cy={gaugeSize / 2}
              r={(gaugeSize - stroke) / 2}
              fill="none"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700 ease-out"
              style={{ stroke: strokeColor }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={`text-3xl font-bold tabular-nums md:text-4xl ${colorClass}`}
            >
              {Math.round(overallScore)}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-2">
            <span className="text-lg text-muted-foreground">/ 100</span>
            <span className={`text-lg font-medium ${colorClass}`}>{label}</span>
          </div>
          <div className="mt-2 h-2 w-48 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                variantStyle === 'success'
                  ? 'bg-success'
                  : variantStyle === 'warning'
                    ? 'bg-warning'
                    : 'bg-destructive'
              }`}
              style={{ width: `${clamped}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
