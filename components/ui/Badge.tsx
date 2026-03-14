export type BadgeVariant = 'neutral' | 'success' | 'warning' | 'destructive';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  neutral: 'bg-muted/30 text-muted-foreground',
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  destructive: 'bg-destructive-bg text-destructive',
};

export function Badge({
  children,
  variant = 'neutral',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
