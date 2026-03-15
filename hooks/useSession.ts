'use client';

import { useMutation } from '@tanstack/react-query';
import { createSession, endSession } from '@/lib/api/sessions';

export function useCreateSession() {
  return useMutation({
    mutationFn: (scenarioId: string) => createSession(scenarioId),
  });
}

export function useEndSession() {
  return useMutation({
    mutationFn: (sessionId: string) => endSession(sessionId),
  });
}
