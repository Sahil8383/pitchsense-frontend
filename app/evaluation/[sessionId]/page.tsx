'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ScoreOverview } from '@/components/evaluation/ScoreOverview';
import { CompetencyBreakdown } from '@/components/evaluation/CompetencyBreakdown';
import { TranscriptViewer } from '@/components/evaluation/TranscriptViewer';
import { Spinner } from '@/components/ui/Spinner';
import { useEvaluation } from '@/hooks/useEvaluation';
import { useSessionContext } from '@/contexts/SessionContext';

export default function EvaluationPage() {
  const params = useParams();
  const sessionId =
    typeof params.sessionId === 'string' ? params.sessionId : null;
  const {
    data: evaluation,
    isLoading,
    isError,
    error,
  } = useEvaluation(sessionId);
  const { session: contextSession } = useSessionContext();

  const session =
    sessionId && contextSession?.id === sessionId ? contextSession : null;
  const messages = session?.messages ?? [];

  if (!sessionId) {
    return (
      <main className="min-h-screen bg-background p-6">
        <p className="text-muted-foreground">Invalid session.</p>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <Spinner size="md" />
      </main>
    );
  }

  if (isError || !evaluation) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-xl font-semibold text-foreground">
            Evaluation not found
          </h1>
          <p className="mt-2 text-muted-foreground">
            {error?.message ?? 'This evaluation may not exist yet.'}
          </p>
          <Link
            href="/scenario/new"
            className="mt-4 inline-block text-informative underline"
          >
            Create a new scenario
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4 md:px-6">
      <div className="mx-auto max-w-(--content-max-w-wide)">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Evaluation results
          </h1>
          <p className="mt-1 text-muted-foreground">
            Session summary and competency breakdown.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          <CompetencyBreakdown
            competencies={evaluation.competencies}
            scoreSlot={
              <ScoreOverview
                overallScore={evaluation.overallScore}
                variant="compact"
              />
            }
          />
          <TranscriptViewer messages={messages} />
        </div>

        <div className="mt-8">
          <Link
            href="/scenario/new"
            className="text-sm font-medium text-informative underline"
          >
            Start a new scenario
          </Link>
        </div>
      </div>
    </main>
  );
}
