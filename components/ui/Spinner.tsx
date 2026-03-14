export interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md';
}

export function Spinner({ className = '', size = 'md' }: SpinnerProps) {
  const sizeClass = size === 'sm' ? 'h-4 w-4 border-2' : 'h-6 w-6 border-2';
  return (
    <span
      className={`inline-block animate-spin rounded-full border-border border-t-foreground ${sizeClass} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
