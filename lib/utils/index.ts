export function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
  }
}

export function generateId(): string {
  return `comp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function scoreToColor5(score: number): string {
  if (score >= 4) return 'var(--success)';
  if (score >= 3) return 'var(--warning)';
  return 'var(--destructive)';
}

export function getScoreLabel(score: number): string {
  if (score < 60) return 'Needs work';
  if (score < 80) return 'Good';
  return 'Excellent';
}

export function getScoreVariant(
  score: number,
): 'destructive' | 'warning' | 'success' {
  if (score < 60) return 'destructive';
  if (score < 80) return 'warning';
  return 'success';
}

export function fillerCountToSeverityClass(total: number): string {
  if (total <= 3) return 'text-success';
  if (total <= 8) return 'text-warning';
  return 'text-destructive';
}
