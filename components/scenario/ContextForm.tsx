'use client';

import type { ScenarioContext } from '@/lib/types';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { CONTEXT_PRESETS } from '@/lib/context-presets';

const presetOptions = [
  { value: '', label: 'Choose a preset (optional)' },
  ...CONTEXT_PRESETS.map((p) => ({ value: p.id, label: p.label })),
];

function selectedPresetId(context: ScenarioContext): string {
  const preset = CONTEXT_PRESETS.find(
    (p) =>
      p.context.product === context.product &&
      p.context.dealDetails === context.dealDetails &&
      (p.context.specialConditions ?? '') === (context.specialConditions ?? ''),
  );
  return preset?.id ?? '';
}

export interface ContextFormProps {
  value: ScenarioContext;
  onChange: (context: ScenarioContext) => void;
}

export function ContextForm({ value, onChange }: ContextFormProps) {
  const handlePresetChange = (id: string) => {
    if (!id) return;
    const preset = CONTEXT_PRESETS.find((p) => p.id === id);
    if (preset) {
      onChange(preset.context);
    }
  };

  return (
    <Card>
      <CardHeader>Context</CardHeader>
      <div className="space-y-4">
        <Select
          label="Context preset"
          placeholder="Choose a preset (optional)"
          options={presetOptions}
          value={selectedPresetId(value)}
          onChange={handlePresetChange}
          aria-label="Choose a context preset to pre-fill product and deal details"
        />
        <Input
          label="Product or service"
          value={value.product}
          onChange={(e) => onChange({ ...value, product: e.target.value })}
          placeholder="What you're selling"
        />
        <Textarea
          label="Deal details"
          value={value.dealDetails}
          onChange={(e) => onChange({ ...value, dealDetails: e.target.value })}
          placeholder="Key terms, timeline, budget, stakeholders..."
          rows={3}
        />
        <Input
          label="Special conditions (optional)"
          value={value.specialConditions ?? ''}
          onChange={(e) =>
            onChange({
              ...value,
              specialConditions: e.target.value || undefined,
            })
          }
          placeholder="Constraints, must-haves, objections to address"
        />
      </div>
    </Card>
  );
}
