'use client';

import { useParams } from 'next/navigation';

export function useSessionIdParam(): string | null {
  const params = useParams();
  return typeof params?.sessionId === 'string' ? params.sessionId : null;
}
