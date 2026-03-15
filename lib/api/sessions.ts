import type { Session, Evaluation, Message } from '@/lib/types';
import { getApiBase, getApiError } from './config';

export async function createSession(scenarioId: string): Promise<Session> {
  const res = await fetch(
    `${getApiBase()}/api/scenarios/${scenarioId}/sessions`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
  );
  if (!res.ok) {
    const message = await getApiError(res);
    throw new Error(message || 'Failed to create session');
  }
  return res.json();
}

export type StreamMessageEvent =
  | { type: 'delta'; delta: string }
  | { type: 'done'; message: Message }
  | { type: 'error'; error: string };

/**
 * Send a message and consume the streaming buyer reply. Calls onDelta for each
 * content chunk and onDone with the final message (or onError on failure).
 */
export async function sendMessageStream(
  sessionId: string,
  content: string,
  callbacks: {
    onDelta: (delta: string) => void;
    onDone: (message: Message) => void;
    onError: (error: string) => void;
  },
): Promise<void> {
  const res = await fetch(
    `${getApiBase()}/api/sessions/${sessionId}/messages`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    },
  );
  if (!res.ok) {
    const message = await getApiError(res);
    callbacks.onError(message || 'Failed to send message');
    return;
  }
  const reader = res.body?.getReader();
  if (!reader) {
    callbacks.onError('Stream not supported');
    return;
  }
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const event = JSON.parse(line) as StreamMessageEvent;
          if (event.type === 'delta') {
            callbacks.onDelta(event.delta);
          } else if (event.type === 'done') {
            callbacks.onDone(event.message);
          } else if (event.type === 'error') {
            callbacks.onError(event.error);
          }
        } catch {
          // ignore malformed line
        }
      }
    }
    if (buffer.trim()) {
      try {
        const event = JSON.parse(buffer) as StreamMessageEvent;
        if (event.type === 'delta') callbacks.onDelta(event.delta);
        else if (event.type === 'done') callbacks.onDone(event.message);
        else if (event.type === 'error') callbacks.onError(event.error);
      } catch {
        // ignore
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export async function endSession(sessionId: string): Promise<Evaluation> {
  const res = await fetch(`${getApiBase()}/api/sessions/${sessionId}/end`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const err = await res
      .json()
      .catch(() => ({ error: { message: res.statusText } }));
    const message =
      (err as { error?: { message?: string } }).error?.message ??
      (err as { message?: string }).message ??
      'Failed to end session';
    throw new Error(message);
  }
  return res.json();
}
