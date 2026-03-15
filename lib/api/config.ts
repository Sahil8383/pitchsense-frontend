export function getApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  return base.replace(/\/$/, '');
}

/** Parse error message from a failed API response. */
export async function getApiError(res: Response): Promise<string> {
  const err = await res.json().catch(() => ({}));
  const message = (err as { message?: string }).message;
  return message ?? res.statusText;
}

export function getWsUrl(): string {
  const base = getApiBase();
  const wsProtocol = base.startsWith('https') ? 'wss' : 'ws';
  const host = base.replace(/^https?:\/\//, '');
  return `${wsProtocol}://${host}/ws`;
}
