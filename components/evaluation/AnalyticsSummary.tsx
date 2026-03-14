'use client';

import type { Evaluation } from '@/lib/types';
import { Card, CardHeader } from '@/components/ui/Card';

export interface AnalyticsSummaryProps {
  evaluation: Evaluation;
}

export function AnalyticsSummary({ evaluation }: AnalyticsSummaryProps) {
  const summary = evaluation.analyticsSummary;
  if (!summary) return null;

  const { totalFillerWords, talkRatio, monologueCount } = summary;
  const sellerWords = talkRatio.seller;
  const buyerWords = talkRatio.buyer;
  const totalWords = sellerWords + buyerWords;
  const sellerPct =
    totalWords > 0 ? Math.round((sellerWords / totalWords) * 100) : 0;

  return (
    <Card>
      <CardHeader>Analytics summary</CardHeader>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Total filler words
          </p>
          <p className="text-xl font-semibold text-foreground">
            {totalFillerWords}
          </p>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Monologue flags
          </p>
          <p className="text-xl font-semibold text-foreground">
            {monologueCount}
          </p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-xs font-medium text-muted-foreground mb-1">
          Final talk ratio
        </p>
        <p className="text-sm text-foreground">
          Seller: {sellerWords} words · Buyer: {buyerWords} words
        </p>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-foreground"
            style={{ width: `${sellerPct}%` }}
          />
        </div>
      </div>
    </Card>
  );
}
