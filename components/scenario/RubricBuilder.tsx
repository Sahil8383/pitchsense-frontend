'use client';

import { motion } from 'framer-motion';
import { type RubricCompetency } from '@/lib/types';
import { generateId } from '@/lib/utils';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';

const MIN_COMPETENCIES = 3;
const MAX_COMPETENCIES = 4;
const TOTAL_WEIGHT = 100;

export interface RubricBuilderProps {
  competencies: RubricCompetency[];
  onChange: (competencies: RubricCompetency[]) => void;
}

export function RubricBuilder({ competencies, onChange }: RubricBuilderProps) {
  const total = competencies.reduce((sum, c) => sum + c.weight, 0);
  const isValid = total === TOTAL_WEIGHT;
  const canAdd = competencies.length < MAX_COMPETENCIES;

  /** Max weight this competency can have so the total does not exceed TOTAL_WEIGHT */
  const getMaxWeightFor = (index: number) => {
    const otherTotal = competencies.reduce(
      (sum, c, i) => (i === index ? sum : sum + c.weight),
      0,
    );
    return Math.max(0, TOTAL_WEIGHT - otherTotal);
  };

  const updateAt = (index: number, patch: Partial<RubricCompetency>) => {
    const next = [...competencies];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  const addRow = () => {
    if (!canAdd) return;
    onChange([
      ...competencies,
      {
        id: generateId(),
        name: '',
        description: '',
        weight: Math.floor(TOTAL_WEIGHT / (competencies.length + 1)),
      },
    ]);
  };

  const removeAt = (index: number) => {
    if (competencies.length <= MIN_COMPETENCIES) return;
    const next = competencies.filter((_, i) => i !== index);
    onChange(next);
  };

  const autoBalance = () => {
    const n = competencies.length;
    if (n === 0) return;
    const base = Math.floor(TOTAL_WEIGHT / n);
    const remainder = TOTAL_WEIGHT - base * n;
    const balanced = competencies.map((c, i) => ({
      ...c,
      weight: base + (i < remainder ? 1 : 0),
    }));
    onChange(balanced);
  };

  return (
    <Card>
      <CardHeader>Evaluation rubric</CardHeader>
      <p className="mb-4 text-sm text-muted-foreground">
        Add 3–4 competencies. Weights must sum to {TOTAL_WEIGHT}.
      </p>

      <div className="space-y-6">
        {competencies.map((comp, index) => (
          <motion.div
            key={comp.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="rounded-lg border border-border bg-background/50 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Competency {index + 1}
              </span>
              {competencies.length > MIN_COMPETENCIES && (
                <Button
                  variant="ghost"
                  className="text-destructive hover:bg-destructive-bg"
                  onClick={() => removeAt(index)}
                  aria-label={`Remove competency ${index + 1}`}
                >
                  Remove
                </Button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-[1fr,minmax(140px,auto)]">
              <div className="space-y-3">
                <Input
                  label="Name"
                  value={comp.name}
                  onChange={(e) => updateAt(index, { name: e.target.value })}
                  placeholder="e.g. Discovery"
                />
                <Textarea
                  label="Description"
                  value={comp.description}
                  onChange={(e) =>
                    updateAt(index, { description: e.target.value })
                  }
                  placeholder="What is evaluated"
                  rows={2}
                />
              </div>
              <div className="flex flex-col justify-center">
                <Input
                  type="number"
                  label="Weight"
                  min={0}
                  max={getMaxWeightFor(index)}
                  value={comp.weight}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    if (Number.isNaN(v)) return;
                    const maxW = getMaxWeightFor(index);
                    updateAt(index, {
                      weight: Math.max(0, Math.min(maxW, v)),
                    });
                  }}
                  className="w-20"
                  aria-label={`Weight for competency ${index + 1}`}
                />
              </div>
            </div>
          </motion.div>
        ))}

        {canAdd && (
          <Button variant="secondary" onClick={addRow}>
            Add competency
          </Button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
        <span
          className={`text-sm font-medium transition-colors duration-200 ${
            isValid ? 'text-success' : 'text-destructive'
          }`}
          role="status"
          aria-live="polite"
        >
          Total: {total} / {TOTAL_WEIGHT}
          {isValid && ' ✓'}
        </span>
        {!isValid && total > 0 && (
          <Button variant="ghost" onClick={autoBalance}>
            Auto-balance
          </Button>
        )}
      </div>
    </Card>
  );
}
