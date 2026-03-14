'use client';

import type { Message } from '@/lib/types';
import { Card, CardHeader } from '@/components/ui/Card';

export interface TranscriptViewerProps {
  messages: Message[];
}

function formatTime(iso: string) {
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

export function TranscriptViewer({ messages }: TranscriptViewerProps) {
  if (!messages.length) {
    return (
      <Card>
        <CardHeader>Conversation review</CardHeader>
        <p className="text-sm text-muted-foreground">
          No messages in this transcript.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>Conversation review</CardHeader>
      <div className="max-h-[400px] overflow-y-auto space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-lg px-3 py-2 ${
              m.role === 'seller'
                ? 'ml-4 bg-foreground/10'
                : 'mr-4 border border-border bg-card'
            }`}
          >
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span className="font-medium capitalize">{m.role}</span>
              <span>{formatTime(m.timestamp)}</span>
            </div>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
              {m.content}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
