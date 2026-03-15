import type { Scenario, CreateScenarioInput } from '@/lib/types';
import { getApiBase, getApiError } from './config';

export async function createScenario(
  input: CreateScenarioInput,
): Promise<Scenario> {
  const res = await fetch(`${getApiBase()}/api/scenarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const message = await getApiError(res);
    throw new Error(message || 'Failed to create scenario');
  }
  return res.json();
}

export async function getScenario(id: string): Promise<Scenario> {
  const res = await fetch(`${getApiBase()}/api/scenarios/${id}`);
  if (!res.ok) {
    const message = await getApiError(res);
    throw new Error(message || 'Failed to fetch scenario');
  }
  return res.json();
}
