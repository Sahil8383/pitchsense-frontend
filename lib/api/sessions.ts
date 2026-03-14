import type { Session, Evaluation, SendMessageResponse } from '@/lib/types';
import { getApiBase } from './config';

const base = () => getApiBase();

export async function createSession(scenarioId: string): Promise<Session> {
  const res = await fetch(`${base()}/api/scenarios/${scenarioId}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? 'Failed to create session');
  }
  return res.json();
}

export async function sendMessage(
  sessionId: string,
  content: string,
): Promise<SendMessageResponse> {
  const res = await fetch(`${base()}/api/sessions/${sessionId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? 'Failed to send message');
  }
  return res.json();
}

export async function endSession(sessionId: string): Promise<Evaluation> {
  const res = await fetch(`${base()}/api/sessions/${sessionId}/end`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? 'Failed to end session');
  }
  return res.json();
}
