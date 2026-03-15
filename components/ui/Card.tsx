import type { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'transparent';
}

export function Card({
  children,
  className = '',
  variant = 'default',
  ...props
}: CardProps) {
  const base = 'rounded-lg text-card-foreground p-4 md:p-6';
  const styles =
    variant === 'transparent' ? base : `${base} border border-border bg-card`;

  return (
    <div className={`${styles} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`text-lg font-semibold leading-tight text-foreground mb-4 ${className}`}
    >
      {children}
    </h2>
  );
}
