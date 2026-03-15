import type { Persona, ScenarioContext } from '@/lib/types';
import { CONTEXT_PRESETS } from '@/lib/context-presets';

export const STEPS = [
  { id: 1, title: 'Persona', short: 'Persona' },
  { id: 2, title: 'Context', short: 'Context' },
  { id: 3, title: 'Rubric', short: 'Rubric' },
] as const;

export const defaultPersona: Persona = {
  name: 'Jordan Chen',
  title: 'VP of Operations',
  company: 'Northgate Logistics',
  personality:
    'Data-driven, time-pressed. Prefers concise answers and ROI. Skeptical of hype; wants proof and references.',
};

const REAL_ESTATE_FALLBACK: ScenarioContext = {
  product: 'Commercial property — office space',
  dealDetails:
    'Looking for 3–5 year lease. Need move-in within 6 months. Budget approved for target area.',
  specialConditions:
    'Prefers flexible exit clause. Wants build-out allowance. Must have parking.',
};

export const defaultContext: ScenarioContext =
  CONTEXT_PRESETS.find((p) => p.id === 'real-estate')?.context ??
  REAL_ESTATE_FALLBACK;
