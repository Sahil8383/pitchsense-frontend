/**
 * Parses message content into text and action segments.
 * Actions are asterisk-wrapped phrases like *hangs up* (common in roleplay).
 */
export type MessageSegment =
  | { type: 'text'; content: string }
  | { type: 'action'; content: string };

export function parseMessageContent(content: string): MessageSegment[] {
  if (!content.trim()) return [{ type: 'text', content }];

  const segments: MessageSegment[] = [];
  // Match *...* (non-greedy), keep delimiters so we can classify
  const parts = content.split(/(\*[^*]+\*)/g).filter(Boolean);

  for (const part of parts) {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      segments.push({ type: 'action', content: part.slice(1, -1).trim() });
    } else {
      segments.push({ type: 'text', content: part });
    }
  }

  return segments;
}

/** Normalized action string for matching (lowercase, collapsed spaces). */
export function normalizeAction(action: string): string {
  return action.toLowerCase().replace(/\s+/g, ' ').trim();
}
