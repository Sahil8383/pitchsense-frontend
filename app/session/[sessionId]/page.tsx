'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { ChatMessage } from '@/components/roleplay/ChatMessage';
import { ChatInput } from '@/components/roleplay/ChatInput';
import { TypingIndicator } from '@/components/roleplay/TypingIndicator';
import { AnalyticsPanel } from '@/components/roleplay/AnalyticsPanel';
import { SessionLeftSidebar } from '@/components/roleplay/SessionLeftSidebar';
import { EndSessionModal } from '@/components/roleplay/EndSessionModal';
import { Button } from '@/components/ui/Button';
import { useSessionContext } from '@/contexts/SessionContext';
import { useSendMessage } from '@/hooks/useSession';
import { useEndSession } from '@/hooks/useSession';
import { useToast } from '@/contexts/ToastContext';
import type { Message } from '@/lib/types';

type Tab = 'chat' | 'analytics';

const QUICK_PROMPTS = [
  "Hi, I'd like to introduce myself and our solution—do you have a few minutes?",
  "What's the biggest challenge you're facing with your current setup?",
  "I hear you on that—here's how we've helped other teams in your situation.",
  "Would it make sense to schedule a short demo so you can see it in action?",
];

export default function SessionPage() {
  const params = useParams();
  const sessionId =
    typeof params.sessionId === 'string' ? params.sessionId : null;
  const router = useRouter();
  const { session: contextSession } = useSessionContext();
  const sendMessage = useSendMessage(sessionId);
  const endSession = useEndSession();
  const { addToast } = useToast();

  const session =
    sessionId && contextSession?.id === sessionId ? contextSession : null;

  const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
  const displayMessages = useMemo(
    () => [...(session?.messages ?? []), ...pendingMessages],
    [session?.messages, pendingMessages],
  );

  const [endModalOpen, setEndModalOpen] = useState(false);
  const [narrowTab, setNarrowTab] = useState<Tab>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages, scrollToBottom]);

  const handleSend = useCallback(
    async (content: string) => {
      if (!sessionId) return;
      const sellerMessage: Message = {
        id: `temp-seller-${Date.now()}`,
        role: 'seller',
        content,
        timestamp: new Date().toISOString(),
      };
      setPendingMessages((prev) => [...prev, sellerMessage]);
      scrollToBottom();

      try {
        const { message: buyerMessage } =
          await sendMessage.mutateAsync(content);
        setPendingMessages((prev) => [...prev, buyerMessage]);
        scrollToBottom();
      } catch {
        setPendingMessages((prev) =>
          prev.filter((m) => m.id !== sellerMessage.id),
        );
        addToast('error', 'Failed to send message. Please try again.');
      }
    },
    [sessionId, sendMessage, addToast, scrollToBottom],
  );

  const handleEndSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      await endSession.mutateAsync(sessionId);
      router.push(`/evaluation/${sessionId}`);
    } catch {
      addToast('error', 'Failed to end session. Please try again.');
    }
  }, [sessionId, endSession, router, addToast]);

  if (!sessionId) {
    return (
      <main className="min-h-screen bg-background p-6">
        <p className="text-muted-foreground">Invalid session.</p>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-background p-6">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-xl font-semibold text-foreground">
            Session not found
          </h1>
          <p className="mt-2 text-muted-foreground">
            Start a new scenario from the scenario builder.
          </p>
          <Link
            href="/scenario/new"
            className="mt-4 inline-block text-informative underline"
          >
            Go to scenario builder
          </Link>
        </div>
      </main>
    );
  }

  const persona = session.scenario?.persona;
  const context = session.scenario?.context;
  const hasMessages = displayMessages.length > 0;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left sidebar — nav + session context + end session (full height) */}
      <div className="hidden lg:flex lg:self-stretch">
        <SessionLeftSidebar
          personaName={persona?.name ?? 'Buyer'}
          personaCompany={persona?.company}
          product={context?.product}
          onEndSession={() => setEndModalOpen(true)}
          isEndingSession={endSession.isPending}
        />
      </div>

      {/* Center — chat */}
      <div className="flex min-w-0 flex-1 flex-col border-r border-border">
        {/* Minimal top bar on desktop; on narrow show header with end session */}
        <header className="flex shrink-0 items-center justify-between border-b border-border bg-background px-4 py-3 lg:px-6">
          <span className="text-sm font-medium text-muted-foreground">
            Roleplay
          </span>
          <div className="flex items-center gap-2 lg:hidden">
            <Button
              variant="danger"
              onClick={() => setEndModalOpen(true)}
              disabled={endSession.isPending}
              aria-label="End session"
              className="text-sm"
            >
              End session
            </Button>
          </div>
        </header>

        {/* Tabs on narrow only */}
        <div
          className="flex border-b border-border lg:hidden"
          role="tablist"
          aria-label="Chat and Analytics"
        >
          <button
            type="button"
            role="tab"
            aria-selected={narrowTab === 'chat'}
            aria-controls="chat-panel"
            id="tab-chat"
            onClick={() => setNarrowTab('chat')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              narrowTab === 'chat'
                ? 'border-b-2 border-foreground text-foreground'
                : 'text-muted-foreground'
            }`}
          >
            Chat
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={narrowTab === 'analytics'}
            aria-controls="analytics-panel"
            id="tab-analytics"
            onClick={() => setNarrowTab('analytics')}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              narrowTab === 'analytics'
                ? 'border-b-2 border-foreground text-foreground'
                : 'text-muted-foreground'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Chat panel: always mounted on narrow so layout is consistent */}
        <div
          id="chat-panel"
          role="tabpanel"
          aria-labelledby="tab-chat"
          aria-hidden={narrowTab !== 'chat'}
          className={`flex min-h-0 flex-1 flex-col overflow-hidden ${narrowTab !== 'chat' ? 'hidden lg:flex' : ''}`}
        >
          <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-6">
            <div className="mx-auto max-w-2xl">
              {hasMessages ? (
                <div className="space-y-4">
                  {displayMessages.map((m) => (
                    <ChatMessage key={m.id} message={m} />
                  ))}
                  {sendMessage.isPending && <TypingIndicator />}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-muted-foreground">
                    Start typing here or paste any message to continue the
                    roleplay…
                  </p>
                  <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Get started with
                  </p>
                  <div className="mt-2 flex flex-wrap justify-center gap-2">
                    {QUICK_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => handleSend(prompt)}
                        disabled={sendMessage.isPending}
                        className="rounded-full border border-border bg-muted/30 px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>
          <ChatInput
            onSend={handleSend}
            disabled={sendMessage.isPending}
            placeholder="Type your message…"
          />
        </div>

        {/* Analytics panel: always mounted on narrow so WebSocket stays connected and receives updates */}
        <div
          id="analytics-panel"
          role="tabpanel"
          aria-labelledby="tab-analytics"
          aria-hidden={narrowTab !== 'analytics'}
          className={`flex-1 overflow-y-auto p-4 lg:hidden ${narrowTab !== 'analytics' ? 'hidden' : ''}`}
        >
          <AnalyticsPanel sessionId={sessionId} />
        </div>
      </div>

      {/* Right sidebar — analytics (desktop) */}
      <aside className="hidden w-80 shrink-0 border-l border-border bg-background lg:block lg:overflow-y-auto">
        <div className="sticky top-0 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Analytics
            </h2>
          </div>
          <AnalyticsPanel sessionId={sessionId} embedded />
        </div>
      </aside>

      <EndSessionModal
        open={endModalOpen}
        onClose={() => setEndModalOpen(false)}
        onConfirm={handleEndSession}
        isPending={endSession.isPending}
      />
    </div>
  );
}
