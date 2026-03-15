'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PersonaForm } from '@/components/scenario/PersonaForm';
import { ContextForm } from '@/components/scenario/ContextForm';
import { RubricBuilder } from '@/components/scenario/RubricBuilder';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useCreateScenario } from '@/hooks/useScenario';
import { useCreateSession } from '@/hooks/useSession';
import { useToast } from '@/contexts/ToastContext';
import { useSessionContext } from '@/contexts/SessionContext';
import type { Persona, ScenarioContext, RubricCompetency } from '@/lib/types';
import { SPIN_RUBRIC } from '@/lib/spin-rubric';
import { CONTEXT_PRESETS } from '@/lib/context-presets';

const STEPS = [
  { id: 1, title: 'Persona', short: 'Persona' },
  { id: 2, title: 'Context', short: 'Context' },
  { id: 3, title: 'Rubric', short: 'Rubric' },
] as const;

const defaultPersona: Persona = {
  name: 'Jordan Chen',
  title: 'VP of Operations',
  company: 'Northgate Logistics',
  personality:
    'Data-driven, time-pressed. Prefers concise answers and ROI. Skeptical of hype; wants proof and references.',
};

const defaultContext: ScenarioContext = CONTEXT_PRESETS.find(
  (p) => p.id === 'real-estate',
)?.context ?? {
  product: 'Commercial property — office space',
  dealDetails:
    'Looking for 3–5 year lease. Need move-in within 6 months. Budget approved for target area.',
  specialConditions:
    'Prefers flexible exit clause. Wants build-out allowance. Must have parking.',
};

export default function ScenarioNewPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { setSession } = useSessionContext();
  const createScenario = useCreateScenario();
  const createSession = useCreateSession();

  const [step, setStep] = useState(1);
  const submittedBySubmitButtonRef = useRef(false);
  const [persona, setPersona] = useState<Persona>(defaultPersona);
  const [context, setContext] = useState<ScenarioContext>(defaultContext);
  const [rubric, setRubric] = useState<RubricCompetency[]>(
    SPIN_RUBRIC.map((c) => ({ ...c })),
  );

  const totalWeight = rubric.reduce((sum, c) => sum + c.weight, 0);
  const personaValid =
    persona.name.trim() &&
    persona.title.trim() &&
    persona.company.trim() &&
    persona.personality.trim();
  const contextValid = context.product.trim() && context.dealDetails.trim();
  const rubricValid =
    rubric.length >= 3 &&
    rubric.every((c) => c.name.trim() && c.description.trim()) &&
    totalWeight === 100;

  const canProceed =
    (step === 1 && personaValid) ||
    (step === 2 && contextValid) ||
    (step === 3 && rubricValid);

  const isValid = personaValid && contextValid && rubricValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Only proceed if the user explicitly clicked the submit button (avoids submit from
    // Enter or from the same click that moved to step 3 hitting the newly rendered button)
    if (!submittedBySubmitButtonRef.current) return;
    submittedBySubmitButtonRef.current = false;
    if (step !== 3) return;
    if (!isValid) return;
    try {
      const scenario = await createScenario.mutateAsync({
        persona,
        context,
        rubric,
      });
      const session = await createSession.mutateAsync(scenario.id);
      setSession(session);
      router.push(`/session/${session.id}`);
    } catch {
      addToast('error', 'Failed to create scenario. Please try again.');
    }
  };

  const isPending = createScenario.isPending || createSession.isPending;

  return (
    <main className="min-h-screen bg-background py-8 px-4 md:px-6">
      <div className="mx-auto max-w-(--content-max-w)">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Scenario builder
          </h1>
          <p className="mt-1 text-muted-foreground">
            Create a practice scenario in a few steps.
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex items-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <button
                type="button"
                onClick={() => setStep(s.id)}
                className={`flex cursor-pointer items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  step === s.id
                    ? 'border-2 border-foreground bg-foreground text-background shadow-sm hover:bg-foreground/90'
                    : 'border-2 border-border bg-card text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground hover:bg-muted/30'
                }`}
                aria-current={step === s.id ? 'step' : undefined}
                aria-label={`Go to step ${s.id}: ${s.title}`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                    step === s.id
                      ? 'bg-background text-foreground'
                      : 'border-2 border-current bg-transparent'
                  }`}
                >
                  {s.id}
                </span>
                <span className="hidden sm:inline">{s.short}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div
                  className={`mx-1 h-0.5 w-4 shrink-0 sm:mx-2 sm:w-8 ${
                    step > s.id ? 'bg-foreground/50' : 'bg-muted-foreground/30'
                  }`}
                  aria-hidden
                />
              )}
            </div>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-8"
          aria-label="Create scenario form"
        >
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="min-h-[320px]"
              >
                <PersonaForm value={persona} onChange={setPersona} />
              </motion.div>
            )}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="min-h-[320px]"
              >
                <ContextForm value={context} onChange={setContext} />
              </motion.div>
            )}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="min-h-[320px]"
              >
                <RubricBuilder competencies={rubric} onChange={setRubric} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              {step > 1 && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setStep((s) => s - 1)}
                  className="cursor-pointer min-w-[100px]"
                >
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button
                  type="button"
                  variant="primary"
                  disabled={!canProceed}
                  onClick={() => setStep((s) => s + 1)}
                  className="cursor-pointer min-w-[120px]"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!isValid || isPending}
                  className="min-w-[200px] cursor-pointer"
                  onClick={() => {
                    submittedBySubmitButtonRef.current = true;
                  }}
                >
                  {isPending ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Creating…
                    </>
                  ) : (
                    'Start practice'
                  )}
                </Button>
              )}
            </div>
            {step === 3 && !isValid && (
              <span className="text-sm text-muted-foreground">
                Ensure all rubric fields are filled and weights sum to 100.
              </span>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
