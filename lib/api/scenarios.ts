import type { Scenario, CreateScenarioInput } from '@/lib/types';
import { getApiBase } from './config';

const base = () => getApiBase();

export async function createScenario(
  input: CreateScenarioInput,
): Promise<Scenario> {
  const res = await fetch(`${base()}/api/scenarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? 'Failed to create scenario');
  }
  return res.json();
}

export async function getScenario(id: string): Promise<Scenario> {
  const res = await fetch(`${base()}/api/scenarios/${id}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? 'Failed to fetch scenario');
  }
  return res.json();
}
