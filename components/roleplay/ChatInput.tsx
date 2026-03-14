'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

const TEXTAREA_MAX_HEIGHT_PX = 96; // ~4 rows

export interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type your message…',
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const height = Math.max(
      44,
      Math.min(el.scrollHeight, TEXTAREA_MAX_HEIGHT_PX),
    );
    el.style.height = `${height}px`;
  }, [value]);

  const submit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  }, [value, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex gap-2 bg-background p-3">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className="min-h-[44px] max-h-[96px] w-full resize-none overflow-y-auto rounded-md border border-border bg-input px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:ring-offset-0 disabled:opacity-50"
        aria-label="Message"
      />
      <Button
        type="button"
        onClick={submit}
        disabled={disabled || !value.trim()}
        className="shrink-0"
      >
        Send
      </Button>
    </div>
  );
}
