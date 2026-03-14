'use client';

import type { Persona } from '@/lib/types';
import { Card, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { PERSONA_PRESETS } from '@/lib/persona-presets';

const presetOptions = [
  { value: '', label: 'Choose a preset (optional)' },
  ...PERSONA_PRESETS.map((p) => ({ value: p.id, label: p.label })),
];

function selectedPresetId(personality: string): string {
  const preset = PERSONA_PRESETS.find((p) => p.personality === personality);
  return preset?.id ?? '';
}

export interface PersonaFormProps {
  value: Persona;
  onChange: (persona: Persona) => void;
}

export function PersonaForm({ value, onChange }: PersonaFormProps) {
  const handlePresetChange = (id: string) => {
    if (!id) return;
    const preset = PERSONA_PRESETS.find((p) => p.id === id);
    if (preset) {
      onChange({ ...value, personality: preset.personality });
    }
  };

  return (
    <Card>
      <CardHeader>Persona</CardHeader>
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Name"
            value={value.name}
            onChange={(e) => onChange({ ...value, name: e.target.value })}
            placeholder="e.g. Jordan Chen"
          />
          <Input
            label="Job title"
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
            placeholder="e.g. VP of Operations"
          />
        </div>
        <Input
          label="Company"
          value={value.company}
          onChange={(e) => onChange({ ...value, company: e.target.value })}
          placeholder="Company name"
        />
        <Select
          label="Personality archetype"
          placeholder="Choose a preset (optional)"
          options={presetOptions}
          value={selectedPresetId(value.personality)}
          onChange={handlePresetChange}
          aria-label="Choose a personality preset to pre-fill description"
        />
        <Textarea
          label="Personality description"
          value={value.personality}
          onChange={(e) => onChange({ ...value, personality: e.target.value })}
          placeholder="Describe how they typically respond to sales pitches..."
          rows={4}
        />
      </div>
    </Card>
  );
}
