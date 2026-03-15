import type { Evaluation } from '@/lib/types';
import { getApiBase, getApiError } from './config';

export async function getEvaluation(sessionId: string): Promise<Evaluation> {
  const res = await fetch(
    `${getApiBase()}/api/sessions/${sessionId}/evaluation`,
  );
  if (!res.ok) {
    const message = await getApiError(res);
    throw new Error(message || 'Failed to fetch evaluation');
  }
  return res.json();
}
