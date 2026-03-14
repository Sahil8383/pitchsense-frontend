'use client';

export interface ScoreOverviewProps {
  overallScore: number;
}

function getScoreLabel(score: number): string {
  if (score < 60) return 'Needs work';
  if (score < 80) return 'Good';
  return 'Excellent';
}

function getScoreVariant(score: number): 'destructive' | 'warning' | 'success' {
  if (score < 60) return 'destructive';
  if (score < 80) return 'warning';
  return 'success';
}

export function ScoreOverview({ overallScore }: ScoreOverviewProps) {
  const label = getScoreLabel(overallScore);
  const variant = getScoreVariant(overallScore);

  const colorClass =
    variant === 'success'
      ? 'text-success'
      : variant === 'warning'
        ? 'text-warning'
        : 'text-destructive';

  return (
    <div className="rounded-lg border border-border bg-card p-6 md:p-8">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
        Overall score
      </h2>
      <div className="mt-2 flex flex-wrap items-baseline gap-3">
        <span
          className={`text-4xl font-bold tabular-nums md:text-5xl ${colorClass}`}
        >
          {Math.round(overallScore)}
        </span>
        <span className="text-lg text-muted-foreground">/ 100</span>
        <span className={`text-lg font-medium ${colorClass}`}>{label}</span>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            variant === 'success'
              ? 'bg-success'
              : variant === 'warning'
                ? 'bg-warning'
                : 'bg-destructive'
          }`}
          style={{ width: `${Math.min(100, Math.max(0, overallScore))}%` }}
        />
      </div>
    </div>
  );
}
