'use client';

import { useQuery } from '@tanstack/react-query';
import { getEvaluation } from '@/lib/api/evaluations';

export function useEvaluation(sessionId: string | null) {
  return useQuery({
    queryKey: ['evaluation', sessionId],
    queryFn: () => getEvaluation(sessionId!),
    enabled: !!sessionId,
  });
}
