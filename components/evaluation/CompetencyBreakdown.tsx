'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';
import type { CompetencyScore } from '@/lib/types';
import { Card, CardHeader } from '@/components/ui/Card';

export interface CompetencyBreakdownProps {
  competencies: CompetencyScore[];
}

const MAX_SCORE = 5;

function barColor(score: number) {
  if (score >= 4) return 'var(--success)';
  if (score >= 3) return 'var(--warning)';
  return 'var(--destructive)';
}

export function CompetencyBreakdown({
  competencies,
}: CompetencyBreakdownProps) {
  const chartData = competencies.map((c) => ({
    name: c.competencyName,
    score: c.score,
    fullMark: MAX_SCORE,
  }));

  return (
    <Card>
      <CardHeader>Per-competency breakdown</CardHeader>

      <div className="mb-6 h-64 w-full md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
          >
            <XAxis type="number" domain={[0, MAX_SCORE]} tickCount={6} />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: unknown) => [
                `${Number(value) ?? 0} / ${MAX_SCORE}`,
                'Score',
              ]}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={barColor(chartData[i].score)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <ul className="space-y-4">
        {competencies.map((c) => (
          <li
            key={c.competencyId}
            className="rounded-lg border border-border bg-background/50 p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium text-foreground">
                {c.competencyName}
              </span>
              <span className="text-sm text-muted-foreground">
                Weight: {c.weight}% · Score: {c.score}/{MAX_SCORE}
              </span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(c.score / MAX_SCORE) * 100}%`,
                  backgroundColor: barColor(c.score),
                }}
              />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {c.feedback}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
