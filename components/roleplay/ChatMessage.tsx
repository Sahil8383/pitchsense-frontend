'use client';

import { useEffect, useRef } from 'react';
import type { Message } from '@/lib/types';
import { parseMessageContent, normalizeAction } from '@/lib/chatUtils';

export interface ChatMessageProps {
  message: Message;
  /** Called when the buyer message contains an action (e.g. *hangs up*). Use for UI side effects. */
  onBuyerAction?: (action: string) => void;
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

function BuyerContent({
  content,
  onAction,
}: {
  content: string;
  onAction?: (action: string) => void;
}) {
  const segments = parseMessageContent(content);
  const reportedActions = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!onAction) return;
    const parsed = parseMessageContent(content);
    for (const seg of parsed) {
      if (seg.type === 'action') {
        const key = normalizeAction(seg.content);
        if (!reportedActions.current.has(key)) {
          reportedActions.current.add(key);
          onAction(seg.content);
        }
      }
    }
  }, [content, onAction]);

  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed">
      {segments.map((seg, i) =>
        seg.type === 'text' ? (
          <span key={i}>{seg.content}</span>
        ) : (
          <span
            key={i}
            className="italic text-muted-foreground"
            data-action={seg.content}
            title={`Action: ${seg.content}`}
          >
            *{seg.content}*
          </span>
        ),
      )}
    </p>
  );
}

export function ChatMessage({ message, onBuyerAction }: ChatMessageProps) {
  const isSeller = message.role === 'seller';

  return (
    <div
      className={`flex w-full ${isSeller ? 'justify-end' : 'justify-start'}`}
      data-role={message.role}
    >
      <div
        className={`max-w-[85%] rounded-lg px-4 py-2.5 ${
          isSeller
            ? 'bg-foreground text-background'
            : 'border border-border bg-card text-card-foreground'
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium opacity-80">
            {isSeller ? 'You' : 'Buyer'}
          </span>
          <span className="text-xs opacity-60">
            {formatTime(message.timestamp)}
          </span>
        </div>
        {isSeller ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">
            {message.content}
          </p>
        ) : (
          <BuyerContent content={message.content} onAction={onBuyerAction} />
        )}
      </div>
    </div>
  );
}
