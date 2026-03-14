'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export interface SessionLeftSidebarProps {
  personaName: string;
  personaCompany?: string | null;
  product?: string | null;
  onEndSession: () => void;
  isEndingSession: boolean;
}

export function SessionLeftSidebar({
  personaName,
  personaCompany,
  product,
  onEndSession,
  isEndingSession,
}: SessionLeftSidebarProps) {
  return (
    <aside
      className="flex h-full w-56 shrink-0 flex-col border-r border-border bg-background"
      aria-label="Session navigation"
    >
      <div className="flex flex-col gap-6 p-4">
        <Link
          href="/"
          className="text-sm font-semibold text-foreground transition-opacity hover:opacity-80"
        >
          PitchSense
        </Link>

        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Current session
          </p>
          <div className="rounded-lg bg-background/60 px-3 py-2.5">
            <p className="truncate text-sm font-medium text-foreground">
              {personaName}
            </p>
            {personaCompany && (
              <p className="truncate text-xs text-muted-foreground">
                {personaCompany}
              </p>
            )}
            {product && (
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {product}
              </p>
            )}
          </div>
        </div>

        <nav className="flex flex-col gap-0.5" aria-label="App navigation">
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Navigation
          </p>
          <Link
            href="/scenario/new"
            className="rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted/50"
          >
            Scenario builder
          </Link>
        </nav>
      </div>

      <div className="mt-auto border-t border-border p-4">
        <Button
          variant="danger"
          onClick={onEndSession}
          disabled={isEndingSession}
          className="w-full"
          aria-label="End session"
        >
          {isEndingSession ? 'Ending…' : 'End session'}
        </Button>
      </div>
    </aside>
  );
}
