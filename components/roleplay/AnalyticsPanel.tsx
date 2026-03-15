'use client';

import { useState, useEffect } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Card, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export interface AnalyticsPanelProps {
  sessionId: string | null;
  embedded?: boolean;
}

function FillerColorClass(total: number) {
  if (total <= 3) return 'text-success';
  if (total <= 8) return 'text-warning';
  return 'text-destructive';
}

export function AnalyticsPanel({ sessionId, embedded }: AnalyticsPanelProps) {
  const { analytics, status } = useWebSocket(sessionId);
  const [lastBuyerInterestPercent, setLastBuyerInterestPercent] = useState<
    number | null
  >(null);

  const a = analytics;

  useEffect(() => {
    if (typeof a?.buyerInterestPercent === 'number') {
      setLastBuyerInterestPercent(a.buyerInterestPercent);
    }
  }, [a?.buyerInterestPercent]);

  const sellerWords = a?.talkRatio?.seller ?? 0;
  const buyerWords = a?.talkRatio?.buyer ?? 0;
  const totalWords = sellerWords + buyerWords;
  const sellerPct =
    totalWords > 0 ? Math.round((sellerWords / totalWords) * 100) : 0;

  const Wrapper = embedded ? 'div' : Card;
  const wrapperClass = embedded ? 'h-fit space-y-4' : 'h-fit';
  const HeaderTag = embedded ? 'p' : CardHeader;

  return (
    <Wrapper className={wrapperClass}>
      <HeaderTag
        className={
          embedded
            ? 'mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground'
            : undefined
        }
      >
        Live analytics
      </HeaderTag>

      {status === 'connecting' && (
        <p className="text-sm text-muted-foreground">Connecting…</p>
      )}
      {status === 'disconnected' && !a && (
        <p className="text-sm text-muted-foreground">
          Send a message to see analytics.
        </p>
      )}
      {status === 'error' && (
        <p className="text-sm text-destructive">Reconnecting…</p>
      )}

      {a && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Filler words
            </p>
            <p
              className={`text-lg font-semibold ${FillerColorClass(a.fillerWordTotal)}`}
            >
              Last: {a.fillerWordCount} · Total: {a.fillerWordTotal}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Talk ratio
            </p>
            <p className="text-sm text-foreground">
              Seller: {sellerWords} words · Buyer: {buyerWords} words
            </p>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-foreground transition-all duration-300"
                style={{ width: `${sellerPct}%` }}
              />
            </div>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Buyer interest
            </p>
            <p className="text-sm text-foreground mb-1.5">
              {(() => {
                const pct =
                  typeof a.buyerInterestPercent === 'number'
                    ? a.buyerInterestPercent
                    : lastBuyerInterestPercent;
                if (pct === null) {
                  return '— Waiting for response…';
                }
                const level =
                  pct < 34 ? 'low' : pct < 67 ? 'moderate' : 'high';
                return `${pct}% — ${level} engagement`;
              })()}
            </p>
            <div className="relative h-3 w-full">
              {/* Red → orange → green gradient bar */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'linear-gradient(to right, #ef4444 0%, #f97316 50%, #22c55e 100%)',
                }}
              />
              {/* Profile-like circle indicator: use current or last known */}
              <div
                className="absolute top-1/2 size-5 rounded-full border-2 border-white bg-slate-800 shadow-md transition-all duration-300 ease-out dark:border-slate-900 dark:bg-slate-100"
                style={{
                  left: `clamp(0%, ${typeof a.buyerInterestPercent === 'number' ? a.buyerInterestPercent : lastBuyerInterestPercent ?? 0}%, 100%)`,
                  transform: 'translate(-50%, -50%)',
                }}
                aria-hidden
              />
            </div>
          </div>

          {a.monologueFlag && (
            <Badge variant="warning">
              Monologue detected — last message over 150 words. Consider pausing
              for buyer input.
            </Badge>
          )}
        </div>
      )}
    </Wrapper>
  );
}
