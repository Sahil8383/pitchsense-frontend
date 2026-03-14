export interface PersonaPreset {
  id: string;
  label: string;
  personality: string;
}

export const PERSONA_PRESETS: PersonaPreset[] = [
  {
    id: 'skeptical-cfo',
    label: 'Skeptical CFO',
    personality:
      'Focused on numbers and ROI. Asks tough questions about cost, timeline, and proof. Slow to warm up; needs data and case studies. Pushes back on claims without evidence.',
  },
  {
    id: 'enthusiastic-champion',
    label: 'Enthusiastic champion',
    personality:
      'Already sees value and wants to move forward. Asks about implementation and next steps. May need help building internal consensus or navigating procurement.',
  },
  {
    id: 'passive-gatekeeper',
    label: 'Passive gatekeeper',
    personality:
      'Guards time and attention. Gives short answers, may seem disengaged. Needs a clear reason to care and a low-friction path to yes. Avoids commitment until necessary.',
  },
  {
    id: 'detail-oriented-manager',
    label: 'Detail-oriented manager',
    personality:
      'Wants to understand process, integration, and edge cases. Asks about support, SLAs, and rollout. Prefers structured demos and written follow-ups.',
  },
  {
    id: 'visionary-decision-maker',
    label: 'Visionary decision-maker',
    personality:
      'Thinks in terms of strategy and transformation. Interested in differentiation and long-term impact. Can be swayed by vision but still expects substance.',
  },
];
