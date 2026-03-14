export function getApiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';
  return base.replace(/\/$/, '');
}

export function getWsUrl(): string {
  const base = getApiBase();
  const wsProtocol = base.startsWith('https') ? 'wss' : 'ws';
  const host = base.replace(/^https?:\/\//, '');
  return `${wsProtocol}://${host}/ws`;
}
