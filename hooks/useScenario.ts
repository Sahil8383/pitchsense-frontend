'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { createScenario, getScenario } from '@/lib/api/scenarios';
import type { CreateScenarioInput } from '@/lib/types';

export function useCreateScenario() {
  return useMutation({
    mutationFn: (input: CreateScenarioInput) => createScenario(input),
  });
}

export function useScenario(id: string | null) {
  return useQuery({
    queryKey: ['scenario', id],
    queryFn: () => getScenario(id!),
    enabled: !!id,
  });
}
