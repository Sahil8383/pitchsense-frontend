'use client';

import type { Evaluation } from '@/lib/types';

export interface EvaluationKPIsProps {
  evaluation: Evaluation;
}

export function EvaluationKPIs({ evaluation }: EvaluationKPIsProps) {
  const summary = evaluation.analyticsSummary;

  const totalFillerWords = summary?.totalFillerWords ?? 0;
  const monologueCount = summary?.monologueCount ?? 0;
  const talkRatio = summary?.talkRatio ?? { seller: 0, buyer: 0 };
  const totalWords = talkRatio.seller + talkRatio.buyer;
  const sellerPct =
    totalWords > 0 ? Math.round((talkRatio.seller / totalWords) * 100) : 0;

  return (
    <div className="flex flex-col gap-4 rounded-lg p-4 sm:flex-row sm:flex-wrap sm:gap-6">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">
          Filler words
        </p>
        <p className="text-xl font-semibold tabular-nums text-foreground">
          {totalFillerWords}
        </p>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-muted-foreground">
          Monologue flags
        </p>
        <p className="text-xl font-semibold tabular-nums text-foreground">
          {monologueCount}
        </p>
      </div>
      <div className="min-w-0 flex-1 sm:min-w-[140px]">
        <p className="text-xs font-medium text-muted-foreground">
          Talk ratio
        </p>
        <p className="text-xl font-semibold tabular-nums text-foreground">
          Seller {sellerPct}%
        </p>
        <div className="mt-1 h-1.5 w-full max-w-[120px] overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-foreground transition-all duration-500"
            style={{ width: `${sellerPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
