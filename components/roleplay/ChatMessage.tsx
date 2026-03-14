'use client';

import type { Message } from '@/lib/types';

export interface ChatMessageProps {
  message: Message;
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

export function ChatMessage({ message }: ChatMessageProps) {
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
        <p className="whitespace-pre-wrap text-sm leading-relaxed">
          {message.content}
        </p>
      </div>
    </div>
  );
}
