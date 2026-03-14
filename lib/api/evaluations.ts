import type { Evaluation } from '@/lib/types';
import { getApiBase } from './config';

const base = () => getApiBase();

export async function getEvaluation(sessionId: string): Promise<Evaluation> {
  const res = await fetch(`${base()}/api/sessions/${sessionId}/evaluation`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? 'Failed to fetch evaluation');
  }
  return res.json();
}
