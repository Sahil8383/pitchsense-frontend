'use client';

import { useMutation } from '@tanstack/react-query';
import { createSession, sendMessage, endSession } from '@/lib/api/sessions';

export function useCreateSession() {
  return useMutation({
    mutationFn: (scenarioId: string) => createSession(scenarioId),
  });
}

export function useSendMessage(sessionId: string | null) {
  return useMutation({
    mutationFn: (content: string) =>
      sessionId
        ? sendMessage(sessionId, content)
        : Promise.reject(new Error('No session')),
    mutationKey: ['sendMessage', sessionId],
  });
}

export function useEndSession() {
  return useMutation({
    mutationFn: (sessionId: string) => endSession(sessionId),
  });
}
