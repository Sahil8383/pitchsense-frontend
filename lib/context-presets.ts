import type { ScenarioContext } from '@/lib/types';

export interface ContextPreset {
  id: string;
  label: string;
  context: ScenarioContext;
}

export const CONTEXT_PRESETS: ContextPreset[] = [
  {
    id: 'route-optimization',
    label: 'Route optimization / logistics',
    context: {
      product: 'Route optimization software',
      dealDetails:
        'Evaluating options. Budget approved. Replacing current spreadsheets.',
      specialConditions: undefined,
    },
  },
  {
    id: 'real-estate',
    label: 'Real estate',
    context: {
      product: 'Commercial property — office space',
      dealDetails:
        'Looking for 3–5 year lease. Need move-in within 6 months. Budget approved for target area.',
      specialConditions:
        'Prefers flexible exit clause. Wants build-out allowance. Must have parking.',
    },
  },
];
