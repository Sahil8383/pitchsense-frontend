export type SessionTab = 'chat' | 'analytics';

/** Buyer actions that mean the call/conversation ended; we can react in the UI. */
export const END_CALL_ACTIONS = new Set([
  'hangs up',
  'hang up',
  'hangs up the phone',
  'ends the call',
  'end the call',
  'leaves',
  'leaves the call',
  'disconnects',
]);

export const QUICK_PROMPTS = [
  "Hi, I'd like to introduce myself and our solution—do you have a few minutes?",
  "What's the biggest challenge you're facing with your current setup?",
  "I hear you on that—here's how we've helped other teams in your situation.",
  'Would it make sense to schedule a short demo so you can see it in action?',
];

export const STREAMING_BUYER_ID = 'streaming-buyer';
